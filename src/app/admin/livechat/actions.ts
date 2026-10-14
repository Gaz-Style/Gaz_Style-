'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function getWhatsAppChatsAction(): Promise<any[]> {
    const admin = getAdminClient();
    let chatList: any[] = [];

    try {
        // Consultar los chats existentes
        const { data: rawChats, error } = await admin
            .from('crm_whatsapp_chats')
            .select('*')
            .order('last_message_at', { ascending: false, nullsFirst: false });

        if (error) {
            console.error('Error fetching chats from Supabase:', error.message || error);
            return [];
        }

        chatList = rawChats || [];

        // Vincular con la ficha real de aventureros en crm_adventurers (ordenados por el más reciente)
        if (chatList.length > 0) {
            const { data: adventurers, error: advError } = await admin
                .from('crm_adventurers')
                .select('*')
                .order('created_at', { ascending: false });

            if (advError) {
                console.error('Error fetching adventurers:', advError);
            }

            if (adventurers && adventurers.length > 0) {
                const cleanDigits = (n: string) => n ? n.replace(/\D/g, '') : '';
                
                chatList = chatList.map((chat: any) => {
                    const chatDigits = cleanDigits(chat.phone_number);
                    if (!chatDigits) return chat;

                    // Buscar por ID o por coincidencia en los últimos 8 o 9 dígitos
                    const match = adventurers.find((adv: any) => {
                        if (chat.customer_id && chat.customer_id === adv.id) return true;
                        const advDigits = cleanDigits(adv.phone);
                        return advDigits && (
                            advDigits.slice(-8) === chatDigits.slice(-8) ||
                            advDigits.slice(-9) === chatDigits.slice(-9)
                        );
                    });

                    if (match) {
                        return {
                            ...chat,
                            customer_id: match.id,
                            customers: {
                                id: match.id,
                                full_name: `${match.first_name || ''} ${match.last_name || ''}`.trim() || 'Aventurero',
                                phone: match.phone,
                                email: match.email || 'Sin correo registrado',
                                emergency_contact: match.emergency_contact_name ? `${match.emergency_contact_name} ${match.emergency_contact_phone ? `(${match.emergency_contact_phone})` : ''}` : 'No asignado',
                                blood_type: match.blood_type || 'No declarado',
                                medical_notes: [match.medical_conditions, match.severe_allergies].filter(Boolean).join(' | ') || null,
                                total_ascents: 0
                            }
                        };
                    }

                    return chat;
                });
            }
        }
    } catch (e: any) {
        console.error('Catch error in getWhatsAppChatsAction:', e.message || e);
        return [];
    }

    return chatList;
}

export async function getWhatsAppMessagesAction(chatId: string) {
    const admin = getAdminClient();
    const { data, error } = await admin
        .from('crm_whatsapp_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data || [];
}

export async function sendWhatsAppMessageAction(chatId: string, content: string) {
    const admin = getAdminClient();
    
    // 1. Insert message into DB as human (Operador Santiago Hiking)
    const { error: insertError } = await admin
        .from('crm_whatsapp_messages')
        .insert([{
            chat_id: chatId,
            sender_type: 'human',
            message_type: 'text',
            content: content
        }]);

    if (insertError) {
        return { success: false, error: insertError.message };
    }

    // 2. Put chat in human_handoff so AI does not interrupt the conversation
    await admin
        .from('crm_whatsapp_chats')
        .update({
            session_status: 'human_handoff',
            last_message_at: new Date().toISOString()
        })
        .eq('id', chatId);

    // 3. Send via WhatsApp Cloud API if configured
    const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (WHATSAPP_API_TOKEN && PHONE_NUMBER_ID) {
        const { data: chatData } = await admin
            .from('crm_whatsapp_chats')
            .select('phone_number')
            .eq('id', chatId)
            .single();

        if (chatData?.phone_number) {
            const cleanPhone = chatData.phone_number.replace(/\D/g, '');
            try {
                const wRes = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messaging_product: 'whatsapp',
                        to: cleanPhone,
                        type: 'text',
                        text: { body: content }
                    })
                });
                const wData = await wRes.json();
                console.log('[LiveChat] Meta API outbound response:', wData);
                if (wData.error) {
                    return { success: false, error: wData.error.message };
                }
            } catch (e: any) {
                console.error('Error sending WhatsApp from LiveChat:', e);
                return { success: false, error: e.message };
            }
        }
    }

    return { success: true };
}

export async function toggleBotSessionAction(chatId: string, enableBot: boolean) {
    const admin = getAdminClient();
    const status = enableBot ? 'bot' : 'human_handoff';
    
    const { error } = await admin
        .from('crm_whatsapp_chats')
        .update({ session_status: status })
        .eq('id', chatId);
        
    return { success: !error, error: error?.message };
}

export async function createOrStartChatAction(rawPhone: string) {
    const cleanDigits = rawPhone.replace(/\D/g, '');
    if (cleanDigits.length < 8) {
        return { success: false, error: 'Número de teléfono inválido.' };
    }

    // Normalizar a formato internacional si es chileno
    let formattedPhone = cleanDigits;
    if (cleanDigits.length === 9 && cleanDigits.startsWith('9')) {
        formattedPhone = `56${cleanDigits}`;
    } else if (cleanDigits.length === 8) {
        formattedPhone = `569${cleanDigits}`;
    }

    const adminClient = getAdminClient();

    // 1. Verificar si ya existe un chat con ese número
    const { data: existingChat } = await adminClient
        .from('crm_whatsapp_chats')
        .select('*')
        .or(`phone_number.eq.${formattedPhone},phone_number.eq.+${formattedPhone},phone_number.eq.${cleanDigits}`)
        .maybeSingle();

    if (existingChat) {
        return { success: true, chat: existingChat };
    }

    // 2. Buscar si coincide con algún aventurero registrado en crm_adventurers
    let matchedCustomer: any = null;
    try {
        const { data: adv } = await adminClient
            .from('crm_adventurers')
            .select('*')
            .ilike('phone', `%${cleanDigits.slice(-8)}%`)
            .maybeSingle();

        if (adv) {
            matchedCustomer = {
                id: adv.id,
                full_name: `${adv.first_name || ''} ${adv.last_name || ''}`.trim() || 'Aventurero',
                phone: adv.phone,
                email: adv.email || 'Sin correo registrado',
                emergency_contact: adv.emergency_contact_name ? `${adv.emergency_contact_name} ${adv.emergency_contact_phone ? `(${adv.emergency_contact_phone})` : ''}` : 'No asignado',
                blood_type: adv.blood_type || 'No declarado',
                medical_notes: [adv.medical_conditions, adv.severe_allergies].filter(Boolean).join(' | ') || null,
                total_ascents: 0
            };
        }
    } catch (advErr) {
        console.error('Error finding matching adventurer:', advErr);
    }

    // 3. Crear nuevo chat usando SOLO las columnas base seguras
    const insertPayload: any = {
        phone_number: formattedPhone,
        session_status: 'human_handoff',
        last_message_at: new Date().toISOString()
    };

    const { data: newChat, error: createError } = await adminClient
        .from('crm_whatsapp_chats')
        .insert([insertPayload])
        .select()
        .single();

    if (createError) {
        console.error('Error creating chat:', createError);
        // Si el error es por el trigger antiguo de customers
        if (createError.message?.includes('public.customers')) {
            return { 
                success: false, 
                error: 'Por favor ejecuta el script actualizado en supabase_whatsapp_livechat.sql dentro del SQL Editor de Supabase para actualizar los triggers.' 
            };
        }
        return { success: false, error: createError.message };
    }

    if (matchedCustomer) {
        newChat.customers = matchedCustomer;
    }

    return { success: true, chat: newChat };
}
