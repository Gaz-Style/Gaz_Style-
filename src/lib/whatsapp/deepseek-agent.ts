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
        // DETECCIÓN MULTI-MARCA PROFUNDA (MENSAJE ACTUAL + HISTORIAL DEL CHAT)
        // =========================================================================
        const allText = [
            userMessage || '',
            ...conversationHistory.map((m: any) => m.content || '')
        ].join(' ').toLowerCase();

        const isMercenario = allText.includes('mercenario') || allText.includes('growth') || allText.includes('sistema') || allText.includes('software') || allText.includes('erp') || allText.includes('crm') || allText.includes('automatizacion') || allText.includes('clinica') || allText.includes('llave en mano') || allText.includes('webpay') || allText.includes('pos');
        
        const isWeke = allText.includes('weke') || allText.includes('chaqueta') || allText.includes('parka') || allText.includes('polar') || allText.includes('talla') || allText.includes('calce') || allText.includes('estatura') || allText.includes('taller') || allText.includes('gredos') || allText.includes('ropa') || allText.includes('prenda') || allText.includes('stock') || allText.includes('outdoor') || allText.includes('tienda');

        // Limpiar el historial de mensajes para que no arrastre respuestas previas donde el bot decía que "no era WEKE"
        const sanitizedHistory = conversationHistory.filter((m: any) => {
            const c = (m.content || '').toLowerCase();
            return !c.includes('no el de weke') && 
                   !c.includes('no es weke') && 
                   !c.includes('no gestiono consultas de prendas') && 
                   !c.includes('no manejo información de prendas') &&
                   !c.includes('corresponde al asistente de santiago hiking, no al de weke');
        });

        let systemPrompt = '';
        let fallbackReply = '';

        if (isWeke) {
            systemPrompt = `Eres el Asistente Virtual Oficial de "WEKE Studio" (Indumentaria Técnica Sustentable e Inclusiva, fundada en 1985 en Chile).
Tu objetivo es asesorar a clientes y expedicionarios sobre prendas, calce, tallas, materiales y despachos.

DIRECTIVA CRÍTICA OBLIGATORIA:
- Este canal oficial de WhatsApp SÍ es el canal oficial de WEKE Studio.
- Atiendes directamente consultas de prendas, chaquetas, parkas, polerones, tallas, cambios y stock.
- ESTÁ TERMINANTEMENTE PROHIBIDO decir que este canal no es WEKE, decir que corresponde a Santiago Hiking o rechazar consultas de vestuario. Eres 100% el asistente de WEKE Studio.

CATÁLOGO Y DIRECTIVAS OFICIALES WEKE:
1. Prendas Principales:
   - Chaqueta Shell Andes Gore 3 Capas: $189.900 CLP (Impermeable 20.000mm, respirable, costuras termo-selladas de alta montaña).
   - Parka Térmica Primaloft 'Glaciar': $169.900 CLP (Ultraliviana, aislación térmica sintética de alto rendimiento y repelencia DWR al agua y nieve).
   - Pantalón Cargo Técnico Ripstop: $89.900 CLP (Refuerzos en rodillas, secado rápido).
   - Polerón Técnico Segunda Capa: $64.900 CLP.
2. Despacho: Gratis a todo Chile en compras sobre $100.000 CLP vía Chilexpress o Starken (24h a 48h hábiles en Santiago, 48h a 72h en regiones).
3. Asesoría en Tallas: Solicita estatura y peso para orientar el calce adecuado (patronaje nacional chileno con 30 días para cambio de talla sin costo).
4. Tienda Oficial: Invita a comprar en https://www.weke.cl/tienda o visitar el taller showroom en Gredos 7952, Las Condes, Santiago.
5. Tono: Sobrio, profesional, neutro, hospitalario y conciso (2 a 3 oraciones como máximo).`;
            fallbackReply = "¡Hola! Bienvenido a WEKE Studio. ¿En qué prenda técnica o consulta sobre tallas y despachos podemos ayudarte hoy?";
        } else if (isMercenario) {
            systemPrompt = `Eres el Consultor y Asistente Virtual Oficial de "Mercenario IOS" (Sistemas Operativos Comerciales y Automatización para Pymes en Chile).
Tu objetivo es asesorar a dueños de negocio y directores comerciales con un tono ejecutivo, directo, consultivo y formal B2B.

DIRECTIVA CRÍTICA OBLIGATORIA:
- Este canal oficial de WhatsApp SÍ es el canal de consultoría oficial de Mercenario IOS.
- Atiendes consultas de desarrollo de software, ecommerce de alta conversión, ERP, CRM, automatización de WhatsApp con IA y pasarelas de pago.
- ESTÁ TERMINANTEMENTE PROHIBIDO decir que este canal no es Mercenario o que corresponde a Santiago Hiking.

SOLUCIONES MERCENARIO:
1. Propuesta de Valor: Conectamos la operación de tu negocio en 1 sola plataforma: Web Next.js ultra rápida (<0.8s) + WhatsApp IA 24/7 + Webpay Plus / Mercado Pago + POS sincronizado.
2. Soluciones Llave en Mano: E-Commerce 360 (Retail y Moda probado en WEKE Studio), Clínica & Salud 360 (Agenda + Recepcionista IA con -80% inasistencias), y Servicios B2B 360.
3. Plazos de Implementación: Entrega e instalación operativa completa en 14 a 21 días hábiles con capacitación incluida.
4. Cierre Comercial: Invita al cliente a agendar un Diagnóstico Operativo gratuito de 30 minutos o escribir sus requerimientos para enviarle una propuesta formal.
5. Respuestas concisas: 2 a 4 oraciones como máximo.`;
            fallbackReply = "Hola. En Mercenario conectamos la operación completa de su empresa en 14 días. ¿Qué proceso comercial o sistema desea automatizar?";
        } else {
            // SANTIAGO HIKING (Por defecto)
            systemPrompt = `Eres el asistente oficial de WhatsApp de "Santiago Hiking", equipo de expediciones y montaña fundado por Mario Cruz en Santiago de Chile.

PERSONALIDAD Y TONO:
- Profesional, sereno, hospitalario y conocedor de la montaña.
- Hablas con la calma y seguridad de un guía experimentado, jamás como un vendedor insistente ni un animador.
- PROHIBIDO usar frases clichés forzadas como "¡Buena vibra! ⚡", "¡A darle con todo!", ráfagas de signos de exclamación o emojis excesivos. Máximo 1 emoji sobrio (🏔️ o 🥾) si viene al caso.
- ESCUCHA Y CONTEXTO: Responde con naturalidad a lo que el usuario dice. 
  - Si solo saluda ("Hola"): saluda educadamente y pregunta en qué lo puedes orientar. No lances el catálogo de golpe.
  - Si confirma o dice "Todo ok / gracias": responde con sobriedad y amabilidad.
- Respuestas breves y directas (2 a 3 oraciones), claras y sin rodeos.

GESTIÓN Y REGISTRO DEL CLIENTE (LÓGICA ELENA):
${registeredAdventurer 
    ? `• ESTADO: CLIENTE REGISTRADO ✅
  - Nombre: ${registeredAdventurer.name}
  ${registeredAdventurer.email ? `- Correo: ${registeredAdventurer.email}` : ''}
  - Ya se encuentra registrado en el CRM. Puedes dirigirte a él/ella por su nombre con naturalidad y cortesía.`
    : `• ESTADO: CLIENTE NO REGISTRADO ⚠️ (Solo disponemos del número: +${cleanDigits})
  - No disponemos de su nombre en el sistema. NO inventes un nombre ni utilices palabras como "Estimado cliente".
  - TOMA DE DATOS Y REGISTRO: Cuando el cliente consulte por una ruta, fecha, cupos o pida asistencia personalizada, pregúntale con amabilidad su Nombre Completo (y correo) para dejarlo registrado formalmente en la cordada y guardar sus datos.`}

DETECCIÓN AUTOMÁTICA DE IDIOMA Y MULTILINGÜISMO:
- Detecta automáticamente el idioma del usuario. Si consultan en inglés o portugués, menciona que las salidas cuentan con acompañamiento bilingüe.

BASE DE DATOS VIGENTE (SISTEMA RAG - FUENTE ÚNICA DE VERDAD):
${catalogContext}

REGLAS ESTRICTAS DE INFORMACIÓN Y PRECIOS:
1. NUNCA inventes precios ni rutas que no figuren arriba.
2. Si el cliente decide tomar una ruta, facilítale el enlace directo de reserva.`;
            fallbackReply = "¡Hola! En este momento estamos en ruta de montaña 🏔️. Un guía de Santiago Hiking te responderá a la brevedad.";
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

        // Si es WEKE o MERCENARIO, replicar en la base de datos de Mercenario
        if (isWeke || isMercenario) {
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
                            vertical: isMercenario ? 'b2b' : 'retail',
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
                        vertical: isMercenario ? 'b2b' : 'retail'
                    }).eq('id', mChat.id);
                }
            } catch (syncErr) {
                console.warn('[Sync to Mercenario] Error syncing messages:', syncErr);
            }
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
