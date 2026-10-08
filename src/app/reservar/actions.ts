'use server';

import { createClient } from '@supabase/supabase-js';
import { createMercadoPagoPreference } from '@/lib/mercadopago';
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
            adventures_catalog (id, title, category, difficulty_level, duration_days, duration_text, base_price, max_pax, description, image_url)
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
    departure_id: string;
    pax_count: number;
    adventure_title: string;
    unit_price: number;
}) {
    const supabase = getAdminClient();
    const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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

    if (existing) {
        adventurerId = existing.id;
    } else {
        const { data: newAdv, error } = await supabase
            .from('crm_adventurers')
            .insert({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                mountain_experience_level: 'Principiante',
                waiver_signed: false,
            })
            .select('id')
            .single();

        if (error || !newAdv) throw new Error('Error al registrar aventurero: ' + error?.message);
        adventurerId = newAdv.id;
    }

    // 2. Create booking record (status: pending_payment)
    const total = formData.unit_price * formData.pax_count;
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            departure_id: formData.departure_id,
            adventurer_id: adventurerId,
            total_price: total,
            amount_paid: 0,
            payment_status: 'pending',
        })
        .select('id')
        .single();

    if (bookingError || !booking) throw new Error('Error al crear reserva: ' + bookingError?.message);

    // 3. Create MercadoPago preference
    const mpResult = await createMercadoPagoPreference({
        title: `${formData.adventure_title} (${formData.pax_count} pax)`,
        unit_price: Math.round(total),
        quantity: 1,
        payer_email: payerEmail,
        external_reference: booking.id,
        back_url_base: base_url,
    });

    if (!mpResult.init_point) throw new Error('Error al crear enlace de pago con MercadoPago');

    return {
        booking_id: booking.id,
        payment_url: mpResult.init_point || mpResult.sandbox_init_point,
        preference_id: mpResult.id,
    };
}
