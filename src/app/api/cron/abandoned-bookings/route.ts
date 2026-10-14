import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET(request: Request) {
    try {
        const supabase = getAdminClient();
        
        // Ventana de tiempo: Reservas pendientes creadas entre 3 minutos y 60 minutos atrás
        const now = Date.now();
        const minTime = new Date(now - 60 * 60 * 1000).toISOString();
        const maxTime = new Date(now - 3 * 60 * 1000).toISOString();

        const { data: pendingBookings, error } = await supabase
            .from('bookings')
            .select(`
                id, booking_date, created_at, payment_status,
                adventurer:crm_adventurers (id, first_name, full_name, phone, email),
                departure:agenda_departures (
                    start_date,
                    adventures_catalog (id, title, base_price)
                )
            `)
            .eq('payment_status', 'pending')
            .gte('booking_date', minTime)
            .lte('booking_date', maxTime);

        if (error) {
            console.error('[Abandoned Bookings] Error query:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        let sentCount = 0;

        for (const bk of (pendingBookings || [])) {
            const adv = bk.adventurer as any;
            const dep = bk.departure as any;
            const routeTitle = dep?.adventures_catalog?.title || 'tu salida de montaña';
            const clientPhone = adv?.phone;

            if (!clientPhone) continue;

            const clientName = adv.first_name || adv.full_name?.split(' ')[0] || 'Aventurero';
            const cleanPhone = clientPhone.replace(/\D/g, '');
            if (!cleanPhone) continue;

            // Verificar si ya le enviamos mensaje en crm_whatsapp_messages recientemente
            let { data: existingChat } = await supabase
                .from('crm_whatsapp_chats')
                .select('id')
                .eq('phone_number', cleanPhone)
                .maybeSingle();

            if (existingChat) {
                // Verificar si ya se envió mensaje de recuperación
                const { data: recentMsgs } = await supabase
                    .from('crm_whatsapp_messages')
                    .select('id, content')
                    .eq('chat_id', existingChat.id)
                    .ilike('content', '%no se completó el pago%')
                    .limit(1);

                if (recentMsgs && recentMsgs.length > 0) {
                    continue; // Ya fue contactado para esta recuperación
                }
            } else {
                // Crear chat si no existe aún
                const { data: newChat } = await supabase
                    .from('crm_whatsapp_chats')
                    .insert({
                        phone_number: cleanPhone,
                        session_status: 'bot',
                        customer_id: adv.id || null,
                        last_message_at: new Date().toISOString(),
                    })
                    .select('id')
                    .maybeSingle();
                existingChat = newChat;
            }

            const followUpMessage = 
                `Hola ${clientName}! 🏔️ Te escribo de Santiago Hiking.\n\n` +
                `Vimos que iniciaste tu reserva para *${routeTitle}*, pero el pago aún no se completó. ¿Tuviste algún inconveniente con la plataforma o el medio de pago?\n\n` +
                `Si lo prefieres, te puedo tomar los datos directamente por aquí (nombre y correo) y te genero tu link de pago directo para asegurar tu cupo de inmediato antes de que se agoten las plazas 🥾`;

            const result = await sendWhatsAppMessage(cleanPhone, followUpMessage);
            if (result.success) {
                sentCount++;
                if (existingChat?.id) {
                    await supabase.from('crm_whatsapp_messages').insert({
                        chat_id: existingChat.id,
                        sender_type: 'bot',
                        message_type: 'text',
                        content: followUpMessage
                    });
                    await supabase.from('crm_whatsapp_chats').update({
                        session_status: 'bot',
                        last_message_at: new Date().toISOString(),
                        last_message: followUpMessage.slice(0, 200)
                    }).eq('id', existingChat.id);
                }
            }
        }

        return NextResponse.json({
            success: true,
            pendingFound: pendingBookings?.length || 0,
            recoveryMessagesSent: sentCount
        });

    } catch (e: any) {
        console.error('[Abandoned Bookings Cron] Exception:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
