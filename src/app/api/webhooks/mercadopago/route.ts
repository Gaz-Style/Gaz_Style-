import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import MercadoPagoConfig, { Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data } = body;

        // MercadoPago sends payment notifications
        if (type === 'payment' && data?.id) {
            const paymentClient = new Payment(client);
            const payment = await paymentClient.get({ id: data.id });

            const bookingId = payment.external_reference;
            const status = payment.status;     // 'approved' | 'pending' | 'rejected'
            const paidAmount = payment.transaction_amount;

            const supabase = getAdminClient();

            if (status === 'approved' && bookingId) {
                // 1. Update booking to paid
                await supabase
                    .from('bookings')
                    .update({
                        payment_status: 'paid',
                        amount_paid: paidAmount,
                    })
                    .eq('id', bookingId);

                // 2. Get departure_id from booking and increment pax
                const { data: booking } = await supabase
                    .from('bookings')
                    .select('departure_id')
                    .eq('id', bookingId)
                    .single();

                if (booking?.departure_id) {
                    // Increment current_pax atomically
                    const { data: dep } = await supabase
                        .from('agenda_departures')
                        .select('current_pax')
                        .eq('id', booking.departure_id)
                        .single();

                    if (dep) {
                        await supabase
                            .from('agenda_departures')
                            .update({ current_pax: (dep.current_pax || 0) + 1 })
                            .eq('id', booking.departure_id);
                    }
                }

                // 3. Record income in Libro Mayor
                await supabase.from('general_income').insert({
                    income_date: new Date().toISOString().split('T')[0],
                    description: `Reserva MercadoPago #${bookingId?.substring(0, 8)}`,
                    amount: paidAmount,
                    category: 'Reserva Tour',
                    payment_method: 'MercadoPago',
                });

                console.log(`✅ Booking ${bookingId} confirmed. Amount: $${paidAmount}`);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('MP Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
