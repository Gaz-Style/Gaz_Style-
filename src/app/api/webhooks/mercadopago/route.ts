import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

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

                // 2. Fetch booking details with adventurer and departure
                const { data: booking } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        departure_id,
                        adventurer_id,
                        total_price,
                        amount_paid,
                        adventurer:crm_adventurers (
                            id,
                            first_name,
                            last_name,
                            full_name,
                            phone,
                            email
                        ),
                        departure:agenda_departures (
                            id,
                            start_date,
                            current_pax,
                            adventures_catalog (
                                title
                            )
                        )
                    `)
                    .eq('id', bookingId)
                    .maybeSingle();

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

                // 4. Send automated WhatsApp confirmation to customer (Luxury Pass notification)
                const adv = booking?.adventurer as any;
                const dep = booking?.departure as any;
                const clientName = adv?.first_name || adv?.full_name?.split(' ')[0] || 'Aventurero';
                const clientEmail = adv?.email || 'tu correo registrado';
                const routeTitle = dep?.adventures_catalog?.title || 'tu aventura de montaña';

                let formattedDate = 'la fecha reservada';
                if (dep?.start_date) {
                    try {
                        formattedDate = new Date(dep.start_date).toLocaleDateString('es-CL', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        });
                    } catch (_) {}
                }

                if (adv?.phone) {
                    const clientPhone = adv.phone.replace(/\D/g, '');
                    const customerMsg =
                        `¡Tu aventura está 100% confirmada! 🏔️✨\n\n` +
                        `Hola ${clientName}, confirmamos la recepción de tu pago de $${Number(paidAmount).toLocaleString('es-CL')} CLP para *${routeTitle}* (${formattedDate}).\n\n` +
                        `Acabamos de emitir y enviar a tu correo (*${clientEmail}*) el comprobante oficial y tu *Expedition Pass* con las coordenadas del punto de encuentro, horarios, equipamiento requerido y contacto de tu guía.\n\n` +
                        `¡Nos vemos en la montaña! Si tienes cualquier consulta previa, puedes responder directamente a este mensaje.`;

                    await sendWhatsAppMessage(clientPhone, customerMsg);

                    // Registrar en el LiveChat/CRM
                    try {
                        let { data: chat } = await supabase
                            .from('crm_whatsapp_chats')
                            .select('id')
                            .eq('phone_number', clientPhone)
                            .maybeSingle();

                        if (!chat) {
                            const { data: newChat } = await supabase
                                .from('crm_whatsapp_chats')
                                .insert({
                                    phone_number: clientPhone,
                                    session_status: 'bot',
                                    customer_id: adv.id || null,
                                    last_message: customerMsg.slice(0, 200),
                                    last_message_at: new Date().toISOString(),
                                })
                                .select('id')
                                .maybeSingle();
                            chat = newChat;
                        }

                        if (chat?.id) {
                            await supabase.from('crm_whatsapp_messages').insert({
                                chat_id: chat.id,
                                sender_type: 'bot',
                                message_type: 'text',
                                content: customerMsg,
                            });
                            await supabase
                                .from('crm_whatsapp_chats')
                                .update({
                                    last_message: customerMsg.slice(0, 200),
                                    last_message_at: new Date().toISOString(),
                                })
                                .eq('id', chat.id);
                        }
                    } catch (crmErr) {
                        console.error('Error logging WhatsApp confirmation in CRM:', crmErr);
                    }
                }

                // 5. Send instant alert to Mario Cruz (Founder / Admin)
                try {
                    const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE || '56984021940';
                    const adminAlert =
                        `🔔 ¡NUEVA RESERVA CONFIRMADA Y PAGADA!\n\n` +
                        `👤 Cliente: ${adv?.full_name || clientName}\n` +
                        `📞 Teléfono: ${adv?.phone || 'No registrado'}\n` +
                        `📧 Correo: ${adv?.email || 'No registrado'}\n` +
                        `🏔️ Ruta: ${routeTitle}\n` +
                        `📅 Fecha: ${formattedDate}\n` +
                        `💰 Monto: $${Number(paidAmount).toLocaleString('es-CL')} CLP\n` +
                        `🎫 ID Reserva: #${bookingId.substring(0, 8)}`;
                    await sendWhatsAppMessage(adminPhone, adminAlert);
                } catch (adminErr) {
                    console.error('Error sending WhatsApp alert to admin:', adminErr);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('MP Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
