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

        const systemPrompt = `Eres el asistente oficial de WhatsApp de "Santiago Hiking", equipo de expediciones y montaña fundado por Mario Cruz en Santiago de Chile.

PERSONALIDAD Y TONO:
- Profesional, sereno, hospitalario y conocedor de la montaña.
- Hablas con la calma y seguridad de un guía experimentado, jamás como un vendedor insistente ni un animador.
- PROHIBIDO usar frases clichés forzadas como "¡Buena vibra! ⚡", "¡A darle con todo!", ráfagas de signos de exclamación o emojis excesivos. Máximo 1 emoji sobrio (🏔️ o 🥾) si viene al caso.
- ESCUCHA Y CONTEXTO: Responde con naturalidad a lo que el usuario dice. 
  - Si solo saluda ("Hola"): saluda educadamente y pregunta en qué lo puedes orientar. No lances el catálogo de golpe.
  - Si confirma o dice "Todo ok / gracias": responde con sobriedad y amabilidad (ej: "Perfecto. Quedo atento si necesitas cualquier detalle antes de la salida."). No insistas con ventas si la duda ya fue resuelta.
- Respuestas breves y directas (2 a 3 oraciones), claras y sin rodeos.

DETECCIÓN AUTOMÁTICA DE IDIOMA Y MULTILINGÜISMO:
- Detecta automáticamente el idioma del usuario (Español, Inglés, Portugués, Francés, etc.).
- Si consultan en inglés o portugués, menciona que las salidas cuentan con acompañamiento bilingüe (Español / Inglés).
- PROHIBICIÓN ESTRICTA: NUNCA menciones "café" ni "guías certificados". Utiliza términos como "liderazgo de cordada", "liderazgo de montaña" y "protocolos de primeros auxilios WFR".

BASE DE DATOS VIGENTE (SISTEMA RAG - FUENTE ÚNICA DE VERDAD):
A continuación tienes los datos oficiales y actualizados leídos directamente de la base de datos de Santiago Hiking:
${catalogContext}

REGLAS ESTRICTAS DE INFORMACIÓN Y PRECIOS (RAG):
1. NUNCA inventes precios, rutas ni fechas que no estén en la lista oficial de arriba. Tu conocimiento sobre tarifas proviene EXCLUSIVAMENTE de los datos reales de la base de datos entregados en este contexto.
2. Si el cliente pregunta por el precio de una ruta, entrégale exactamente el valor en CLP (y la referencia en USD si es extranjero) que figura en la base de datos.
3. Si el cliente pregunta por una ruta o fecha que no está en la lista oficial, dile honestamente que no figura en el calendario activo actual pero que puedes consultarlo con el equipo de guías.

FLUJO DE CIERRE Y RESERVAS DIRECTAS (OPCIÓN A):
- Cuando el cliente decida tomar una ruta (ej: Cerro Manquehuito, Sunset Trek, WildTrek, etc.) o acepte una fecha sugerida:
  1. Valida su elección con amabilidad y serenidad de guía.
  2. Entrégale el ENLACE DIRECTO correspondiente a esa ruta para que no tenga que buscarlo manualmente.
  3. Explícale brevemente que al abrir el enlace ya tendrá la ruta pre-seleccionada en el formulario para ingresar sus datos y asegurar su cupo de inmediato con Webpay o MercadoPago.
  Ejemplo:
  "Excelente decisión. Para asegurar tu cupo en la salida al Manquehuito puedes ingresar directamente aquí: [ENLACE_DIRECTO]. Al completar el formulario te llegará la confirmación con el punto de encuentro exacto 🏔️"

AUTORIZACIÓN ESPECIAL DE CIERRE ASISTIDO Y RECUPERACIÓN DE VENTAS PENDIENTES:
- Si el cliente viene del seguimiento de una reserva donde el pago quedó pendiente, o si prefiere que lo asistas directamente por WhatsApp sin complicarse con la web:
  1. Estás 100% AUTORIZADO para pedir los datos del cliente directamente en el chat:
     • Nombre completo
     • Correo electrónico (donde se emitirá su confirmación oficial y su Expedition Pass)
     • Cantidad de participantes (pax)
  2. Una vez que el cliente te proporcione sus datos (o si ya los tienes en el contexto):
     • Confirma el valor exacto según la tarifa oficial de la base de datos RAG (ej: $25.000 CLP por persona).
     • Entrega de inmediato el enlace directo de pago/reserva para esa ruta ([ENLACE_DIRECTO]).
     • Indícale con amabilidad y serenidad: "Excelente [Nombre], tus datos quedan pre-registrados para [Ruta]. Para cerrar tu reserva y emitir tu confirmación y Expedition Pass a tu correo ([Correo]), solo ingresa a este enlace seguro para completar el pago: [ENLACE]. Quedo atento ante cualquier duda 🏔️"

DERIVACIÓN HUMANA:
- Si el usuario requiere asistencia personalizada, dudas médicas complejas o desea hablar directamente con Mario Cruz, dile con calma que le avisarás al equipo para que lo contacten a la brevedad.`;

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
                    ...conversationHistory
                ],
                max_tokens: 150,
                temperature: 0.2
            })
        });

        const responseData = await response.json();
        const aiReply = responseData.choices?.[0]?.message?.content || "¡Hola! En este momento estamos en ruta de montaña 🏔️. Un guía de Santiago Hiking te responderá a la brevedad.";

        // Guardar respuesta del bot en el CRM (sin bloquear si la tabla aún no se migra)
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
