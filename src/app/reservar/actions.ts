'use server';

import { createClient } from '@supabase/supabase-js';
import { createMercadoPagoPreference } from '@/lib/mercadopago';
import { sendExpeditionTicketEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function getPublicDepartures() {
    const supabase = getAdminClient();
    const { data } = await supabase
        .from('agenda_departures')
        .select(`
            id, start_date, end_date, current_pax, status,
            adventures_catalog (id, title, category, difficulty_level, duration_days, duration_text, base_price, max_pax, description, image_url, price_usd, logistics)
        `)
        .in('status', ['scheduled', 'confirmed'])
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

    return data || [];
}

export async function createBookingWithMercadoPago(formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    emergency_contact?: string;
    medical_info?: string;
    accepts_waiver?: boolean;
    departure_id: string;
    pax_count: number;
    adventure_title: string;
    unit_price: number;
    discount_coupon?: string;
    discount_amount?: number;
    additional_participants?: { first_name: string; last_name: string; email?: string }[];
}) {
    const supabase = getAdminClient();
    const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.santiagohiking.com';
    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    const base_url = isProduction && rawBaseUrl.includes('localhost')
        ? 'https://www.santiagohiking.com'
        : rawBaseUrl;
    const isLocalhost = base_url.includes('localhost');

    // MP Sandbox requires a test buyer email — real emails cause fatal errors in sandbox
    const payerEmail = isLocalhost
        ? 'test_user_123456@testuser.com'  // MP sandbox test buyer email
        : formData.email;

    // 1. Upsert adventurer in CRM
    let adventurerId: string;
    const { data: existing } = await supabase
        .from('crm_adventurers')
        .select('id')
        .eq('email', formData.email)
        .single();

    const adventurerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        emergency_contact_name: formData.emergency_contact,
        medical_conditions: formData.medical_info,
        waiver_signed: formData.accepts_waiver || false,
        waiver_date: formData.accepts_waiver ? new Date().toISOString() : null,
    };

    if (existing) {
        adventurerId = existing.id;
        await supabase.from('crm_adventurers').update(adventurerData).eq('id', adventurerId);
    } else {
        const { data: newAdv, error } = await supabase
            .from('crm_adventurers')
            .insert({
                ...adventurerData,
                mountain_experience_level: 'Principiante',
            })
            .select('id')
            .single();

        if (error || !newAdv) throw new Error('Error al registrar aventurero: ' + error?.message);
        adventurerId = newAdv.id;
    }

    // 2. Create booking record (status: pending_payment)
    const subtotal = formData.unit_price * formData.pax_count;
    const discount = formData.discount_amount || 0;
    const total = Math.max(0, subtotal - discount);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.departure_id);
    let validDepId: string | null = null;
    if (isUuid) {
        const { data: dep } = await supabase.from('agenda_departures').select('id').eq('id', formData.departure_id).single();
        if (dep) validDepId = dep.id;
    }

    // CASO ESPECIAL: CUPÓN 100% GRATIS O PREMIO (Total $0)
    // MercadoPago no acepta pagos de $0 CLP. Confirmamos la reserva directamente.
    if (total <= 0) {
        let bookingId: string = `bk_${Date.now()}`;
        try {
            const { data: booking } = await supabase
                .from('bookings')
                .insert({
                    departure_id: validDepId,
                    adventurer_id: adventurerId,
                    total_price: 0,
                    amount_paid: 0,
                    payment_status: 'paid',
                    status: 'confirmed',
                    waiver_signed: formData.accepts_waiver || false,
                    waiver_signed_at: new Date().toISOString()
                })
                .select('id')
                .single();

            if (booking?.id) bookingId = booking.id;

            // Incrementar current_pax en la salida
            if (validDepId) {
                const { count } = await supabase
                    .from('bookings')
                    .select('*', { count: 'exact', head: true })
                    .eq('departure_id', validDepId);
                
                await supabase
                    .from('agenda_departures')
                    .update({ current_pax: count || formData.pax_count })
                    .eq('id', validDepId);
            }

            // Registrar en sales_ledger como canje promocional / sorteo
            await supabase.from('sales_ledger').insert({
                internal_id: `SH-PROMO-${Date.now().toString().slice(-6)}`,
                adventurer_id: adventurerId,
                booking_id: bookingId,
                total_amount: 0,
                paid_amount: 0,
                status: 'completed',
                payment_method: 'free_promotional'
            });

            // Enviar Expedition Pass por correo automáticamente
            await sendExpeditionTicketEmail({
                to: formData.email,
                name: formData.first_name,
                adventureTitle: formData.adventure_title,
                departureDate: 'Fecha confirmada por sorteo',
                meetingPoint: 'Punto oficial de cordada Santiago Hiking',
                meetingTime: '08:00 hrs',
                totalPaid: '$0 CLP (Ganador Sorteo / Premio)',
                ticketId: bookingId,
                whatsappLink: 'https://wa.me/56984021940'
            });

            revalidatePath('/admin/calendario');
            revalidatePath('/admin/sales');
            revalidatePath('/admin/operaciones');
        } catch (e) {
            console.warn('Error confirming free booking:', e);
        }

        return {
            booking_id: bookingId,
            payment_url: `/reserva/confirmada?booking_id=${bookingId}&status=approved&free=true&payment_id=${bookingId}&external_reference=${bookingId}`,
            is_free: true
        };
    }

    // CASO NORMAL: Pago con MercadoPago (> $0 CLP)
    let bookingId: string = `bk_${Date.now()}`;
    try {
        const { data: booking } = await supabase
            .from('bookings')
            .insert({
                departure_id: validDepId,
                adventurer_id: adventurerId,
                total_price: total,
                amount_paid: 0,
                payment_status: 'pending',
            })
            .select('id')
            .single();

        if (booking?.id) {
            bookingId = booking.id;
        }
    } catch (e) {
        console.warn('Booking record created with fallback reference:', e);
    }

    // 3. Create MercadoPago preference
    const mpResult = await createMercadoPagoPreference({
        title: `${formData.adventure_title} (${formData.pax_count} pax)`,
        unit_price: Math.round(total),
        quantity: 1,
        payer_email: payerEmail,
        external_reference: bookingId,
        back_url_base: base_url,
    });

    if (!mpResult.init_point && !mpResult.sandbox_init_point) {
        throw new Error('Error al conectar con la pasarela de pago. Por favor intenta nuevamente.');
    }

    return {
        booking_id: bookingId,
        payment_url: mpResult.init_point || mpResult.sandbox_init_point,
        preference_id: mpResult.id,
    };
}
