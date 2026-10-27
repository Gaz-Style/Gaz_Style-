import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function processDirectWhatsAppMessage(
    chatId: string,
    phoneNumber: string,
    userMessage: string
) {
    const supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const deepseekKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
        if (!deepseekKey) {
            console.error("DeepSeek API Key not found");
            return;
        }

        // Obtener historial reciente del chat (últimos 6 mensajes)
        const { data: pastMsgs } = await supabase
            .from('crm_whatsapp_messages')
            .select('sender_type, content')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: false })
            .limit(6);
        
        let conversationHistory: any[] = [];
        if (pastMsgs && pastMsgs.length > 0) {
            conversationHistory = pastMsgs.reverse().map((m: any) => ({
                role: m.sender_type === 'customer' ? 'user' : 'assistant',
                content: m.content || ''
            }));
        }

        // Asegurar que el último mensaje del usuario esté en el historial
        if (conversationHistory.length === 0 || conversationHistory[conversationHistory.length - 1].content !== userMessage) {
            conversationHistory.push({ role: 'user', content: userMessage });
        }

        // =========================================================================
        // LÓGICA ELENA: Registro y captura de cliente
        // Si el cliente está registrado en el CRM, tenemos el nombre.
        // Si NO está registrado, solo tenemos el número y el bot solicita los datos.
        // =========================================================================
        const cleanDigits = phoneNumber.replace(/\D/g, '');
        let registeredAdventurer: { id: string; name: string; email?: string | null } | null = null;

        try {
            const { data: adv } = await supabase
                .from('crm_adventurers')
                .select('id, full_name, first_name, last_name, email')
                .or(`phone.eq.${cleanDigits},phone.ilike.%${cleanDigits.slice(-8)}%`)
                .limit(1)
                .maybeSingle();

            if (adv) {
                const advName = adv.full_name || `${adv.first_name || ''} ${adv.last_name || ''}`.trim();
                if (advName) {
                    registeredAdventurer = {
                        id: adv.id,
                        name: advName,
                        email: adv.email
                    };
                }
            }
        } catch (advLookupErr) {
            console.warn('[DeepSeek Agent] Error lookup adventurer:', advLookupErr);
        }

        // Si NO está registrado, verificar si en el mensaje actual el usuario proporcionó su nombre / correo
        if (!registeredAdventurer && userMessage) {
            try {
                // Detectar patrones comunes de presentación: "Me llamo Juan Pérez", "Mi nombre es ...", "Soy ..."
                const namePattern = /(?:me llamo|mi nombre es|soy)\s+([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,}){1,3})/i;
                const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

                const nameMatch = userMessage.match(namePattern);
                const emailMatch = userMessage.match(emailPattern);

                if (nameMatch) {
                    const extractedName = nameMatch[1].trim();
                    const extractedEmail = emailMatch ? emailMatch[0].trim().toLowerCase() : null;
                    const parts = extractedName.split(' ');
                    const firstName = parts[0];
                    const lastName = parts.slice(1).join(' ') || '';

                    const { data: newAdv } = await supabase
                        .from('crm_adventurers')
                        .insert({
                            first_name: firstName,
                            last_name: lastName,
                            full_name: extractedName,
                            phone: cleanDigits,
                            email: extractedEmail,
                            mountain_experience_level: 'principiante'
                        })
                        .select('id, full_name, email')
                        .single();

                    if (newAdv) {
                        registeredAdventurer = {
                            id: newAdv.id,
                            name: newAdv.full_name || extractedName,
                            email: newAdv.email
                        };

                        // Vincular sesión de chat
                        await supabase
                            .from('crm_whatsapp_chats')
                            .update({ customer_id: newAdv.id })
                            .eq('id', chatId);

                        console.log(`[DeepSeek Agent] Cliente registrado exitosamente (Lógica Elena): ${extractedName}`);
                    }
                }
            } catch (autoRegErr) {
                console.warn('[DeepSeek Agent] Error al procesar auto-registro:', autoRegErr);
            }
        }

        // =========================================================================
        // MOTOR RAG (Retrieval-Augmented Generation): Solo lectura en tiempo real
        // Consulta adventures_catalog y agenda_departures para inyectar tarifas y fechas reales
        // =========================================================================
        let catalogContext = 'No hay rutas cargadas en este momento.';
        try {
            const today = new Date().toISOString().split('T')[0];
            const [catalogRes, departuresRes] = await Promise.all([
                supabase
                    .from('adventures_catalog')
                    .select('id, title, category, base_price, price_usd, difficulty_level, duration_text, tagline, description')
                    .eq('is_active', true)
                    .order('base_price', { ascending: true }),
                supabase
                    .from('agenda_departures')
                    .select('start_date, status, current_pax, adventures_catalog(id, title, max_pax)')
                    .gte('start_date', today)
                    .in('status', ['scheduled', 'confirmed'])
                    .order('start_date', { ascending: true })
                    .limit(10)
            ]);

            const activeRoutes = catalogRes.data || [];
            const upcomingDepartures = departuresRes.data || [];

            if (activeRoutes.length > 0) {
                catalogContext = activeRoutes.map(route => {
                    const priceClp = Number(route.base_price).toLocaleString('es-CL');
                    const priceUsd = route.price_usd ? ` / ${route.price_usd}` : ` / ~$${Math.round(route.base_price / 930)} USD`;
                    const duration = route.duration_text ? ` | Duración: ${route.duration_text}` : '';
                    const diff = route.difficulty_level ? ` | Nivel: ${route.difficulty_level}` : '';
                    const tagline = route.tagline ? ` | Resumen: ${route.tagline}` : '';
                    
                    // Buscar próximas fechas programadas para esta ruta
                    const routeDeps = upcomingDepartures
                        .filter((d: any) => d.adventures_catalog?.id === route.id || d.adventures_catalog?.title === route.title)
                        .map((d: any) => {
                            const spotsLeft = (d.adventures_catalog?.max_pax || 12) - (d.current_pax || 0);
                            return `${d.start_date} (${spotsLeft > 0 ? spotsLeft + ' cupos' : 'Agotado'})`;
                        });

                    const nextDates = routeDeps.length > 0 ? ` | Próximas salidas: ${routeDeps.join(', ')}` : '';
                    const directLink = `https://www.santiagohiking.com/reservar?route=${route.id}`;

                    return `• ${route.title} [${route.category}]: $${priceClp} CLP${priceUsd}${diff}${duration}${tagline}${nextDates} | Enlace directo: ${directLink}`;
                }).join('\n');
            }
        } catch (dbErr) {
            console.error('[RAG Engine] Error al consultar catálogo en base de datos:', dbErr);
        }

        // =========================================================================
        // CANAL 100% DEDICADO A MERCENARIO (SOFTWARE, CLÍNICAS Y AUTOMATIZACIÓN)
        // =========================================================================
        // Sanitizar historial de mensajes previos para eliminar residuos de pruebas anteriores
        const sanitizedHistory = conversationHistory.filter((m: any) => {
            const c = (m.content || '').toLowerCase();
            return !c.includes('weke') &&
                   !c.includes('gredos') &&
                   !c.includes('chaqueta') &&
                   !c.includes('prenda') &&
                   !c.includes('parka') &&
                   !c.includes('no el de weke') &&
                   !c.includes('no es weke');
        });

        const currentLower = (userMessage || '').toLowerCase();

        // Si el usuario pregunta expresamente por turismo/montaña/Santiago Hiking, orientarlo a su canal respectivo
        const isHikingQuery = currentLower.includes('santiago hiking') ||
            currentLower.includes('trekking') ||
            currentLower.includes('cumbre') ||
            currentLower.includes('hike and fly') ||
            currentLower.includes('expedicion') ||
            currentLower.includes('expedición') ||
            (currentLower.includes('cerro') && (currentLower.includes('subir') || currentLower.includes('salida') || currentLower.includes('plomo') || currentLower.includes('pintor') || currentLower.includes('manquehue')));

        let systemPrompt = '';
        let fallbackReply = '';

        if (isHikingQuery) {
            systemPrompt = `Eres el Asistente Virtual Oficial de "Mercenario" (https://mercenario.cl).
El usuario está consultando por turismo, trekking o salidas de montaña de Santiago Hiking.
DIRECTIVA:
- Aclara de forma muy cortés y concisa que esta línea de WhatsApp oficial está dedicada exclusivamente a "Mercenario" (Sistemas Comerciales, Software y Automatización con IA).
- Oriéntalo a revisar las expediciones y salidas en la web oficial de Santiago Hiking: https://www.santiagohiking.com o contactar su canal directo de montaña.
- Mantén la respuesta breve (máximo 2 a 3 oraciones).`;
            fallbackReply = "Hola. Este canal oficial de WhatsApp está dedicado exclusivamente a Mercenario (software y automatización para empresas). Para expediciones y trekking en la cordillera, puedes visitar https://www.santiagohiking.com o contactar a su equipo directamente.";
        } else {
            systemPrompt = `Eres el Consultor y Asistente Virtual Oficial de "Mercenario" (Sistemas Operativos Comerciales y Automatización para Pymes en Chile - https://mercenario.cl).
Tu objetivo es asesorar a dueños de negocio, clínicas y directores comerciales con un tono ejecutivo, directo, consultivo y formal B2B.

DIRECTIVAS OBLIGATORIAS:
- Este canal oficial de WhatsApp es EXCLUSIVAMENTE de Mercenario.
- Si el usuario solo saluda ("Hola", "Buenas tardes", etc.), saluda cordialmente presentándote como el Asistente Oficial de Mercenario y pregunta qué desafío u operación busca automatizar en su empresa (ventas, citas médicas, e-commerce o cobranza).
- Atiendes consultas de desarrollo de software a medida, e-commerce de alta conversión, ERP, CRM, automatización de WhatsApp con IA y pasarelas de pago (Webpay Plus, Mercado Pago).
- NUNCA menciones WEKE ni Santiago Hiking por defecto. Eres 100% Mercenario.

SOLUCIONES MERCENARIO:
1. Propuesta de Valor: Conectamos la operación de tu negocio en 1 sola plataforma: Web Next.js ultra rápida (<0.8s) + WhatsApp IA 24/7 + Webpay Plus / Mercado Pago + POS / ERP sincronizado.
2. Soluciones Llave en Mano:
   - Clínica & Salud 360 (Clinicafy): Agenda médica online + Recepcionista IA en WhatsApp con -80% inasistencias y confirmación de horas automática.
   - E-Commerce 360: Tiendas de alto rendimiento, catálogo inteligente, sincronización de stock y checkout optimizado.
   - Servicios & B2B 360: Web corporativa, calificador de prospectos IA y pipeline CRM.
3. Plazos de Implementación: Entrega e instalación operativa completa en 14 a 21 días hábiles con capacitación incluida.
4. Cierre Comercial: Invita al cliente a agendar un Diagnóstico Operativo gratuito de 30 minutos o escribir sus requerimientos para enviarle una propuesta formal.
5. Respuestas concisas: 2 a 4 oraciones como máximo.`;
            fallbackReply = "Hola. En Mercenario conectamos la operación completa de su empresa con software y automatización IA en 14 días. ¿Qué proceso comercial o sistema desea optimizar?";
        }

        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${deepseekKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...sanitizedHistory
                ],
                max_tokens: 220,
                temperature: 0.2
            })
        });

        const responseData = await response.json();
        const aiReply = responseData.choices?.[0]?.message?.content || fallbackReply;

        // Guardar respuesta del bot en el CRM de gaz_style
        try {
            await supabase
                .from('crm_whatsapp_messages')
                .insert([{
                    chat_id: chatId,
                    sender_type: 'bot',
                    message_type: 'text',
                    content: aiReply
                }]);
        } catch (crmErr) {
            console.warn('Could not save bot reply to CRM:', crmErr);
        }

        // Sincronizar en la base de datos de Mercenario
        try {
            const mercenarioSupabase = createAdminClient(
                'https://mpqfcvtlhsodvoyzemue.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcWZjdnRsaHNvZHZveXplbXVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjUyNjM5MSwiZXhwIjoyMDk4MTAyMzkxfQ.gpXTfRxf_cpeJaOD6n6e6FRwT9HXa2HsgALMZZsH3sY'
            );

            let { data: mChat } = await mercenarioSupabase
                .from('crm_whatsapp_chats')
                .select('id')
                .eq('phone_number', phoneNumber)
                .maybeSingle();

            if (!mChat) {
                const { data: createdChat } = await mercenarioSupabase
                    .from('crm_whatsapp_chats')
                    .insert([{
                        phone_number: phoneNumber,
                        session_status: 'bot',
                        vertical: 'general',
                        last_interaction: new Date().toISOString(),
                        context: { customer_name: registeredAdventurer?.name || `Cliente ${phoneNumber.slice(-4)}` }
                    }])
                    .select()
                    .single();
                mChat = createdChat;
            }

            if (mChat) {
                await mercenarioSupabase.from('crm_whatsapp_messages').insert([
                    { id: crypto.randomUUID(), chat_id: mChat.id, sender_type: 'customer', message_type: 'text', content: userMessage },
                    { id: crypto.randomUUID(), chat_id: mChat.id, sender_type: 'bot', message_type: 'text', content: aiReply }
                ]);
                await mercenarioSupabase.from('crm_whatsapp_chats').update({
                    last_interaction: new Date().toISOString(),
                    vertical: 'general'
                }).eq('id', mChat.id);
            }
        } catch (syncErr) {
            console.warn('[Sync to Mercenario] Error syncing messages:', syncErr);
        }

        // Enviar a la API de WhatsApp de Meta
        const metaToken = process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_ID;
        
        if (metaToken && phoneId) {
            const waRes = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${metaToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: phoneNumber,
                    type: 'text',
                    text: { body: aiReply }
                })
            });
            const waData = await waRes.json();
            console.log('[DeepSeek Agent] Meta WhatsApp Outbound Response:', waData);
        }
    } catch (e) {
        console.error("Error en processDirectWhatsAppMessage:", e);
    }
}
