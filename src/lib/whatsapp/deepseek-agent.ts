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
        // DETECCIÓN MULTI-EMPRESA (SANTIAGO HIKING & MERCENARIO)
        // =========================================================================
        // Sanitizar historial eliminando referencias residuales a WEKE o frases viejas de prueba
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

        // 1. Palabras clave de Mercenario (Software, Automatización, B2B, Clínicas, Ecommerce)
        const mercenarioKeywords = [
            'mercenario', 'software', 'sistema', 'sistemas', 'automatizacion', 'automatización',
            'erp', 'crm', 'clinica', 'clínica', 'clinicafy', 'ecommerce', 'e-commerce',
            'tienda online', 'tienda digital', 'llave en mano', 'webpay', 'pos', 'b2b',
            'desarrollo web', 'programacion', 'programación', 'landing', 'nextjs', 'pyme',
            'facturacion', 'boleta electronica', 'proceso comercial', 'citas', 'agendamiento'
        ];

        // 2. Palabras clave de Santiago Hiking (Montaña, Trekking, Cumbres, Rutas, Aventuras)
        const hikingKeywords = [
            'santiago hiking', 'hiking', 'trekking', 'montaña', 'montana', 'cumbre', 'cumbres',
            'cerro', 'cerros', 'ruta', 'rutas', 'salida', 'salidas', 'expedicion', 'expedición',
            'hike and fly', 'hike & fly', 'parapente', 'morado', 'pintor', 'plomo', 'san ramon',
            'manquehue', 'provincia', 'pochoco', 'andes', 'cordillera', 'adventurer', 'aventura',
            'guia', 'guías', 'subir', 'cordada', 'reserva'
        ];

        // Contexto conversacional reciente (últimos 3 mensajes sanitizados)
        const recentContext = sanitizedHistory.slice(-3).map((m: any) => m.content || '').join(' ').toLowerCase();

        const currentHasMercenario = mercenarioKeywords.some(k => currentLower.includes(k));
        const currentHasHiking = hikingKeywords.some(k => currentLower.includes(k));

        let selectedVertical: 'mercenario' | 'santiagohiking' | 'general' = 'general';

        if (currentHasMercenario && !currentHasHiking) {
            selectedVertical = 'mercenario';
        } else if (currentHasHiking && !currentHasMercenario) {
            selectedVertical = 'santiagohiking';
        } else {
            const historyHasMercenario = mercenarioKeywords.some(k => recentContext.includes(k));
            const historyHasHiking = hikingKeywords.some(k => recentContext.includes(k));

            if (historyHasMercenario && !historyHasHiking) {
                selectedVertical = 'mercenario';
            } else if (historyHasHiking && !historyHasMercenario) {
                selectedVertical = 'santiagohiking';
            } else {
                selectedVertical = 'general';
            }
        }

        let systemPrompt = '';
        let fallbackReply = '';

        if (selectedVertical === 'mercenario') {
            systemPrompt = `Eres el Consultor y Asistente Virtual Oficial de "Mercenario" (Sistemas Operativos Comerciales y Automatización para Pymes en Chile - https://mercenario.cl).
Tu objetivo es asesorar a dueños de negocio y directores comerciales con un tono ejecutivo, directo, consultivo y formal B2B.

DIRECTIVA CRÍTICA OBLIGATORIA:
- Este canal oficial de WhatsApp SÍ es el canal de consultoría oficial de Mercenario.
- Atiendes consultas de desarrollo de software a medida, e-commerce de alta conversión, ERP, CRM, automatización de WhatsApp con IA y pasarelas de pago (Webpay Plus, Mercado Pago).
- NUNCA menciones marcas no relacionadas. Eres 100% Mercenario.

SOLUCIONES MERCENARIO:
1. Propuesta de Valor: Conectamos la operación de tu negocio en 1 sola plataforma: Web Next.js ultra rápida (<0.8s) + WhatsApp IA 24/7 + Webpay Plus / Mercado Pago + POS sincronizado.
2. Soluciones Llave en Mano:
   - E-Commerce 360: Tiendas de alto rendimiento, catálogo inteligente, sincronización de stock y checkout optimizado.
   - Clínica & Salud 360 (Clinicafy): Agenda médica online + Recepcionista IA con -80% inasistencias y confirmación automática.
   - Servicios & B2B 360: Web corporativa, calificador de prospectos IA y pipeline CRM.
3. Plazos de Implementación: Entrega e instalación operativa completa en 14 a 21 días hábiles con capacitación incluida.
4. Cierre Comercial: Invita al cliente a agendar un Diagnóstico Operativo gratuito de 30 minutos o escribir sus requerimientos para enviarle una propuesta formal.
5. Respuestas concisas: 2 a 4 oraciones como máximo.`;
            fallbackReply = "Hola. En Mercenario conectamos la operación completa de su empresa con software y automatización IA en 14 días. ¿Qué proceso comercial o sistema desea optimizar?";
        } else if (selectedVertical === 'santiagohiking') {
            // SANTIAGO HIKING (Montañismo & Trekking)
            systemPrompt = `Eres el asistente oficial de WhatsApp de "Santiago Hiking", equipo de expediciones y montaña fundado por Mario Cruz en Santiago de Chile (https://www.santiagohiking.com).

PERSONALIDAD Y TONO:
- Profesional, sereno, hospitalario y conocedor de la montaña.
- Hablas con la calma y seguridad de un guía experimentado, jamás como un vendedor insistente ni un animador.
- PROHIBIDO usar frases clichés forzadas como "¡Buena vibra! ⚡", "¡A darle con todo!", ráfagas de signos de exclamación o emojis excesivos. Máximo 1 emoji sobrio (🏔️ o 🥾) si viene al caso.
- ESCUCHA Y CONTEXTO: Responde con naturalidad a lo que el usuario dice. 
  - Si solo saluda ("Hola"): saluda educadamente y pregunta en qué ruta o cerro lo puedes orientar. No lances el catálogo de golpe.
  - Si confirma o dice "Todo ok / gracias": responde con sobriedad y amabilidad.
- Respuestas breves y directas (2 a 3 oraciones), claras y sin rodeos.

GESTIÓN Y REGISTRO DEL CLIENTE:
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
        } else {
            // GENERAL (Canal Oficial Unificado de Mario Cruz: Santiago Hiking + Mercenario)
            systemPrompt = `Eres el Asistente Oficial y Concierge del canal unificado de atención de Mario Cruz en Chile. En este canal atendemos dos empresas especializadas:

1. 🏔️ "Santiago Hiking": Expediciones guiadas, trekking, cumbres en los Andes y salidas de montaña (https://www.santiagohiking.com).
2. ⚡ "Mercenario": Sistemas operativos comerciales, desarrollo de software, e-commerce y automatización con IA para empresas y clínicas (https://mercenario.cl).

DIRECTIVA DE ATENCIÓN:
- Saluda con cordialidad, sobriedad y profesionalismo ejecutivo.
- Explica de forma concisa que en este canal oficial gestionamos ambas divisiones: Turismo & Expediciones de Montaña (Santiago Hiking) y Software & Automatización Comercial (Mercenario).
- Pregunta amablemente al usuario en cuál de las dos áreas o empresas le gustaría recibir orientación hoy.
- Mantén la respuesta breve (máximo 3 oraciones), clara y directa.`;
            fallbackReply = "¡Hola! Bienvenido a nuestro canal oficial. Te podemos orientar en dos áreas:\n\n🏔️ 1. *Santiago Hiking*: Expediciones, trekking y cumbres en la Cordillera de los Andes.\n⚡ 2. *Mercenario*: Software a medida, e-commerce y automatización con IA para empresas.\n\n¿En cuál de ellas te podemos orientar hoy?";
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
        if (selectedVertical === 'mercenario' || selectedVertical === 'general') {
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
