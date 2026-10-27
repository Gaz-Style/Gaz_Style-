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
        // MOTOR RAG MERCENARIO (Base de Conocimiento y Arquitectura de Sistemas)
        // =========================================================================
        const MERCENARIO_KNOWLEDGE = [
            {
                id: 'filosofia-operativa',
                title: 'Arquitectura Mercenario y Filosofía Operativa',
                keywords: ['mercenario', 'que es', 'quienes somos', 'software', 'sistema', 'automatizacion', 'operacion', 'empresa', 'pyme'],
                content: `Mercenario (https://mercenario.cl) es una firma de arquitectura de software y automatización comercial para Pymes en Chile. No entregamos páginas web estáticas ni aplicaciones aisladas; conectamos la operación completa en 1 sola plataforma:
1. Web Next.js ultra rápida con carga inferior a 0.8s en servidores Edge.
2. Asistente con Inteligencia Artificial en WhatsApp Oficial (Meta Cloud API) conectado a la base de datos en tiempo real 24/7.
3. Pasarelas de pago chilenas nativas (Webpay Plus Transbank y Mercado Pago).
4. Punto de Venta (POS) y ERP sincronizado en tiempo real.
5. CRM comercial que registra cada lead, venta o cita médica sin intervención manual.`
            },
            {
                id: 'clinica-salud-360',
                title: 'Sistema Clínica & Salud 360 // Clinicafy (Centros Médicos, Estética, Odontología)',
                keywords: ['clinica', 'clinicafy', 'salud', 'medico', 'estetica', 'dental', 'odontologia', 'agenda', 'horas', 'citas', 'no-show', 'inasistencias', 'recordatorio', 'box', 'pacientes'],
                content: `Clínica & Salud 360 se materializa en nuestra plataforma Clinicafy (demo en vivo: https://clinicafy-beige.vercel.app/).
Resuelve el mayor dolor de los centros de salud: la pérdida de ingresos por inasistencias de pacientes (no-shows) y la saturación de las recepciones.
CÓMO FUNCIONA EL PROCESO PASO A PASO:
1. Agendamiento Inteligente: El paciente agenda desde la web o directamente conversando por WhatsApp las 24 horas del día.
2. Gestión de Box y Profesionales: El sistema valida en tiempo real la disponibilidad por médico/terapeuta, especialidad y box físico, evitando sobreagendamientos.
3. Cobro de Abono o Consulta: Permite exigir un abono previo con Webpay Plus o Mercado Pago para confirmar el box.
4. Protocolo Activo Anti-Inasistencia: WhatsApp envía recordatorios automáticos 24 horas y 2 horas antes de la cita con botones interactivos de "Confirmar" o "Reagendar". Esto reduce las inasistencias en más del 80%.
5. Liberación Inmediata de Cupos: Si un paciente avisa que no asistirá, el sistema libera la hora al instante y notifica a la lista de espera, manteniendo la ocupación de la clínica al máximo.`
            },
            {
                id: 'ecommerce-360',
                title: 'Sistema E-Commerce 360 (Retail, Marcas de Moda y Venta Física/Online)',
                keywords: ['ecommerce', 'e-commerce', 'tienda', 'tienda online', 'retail', 'moda', 'ropa', 'pos', 'inventario', 'stock', 'mostrador', 'carrito'],
                content: `El Sistema E-Commerce 360 sincroniza el canal digital con el punto de venta físico:
CÓMO FUNCIONA EL PROCESO PASO A PASO:
1. Plataforma de Venta Ultra Rápida: Tienda online desarrollada en Next.js con catálogo dinámico, filtros instantáneos y checkout en 1 solo paso.
2. Venta Asistida en WhatsApp: El cliente puede consultar por tallas, calce, stock disponible o pedir asesoría directamente en WhatsApp. La IA responde al segundo con fotos del producto y genera un link de pago directo.
3. Sincronización POS en Tiempo Real: Cuenta con un Punto de Venta (POS) táctil para el mostrador de la tienda física. Cuando se vende un producto en caja física, se descuenta de inmediato del stock web, eliminando errores de inventario.
4. Recuperación de Carritos: Si un usuario abandona su compra, WhatsApp le envía un mensaje personalizado para resolver dudas y cerrar la venta.
5. Logística Integrada: Conexión con Shipit (Starken, Chilexpress, Blue Express) y retiro en tienda física configurado.`
            },
            {
                id: 'servicios-b2b-360',
                title: 'Sistema Servicios & B2B 360 (Consultoría, Ingeniería, Servicios Profesionales)',
                keywords: ['b2b', 'servicios', 'consultoria', 'ingenieria', 'cotizacion', 'cotizador', 'leads', 'prospectos', 'crm', 'reuniones', 'ventas'],
                content: `Diseñado para empresas que venden servicios de alto valor o proyectos llave en mano:
CÓMO FUNCIONA EL PROCESO PASO A PASO:
1. Calificación de Prospectos en WhatsApp: La IA conversa con el lead, detecta su presupuesto estimado, necesidad técnica y nivel de urgencia.
2. Filtrado Automático: Evita que el equipo directivo pierda horas con prospectos no calificados; solo agenda reuniones con prospectos viables.
3. Agendamiento Directo de Reuniones: Sincroniza directamente con la agenda de Google Meet o Microsoft Outlook de los directores comerciales.
4. Pipeline CRM en Tiempo Real: Tablero visual que rastrea el estado de cada cotización y envía recordatorios de seguimiento comercial.`
            },
            {
                id: 'tiempos-precios-garantia',
                title: 'Plazos de Implementación, Costos y Garantía Llave en Mano',
                keywords: ['plazo', 'tiempo', 'dias', 'cuanto tarda', 'cuanto vale', 'precio', 'costo', 'inversion', 'garantia', 'implementacion'],
                content: `CÓMO TRABAJAMOS Y PLAZOS:
- Entrega Llave en Mano: Implementamos e instalamos el sistema completo y operativo en 14 a 21 días hábiles.
- Capacitación Incluida: Capacitamos a tu equipo administrativo, médico o de ventas en el uso del panel.
- Garantía de Estabilidad: Arquitectura moderna sobre infraestructura cloud con 99.9% de disponibilidad garantizada.
- Inversión: Setup de instalación inicial llave en mano (desde $1.200.000 CLP según módulos) y membresía operativa mensual desde 2,5 UF que cubre servidores Edge, mantenimiento, API oficial de WhatsApp de Meta y soporte técnico continuo.`
            },
            {
                id: 'diagnostico-gratuito',
                title: 'Diagnóstico Operativo Gratuito de 30 Minutos (Paso Inicial)',
                keywords: ['diagnostico', 'reunion', 'agendar', 'como empezar', 'contacto', 'paso inicial'],
                content: `CÓMO INICIAR:
Ofrecemos un Diagnóstico Operativo gratuito de 30 minutos vía videollamada con un consultor senior de Mercenario.
En esa sesión:
1. Analizamos el flujo actual de tu empresa (dónde se pierden ventas, cómo se gestiona la agenda o el stock).
2. Te mostramos una demostración en vivo del sistema funcionando en una empresa similar.
3. Te entregamos una propuesta de arquitectura a medida con el cronograma exacto de 14 días.
Para coordinarlo, el cliente solo debe indicar su disponibilidad horaria o escribir sus requerimientos por este chat.`
            }
        ];

        // Normalizar y recuperar fragmentos relevantes mediante RAG
        const currentLower = (userMessage || '').toLowerCase();
        const scoredKnowledge = MERCENARIO_KNOWLEDGE.map(k => {
            const matches = k.keywords.filter(kw => currentLower.includes(kw)).length;
            return { item: k, score: matches };
        }).sort((a, b) => b.score - a.score);

        const matchedChunks = scoredKnowledge[0].score > 0
            ? scoredKnowledge.slice(0, 2).map(s => `[${s.item.title}]\n${s.item.content}`).join('\n\n')
            : MERCENARIO_KNOWLEDGE.slice(0, 3).map(k => `[${k.title}]\n${k.content}`).join('\n\n');

        // Sanitizar historial de mensajes previos para eliminar residuos de pruebas anteriores
        const isGreeting = currentLower === 'hola' || currentLower === 'buenas' || currentLower === 'buenos dias' || currentLower === 'buenas tardes' || currentLower === 'buenas noches' || currentLower === 'hola!' || currentLower.startsWith('hola ');

        // Si es un saludo, no enviar historial antiguo para garantizar que se presente con la nueva personalidad
        const sanitizedHistory = isGreeting
            ? [{ role: 'user', content: userMessage }]
            : conversationHistory.filter((m: any) => {
                const c = (m.content || '').toLowerCase();
                return !c.includes('weke') &&
                       !c.includes('gredos') &&
                       !c.includes('chaqueta') &&
                       !c.includes('prenda') &&
                       !c.includes('parka') &&
                       !c.includes('santiago hiking') &&
                       !c.includes('hiking') &&
                       !c.includes('trekking') &&
                       !c.includes('cordada') &&
                       !c.includes('ruta') &&
                       !c.includes('salida');
            });

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
            systemPrompt = `Eres un consultor del equipo de "Mercenario" (https://mercenario.cl).
El usuario está consultando por turismo, trekking o expediciones de Santiago Hiking.
DIRECTIVA:
- Aclara con cordialidad que esta línea de WhatsApp está dedicada a las soluciones de software y automatización comercial de Mercenario.
- Oriéntalo con amabilidad a revisar el calendario y rutas en la web oficial de Santiago Hiking: https://www.santiagohiking.com o contactar su canal directo de montaña.
- Mantén la respuesta breve y hospitalaria.`;
            fallbackReply = "Hola, un gusto saludarte. Te comento que este canal de atención está dedicado exclusivamente al área de software y automatización comercial de Mercenario. Para revisar salidas a la montaña, rutas y expediciones de Santiago Hiking, puedes ingresar directamente a https://www.santiagohiking.com o contactar a su equipo de guías. ¡Que tengas un excelente día!";
        } else {
            systemPrompt = `Eres un Consultor Senior de Operaciones y Tecnología en "Mercenario" (https://mercenario.cl).
Tu propósito es asesorar a dueños de negocios, gerentes y directores de centros médicos en Chile con una visión ejecutiva, empática y de alto valor comercial.

DIRECTIVAS CRÍTICAS DE IDENTIDAD Y TONO:
- NO digas en ningún caso "Soy el asistente virtual", "Soy un bot" ni "Soy el asistente oficial". Hablas en primera persona con la cordialidad y propiedad de un consultor experto del equipo de Mercenario ("¡Hola! Un gusto saludarte. En Mercenario ayudamos a...", "Con gusto te explico cómo estructuramos este proceso...").
- Personalidad: Cordial, pedagógica, clara, profesional y consultiva. Te gusta explicar a fondo cómo funciona cada engranaje operativo.

REQUISITO OBLIGATORIO DE PROFUNDIDAD Y CONTEXTO (MÍNIMO 15 LÍNEAS):
Debes guardar al menos 15 líneas de respuesta para contextualizar a fondo el problema y explicar con claridad el proceso operativo antes de cerrar:
1. Saludo cordial y cercano dando la bienvenida a Mercenario.
2. Contextualización del dolor operativo que viven las Pymes en Chile (ej: citas médicas perdidas por falta de confirmación, inventarios desfasados entre tienda y web, o ventas que se enfrían por responder tarde en WhatsApp).
3. Explicación paso a paso de la solución técnica:
   - Cómo interactúa el cliente (web o WhatsApp 24/7).
   - Cómo la IA consulta y sincroniza la base de datos en tiempo real.
   - Cómo se integran los pagos (Webpay Plus / Mercado Pago) y el POS / agenda.
4. Impacto medible concreto: Menciona resultados reales (ej: reducción superior al 80% en inasistencias en clínicas con Clinicafy, o inventario sincronizado al segundo sin sobreventas en e-commerce).
5. Plazo de instalación: Destaca que entregamos el sistema 100% operativo llave en mano en 14 a 21 días hábiles con capacitación presencial/virtual incluida.
6. Cierre comercial consultivo: Invita amablemente a coordinar un Diagnóstico Operativo gratuito de 30 minutos (vía videollamada) para analizar su operación y entregarle una propuesta formal.

BASE DE CONOCIMIENTO (RAG EN TIEMPO REAL):
${matchedChunks}`;

            fallbackReply = `¡Hola! Un gusto saludarte. Te escribe el equipo de consultoría de Mercenario (https://mercenario.cl).

En Mercenario ayudamos a pequeñas y medianas empresas en Chile a modernizar y conectar toda su operación comercial, integrando software a medida con Inteligencia Artificial.

A diferencia del desarrollo tradicional que entrega plataformas aisladas, nosotros implementamos Sistemas Operativos Completos que resuelven los cuellos de botella reales de tu negocio:

• Clínica & Salud 360 (Clinicafy): Agenda médica online con recepcionista IA en WhatsApp 24/7 y protocolo de confirmación interactiva que reduce el 80% de las inasistencias (no-shows) de pacientes.
• E-Commerce 360: Tiendas web de alta velocidad (<0.8s en Next.js) con vendedor IA en WhatsApp, Webpay Plus y Punto de Venta (POS) sincronizado con el inventario físico en tiempo real.
• Servicios & B2B 360: Web de alta conversión con cotizador dinámico, calificación automática de prospectos por WhatsApp y sincronización con calendarios directivos.

Nuestros sistemas se entregan 100% operativos llave en mano en un plazo de 14 a 21 días hábiles, incluyendo capacitación completa para tu equipo y soporte continuo.

Cuéntame: ¿qué proceso comercial o desafío operativo te gustaría automatizar en tu empresa hoy? Si gustas, podemos coordinar un Diagnóstico Operativo gratuito de 30 minutos para evaluar tu caso en detalle.`;
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
                max_tokens: 750,
                temperature: 0.25
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
