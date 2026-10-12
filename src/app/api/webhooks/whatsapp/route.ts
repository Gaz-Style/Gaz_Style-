import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processDirectWhatsAppMessage } from '@/lib/whatsapp/deepseek-agent';

function getSupabaseClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
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
                        const { data: newChat, error: chatError } = await supabase
                            .from('crm_whatsapp_chats')
                            .insert([{
                                phone_number: phoneNumber,
                                session_status: 'bot',
                                last_interaction: new Date().toISOString()
                            }])
                            .select()
                            .single();

                        if (chatError || !newChat) {
                            console.error('Error creating chat session:', chatError);
                            continue;
                        }
                        chatData = newChat;

                        // Try to link to existing customer
                        const { data: adventurers } = await supabase
                            .from('adventurers')
                            .select('id, phone')
                            .not('phone', 'is', null);
                        
                        const cleanDigits = (n: string) => n ? n.replace(/\D/g, '') : '';
                        const chatDigits = cleanDigits(phoneNumber);
                        
                        if (adventurers) {
                            const match = adventurers.find(c => {
                                const custDigits = cleanDigits(c.phone);
                                return custDigits && (custDigits.slice(-9) === chatDigits.slice(-9));
                            });
                            if (match) {
                                await supabase
                                    .from('crm_whatsapp_chats')
                                    .update({ customer_id: match.id })
                                    .eq('id', chatData.id);
                            }
                        }
                    }

                    // 2. Parse message content
                    let content = '';
                    let messageType = 'text';
                    let mediaUrl = null;
                    let geminiAnalysis = null;

                    if (message.type === 'text') {
                        content = message.text.body;
                    } else if (message.type === 'image') {
                        messageType = 'image';
                        mediaUrl = message.image.id; 
                        content = message.image.caption || '';
                        
                        // El procesamiento de la imagen con Gemini Vision se ha movido al orquestador asíncrono
                        // para evitar que WhatsApp de timeout (límite de 3 segundos).
                        if (mediaUrl) {
                            console.log(`[Webhook] Imagen recibida: ${mediaUrl}. Se procesará en background.`);
                        }
                    } else if (message.type === 'audio') {
                        messageType = 'audio';
                        mediaUrl = message.audio.id;
                    } else if (message.type === 'document') {
                        // Muchos clientes envían fotos como documentos para no perder calidad.
                        // Lo pasamos como 'image' para que la IA intente procesar la Media ID.
                        messageType = 'image';
                        mediaUrl = message.document.id;
                        content = message.document.caption || '';
                        console.log(`[Webhook] Documento adjunto recibido: ${mediaUrl}. Intentando procesar como imagen.`);
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

                    // 3. Save user message to datab                    // 3. Save user message to database (safe, does not block execution)
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

                    // Update last_interaction timestamp on chat session
                    try {
                        await supabase
                            .from('crm_whatsapp_chats')
                            .update({ last_interaction: new Date().toISOString() })
                            .eq('id', chatData.id);
                    } catch (updateErr) {
                        console.warn('[Webhook] Could not update chat interaction:', updateErr);
                    }

                    // 4. Trigger AI Processing immediately if session is 'bot'
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
