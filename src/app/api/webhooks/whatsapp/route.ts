import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processDirectWhatsAppMessage } from '@/lib/whatsapp/deepseek-agent';

function getSupabaseClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// Notifica a Mario Cruz (dueño) a su WhatsApp personal cada vez que un cliente escribe
async function notifyOwnerOfIncomingWhatsApp({
    customerPhone,
    customerName,
    messageContent,
    chatId
}: {
    customerPhone: string;
    customerName?: string | null;
    messageContent: string;
    chatId: string;
}) {
    const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE || '56984021940';
    const cleanAdmin = adminPhone.replace(/\D/g, '');
    const cleanCustomer = customerPhone.replace(/\D/g, '');

    // Evitar auto-notificarse si Mario Cruz es quien escribe
    if (cleanCustomer === cleanAdmin || (cleanAdmin.length >= 8 && cleanCustomer.endsWith(cleanAdmin.slice(-8)))) {
        return;
    }

    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
        console.warn('[Notify Owner] Falta WHATSAPP_API_TOKEN o WHATSAPP_PHONE_NUMBER_ID');
        return;
    }

    const preview = messageContent 
        ? (messageContent.length > 180 ? `${messageContent.substring(0, 177)}...` : messageContent) 
        : '[Archivo adjunto / multimedia]';

    // LÓGICA ELENA: Si está registrado tiene el nombre; si no está registrado, solo tiene el número.
    const isRegistered = Boolean(customerName && customerName.trim() && customerName !== 'Cliente');
    const customerLabel = isRegistered 
        ? `${customerName!.trim()} ✅ (Registrado)` 
        : `No registrado ⚠️ (Solo número)`;

    const lower = (messageContent || '').toLowerCase();
    const isMercenario = lower.includes('mercenario') || lower.includes('software') || lower.includes('sistema') || lower.includes('clinica') || lower.includes('ecommerce') || lower.includes('automatiz');
    const brandHeader = isMercenario ? `⚡ *Mercenario — Mensaje Entrante*` : `🏔️ *Santiago Hiking — Mensaje Entrante*`;
    const adminLink = isMercenario ? `https://mercenario.cl/admin` : `https://www.santiagohiking.com/admin/livechat`;

    const textBody = 
        `${brandHeader}\n\n` +
        `👤 *Cliente:* ${customerLabel}\n` +
        `📱 *WhatsApp:* +${cleanCustomer}\n` +
        `💬 *Mensaje:* "${preview}"\n\n` +
        `👉 *Responder en el Panel LiveChat:*\n` +
        `${adminLink}`;

    try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: cleanAdmin,
                type: 'text',
                text: { body: textBody }
            })
        });

        const data = await res.json();
        if (!res.ok || data.error) {
            console.error('[Notify Owner] Error al notificar a Mario Cruz en WhatsApp:', data);
        } else {
            console.log(`[Notify Owner] Notificación WhatsApp enviada con éxito a Mario Cruz (+${cleanAdmin})`);
        }
    } catch (err) {
        console.error('[Notify Owner] Excepción al enviar notificación WhatsApp a Mario Cruz:', err);
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode && token) {
        const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'gazstyle_wa_verify_2026';
        if (mode === 'subscribe' && token === expectedToken) {
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }
    return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(req: Request) {
    try {
        const supabase = getSupabaseClient();
        const body = await req.json();

        if (body.object === 'whatsapp_business_account') {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    const value = change.value;
                    const message = value.messages?.[0];

                    if (!message) continue;

                    const phoneNumber = value.contacts?.[0]?.wa_id;
                    const contactName = value.contacts?.[0]?.profile?.name || 'Cliente';
                    const messageId = message.id;

                    // 1. Get or create Chat Session
                    let { data: chatData } = await supabase
                        .from('crm_whatsapp_chats')
                        .select('*')
                        .eq('phone_number', phoneNumber)
                        .single();

                    if (!chatData) {
                        try {
                            const { data: newChat, error: chatError } = await supabase
                                .from('crm_whatsapp_chats')
                                .insert([{
                                    phone_number: phoneNumber,
                                    session_status: 'bot',
                                    last_message_at: new Date().toISOString()
                                }])
                                .select()
                                .single();

                            if (newChat) {
                                chatData = newChat;
                            } else {
                                console.warn('[Webhook] Note creating chat:', chatError);
                                chatData = { id: phoneNumber, session_status: 'bot' };
                            }
                        } catch (err) {
                            console.warn('[Webhook] Exception in chat creation:', err);
                            chatData = { id: phoneNumber, session_status: 'bot' };
                        }
                    }

                    // 2. Parse message content
                    let content = '';
                    let messageType = 'text';
                    let mediaUrl = null;

                    if (message.type === 'text') {
                        content = message.text.body;
                    } else if (message.type === 'image') {
                        messageType = 'image';
                        mediaUrl = message.image.id; 
                        content = message.image.caption || '';
                        if (mediaUrl) {
                            console.log(`[Webhook] Imagen recibida: ${mediaUrl}.`);
                        }
                    } else if (message.type === 'audio') {
                        messageType = 'audio';
                        mediaUrl = message.audio.id;
                    } else if (message.type === 'document') {
                        messageType = 'image';
                        mediaUrl = message.document.id;
                        content = message.document.caption || '';
                        console.log(`[Webhook] Documento adjunto recibido: ${mediaUrl}.`);
                    } else if (message.type === 'sticker') {
                        messageType = 'text';
                        content = '[Sticker enviado]';
                    } else if (message.type === 'reaction') {
                        messageType = 'text';
                        content = `[Reaccionó con ${message.reaction?.emoji || 'un emoji'}]`;
                    } else if (message.type === 'video') {
                        messageType = 'text';
                        content = '[Video enviado - Formato no soportado por IA]';
                    } else {
                        messageType = 'text';
                        content = `[Formato de archivo o mensaje no soportado: ${message.type}]`;
                    }

                    // 3. Save user message to database (safe, does not block execution)
                    try {
                        await supabase
                            .from('crm_whatsapp_messages')
                            .insert([{
                                chat_id: chatData.id,
                                sender_type: 'customer',
                                message_type: messageType,
                                content: content,
                                media_url: mediaUrl
                            }]);
                    } catch (msgError) {
                        console.warn('[Webhook] Could not save message to crm_whatsapp_messages:', msgError);
                    }

                    // Update last_message_at and last_message preview on chat session
                    try {
                        await supabase
                            .from('crm_whatsapp_chats')
                            .update({ 
                                last_message_at: new Date().toISOString(),
                                last_message: content ? content.slice(0, 200) : `[${messageType}]`
                            })
                            .eq('phone_number', phoneNumber);
                    } catch (updateErr) {
                        console.warn('[Webhook] Could not update chat interaction:', updateErr);
                    }

                    // 4. LÓGICA ELENA: Verificar si el cliente está registrado en el CRM de Aventureros
                    let registeredName: string | null = null;
                    try {
                        const cleanDigits = phoneNumber.replace(/\D/g, '');
                        const { data: adventurer } = await supabase
                            .from('crm_adventurers')
                            .select('id, full_name, first_name, last_name')
                            .or(`phone.eq.${cleanDigits},phone.ilike.%${cleanDigits.slice(-8)}%`)
                            .limit(1)
                            .maybeSingle();

                        if (adventurer) {
                            registeredName = adventurer.full_name || `${adventurer.first_name || ''} ${adventurer.last_name || ''}`.trim() || null;
                            // Vincular el customer_id al chat si no estaba vinculado
                            if (adventurer.id && !chatData.customer_id) {
                                await supabase
                                    .from('crm_whatsapp_chats')
                                    .update({ customer_id: adventurer.id })
                                    .eq('id', chatData.id);
                            }
                        }
                    } catch (e) {
                        // ignore lookup error
                    }

                    // 5. Notificar a Mario Cruz (dueño) de forma inmediata e independiente
                    notifyOwnerOfIncomingWhatsApp({
                        customerPhone: phoneNumber,
                        customerName: registeredName,
                        messageContent: content || `[${messageType}]`,
                        chatId: chatData.id
                    }).catch(notifErr => console.error('[Webhook] Error en notificación a Mario Cruz:', notifErr));

                    // 6. Trigger AI Processing immediately if session is 'bot'
                    if (chatData.session_status === 'bot' && content) {
                        try {
                            console.log(`[Webhook] Generando respuesta con DeepSeek para ${phoneNumber}: "${content}"`);
                            await processDirectWhatsAppMessage(chatData.id, phoneNumber, content);
                            console.log(`[Webhook] Respuesta enviada con éxito a ${phoneNumber}`);
                        } catch (aiErr) {
                            console.error('[Webhook] Error invocando DeepSeek bot:', aiErr);
                        }
                    }
                }
            }
        }

        return NextResponse.json({ status: 'success' }, { status: 200 });

    } catch (error) {
        console.error('Error processing WhatsApp Webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
