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
                content: `Mercenario (https://mercenario.cl) es una firma de arquitectura de software y automatización comercial para Pymes en Chile. No entregamos páginas web lentas ni aplicaciones aisladas que nadie usa; conectamos la operación completa en 1 sola plataforma fácil de usar:
1. Página web moderna con Next.js: la última tecnología web del mercado, ultra rápida, que abre de inmediato en el celular de tu cliente sin hacerlo esperar.
2. WhatsApp Inteligente oficial: atiende solo día y noche 24/7, responde preguntas comunes como si fueras tú y ayuda al cliente a comprar o agendar en segundos.
3. Pagos con tarjeta al instante: integración lista para recibir pagos con débito y crédito de cualquier banco vía Webpay Plus y Mercado Pago.
4. Punto de Venta (POS) en caja y agenda sincronizada: si alguien compra o agenda en WhatsApp o en la web, el sistema lo descuenta o anota automáticamente para que no haya desorden ni sobreventas.
5. Panel de Control simple: un solo lugar donde ves todos tus clientes, citas y ventas sin planillas desordenadas.`
            },
            {
                id: 'clinica-salud-360',
                title: 'Sistema Clínica & Salud 360 // Clinicafy (Centros Médicos, Estética, Odontología)',
                keywords: ['clinica', 'clinicafy', 'salud', 'medico', 'estetica', 'dental', 'odontologia', 'agenda', 'horas', 'citas', 'no-show', 'inasistencias', 'recordatorio', 'box', 'pacientes'],
                content: `Clínica & Salud 360 se materializa en nuestra plataforma Clinicafy (demo en vivo: https://clinicafy-beige.vercel.app/).
Resuelve el mayor dolor de los centros médicos y estéticos: los pacientes que faltan sin avisar (horas perdidas) y las recepcionistas colapsadas contestando teléfonos.
CÓMO FUNCIONA EL PROCESO EN PALABRAS SIMPLES:
1. Agendamiento fácil: El paciente puede reservar su hora desde una web ultra rápida o directamente conversando por WhatsApp a cualquier hora del día.
2. Control de doctores y salas (box): El sistema sabe en tiempo real qué especialista y qué sala están libres, evitando que se topen dos citas a la misma hora.
3. Abono previo para asegurar el cupo: Si lo deseas, el sistema cobra un abono con tarjeta antes de confirmar la cita.
4. Recordatorios activos automáticos: WhatsApp le recuerda al paciente su cita 24 horas y 2 horas antes con botones simples de "Confirmar" o "Reagendar". Esto reduce las inasistencias en más del 80%.
5. Recuperación de horas canceladas: Si alguien cancela, el sistema avisa de inmediato a los pacientes en lista de espera para no perder ese ingreso.`
            },
            {
                id: 'ecommerce-360',
                title: 'Sistema E-Commerce 360 (Retail, Marcas de Moda y Venta Física/Online)',
                keywords: ['ecommerce', 'e-commerce', 'tienda', 'tienda online', 'retail', 'moda', 'ropa', 'pos', 'inventario', 'stock', 'mostrador', 'carrito'],
                content: `El Sistema E-Commerce 360 une tu tienda física con tus ventas por internet para que nunca se desajuste el stock:
CÓMO FUNCIONA EL PROCESO EN PALABRAS SIMPLES:
1. Tienda online con Next.js: la última tecnología web ultra rápida para que la página abra al instante en el celular del cliente, vea el catálogo y compre sin trabas.
2. Venta asistida por WhatsApp: El cliente puede preguntar por tallas, disponibilidad o fotos por WhatsApp y el sistema le responde al segundo con el producto y el link para pagar con tarjeta.
3. Caja física y web sincronizadas: Si vendes una prenda o producto en el mesón de tu tienda física, el sistema lo descuenta de inmediato de la web. Nunca más venderás algo que ya no tienes en stock.
4. Recuperación de ventas abandonadas: Si un cliente deja un producto en el carrito sin pagar, el sistema le envía un WhatsApp cordial para ayudarlo a terminar la compra.
5. Despachos listos: Conexión directa con Starken, Chilexpress y Blue Express con cálculo de envío automático.`
            },
            {
                id: 'servicios-b2b-360',
                title: 'Sistema Servicios & B2B 360 (Consultoría, Ingeniería, Servicios Profesionales)',
                keywords: ['b2b', 'servicios', 'consultoria', 'ingenieria', 'cotizacion', 'cotizador', 'leads', 'prospectos', 'crm', 'reuniones', 'ventas'],
                content: `Para empresas que ofrecen servicios profesionales y proyectos:
CÓMO FUNCIONA EL PROCESO EN PALABRAS SIMPLES:
1. Filtro automático de prospectos en WhatsApp: El sistema hace las preguntas clave (qué necesitan, cuándo lo necesitan y su presupuesto aproximado) para filtrar a los clientes serios.
2. Agendamiento directo de reuniones: Conecta con el calendario de Google o Outlook de tus ejecutivos para que el cliente elija el día y la hora de la videollamada.
3. Seguimiento ordenado: Un panel donde ves en qué estado va cada cotización para no perder ningún negocio por olvido.`
            },
            {
                id: 'tiempos-precios-garantia',
                title: 'Plazos de Implementación, Costos y Garantía Llave en Mano',
                keywords: ['plazo', 'tiempo', 'dias', 'cuanto tarda', 'cuanto vale', 'precio', 'costo', 'inversion', 'garantia', 'implementacion'],
                content: `CÓMO TRABAJAMOS Y PLAZOS:
- Entrega Llave en Mano: Te entregamos todo instalado, funcionando y probado en solo 14 a 21 días hábiles.
- Capacitación completa: Te enseñamos a ti y a tu equipo a usar el sistema paso a paso para que se sientan 100% cómodos.
- Inversión transparente: Un valor de instalación inicial llave en mano (desde $1.200.000 CLP según lo que tu empresa necesite) y un plan mensual desde 2,5 UF que cubre servidores veloces, el WhatsApp oficial de Meta y soporte técnico continuo.`
            },
            {
                id: 'diagnostico-gratuito',
                title: 'Diagnóstico Operativo Gratuito de 30 Minutos (Paso Inicial)',
                keywords: ['diagnostico', 'reunion', 'agendar', 'como empezar', 'contacto', 'paso inicial'],
                content: `CÓMO INICIAR:
El primer paso es coordinar un Diagnóstico Operativo gratuito de 30 minutos por videollamada.
Revisamos cómo funciona tu negocio hoy, dónde estás perdiendo tiempo o ventas, te mostramos el sistema funcionando en vivo y te dejamos una propuesta clara con tiempos y valores exactos.`
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
Tu propósito es asesorar a dueños de negocios, gerentes y directores de centros médicos en Chile con una visión ejecutiva, cercana, pedagógica y de alto valor comercial.

DIRECTIVAS CRÍTICAS DE IDENTIDAD Y TONO:
- NO digas en ningún caso "Soy el asistente virtual", "Soy un bot" ni "Soy el asistente oficial". Hablas en primera persona como parte del equipo de consultoría de Mercenario ("¡Hola! Un gusto saludarte. En Mercenario ayudamos a...", "Con gusto te explico cómo funciona este proceso...").
- Personalidad: Cordial, transparente, muy pedagógica y ejecutiva. Te gusta explicar cómo funciona cada parte del negocio sin rodeos.

REGLA DE ORO DE COMUNICACIÓN (PALABRAS SIMPLES Y FÁCILES DE ENTENDER):
- Los clientes son dueños de empresas, doctores y comerciantes, NO programadores.
- ESTÁ TERMINANTEMENTE PROHIBIDO usar jerga técnica que confunda al cliente (NADA de decir "latencias <0.8s", "servidores Edge", "APIs complejas", "tokens" o tecnicismos de código).
- Explica todo en palabras cotidianas, claras y fáciles:
  * Cuando menciones la web: Di que usamos "Next.js, que es la última tecnología web ultra rápida del mercado para que tu página abra de forma instantánea en el celular de tu cliente sin esperas".
  * Cuando menciones WhatsApp: Di que es "un WhatsApp inteligente que atiende solo día y noche, responde dudas como si fueras tú y agenda o vende en segundos".
  * Cuando menciones pagos: Di que "permite cobrar con tarjeta de débito o crédito de cualquier banco al instante".
  * Cuando menciones sincronización: Di que "si alguien compra o agenda en WhatsApp o en la web, el sistema actualiza tu caja o tu calendario automáticamente para que no se desordene nada".

REQUISITO OBLIGATORIO DE PROFUNDIDAD Y CONTEXTO (MÍNIMO 15 LÍNEAS):
Debes guardar al menos 15 líneas de respuesta para contextualizar a fondo el problema y explicar con claridad el proceso operativo antes de cerrar:
1. Saludo cordial y cercano dando la bienvenida a Mercenario.
2. Contextualización del dolor operativo que viven las Pymes en Chile (ej: citas médicas perdidas porque el paciente olvidó asistir, ventas que se enfrían por responder tarde en WhatsApp, o inventarios desordenados entre la tienda física y la web).
3. Explicación paso a paso de la solución en lenguaje fácil:
   - Cómo interactúa el cliente (web ultra rápida con Next.js o WhatsApp inteligente 24/7).
   - Cómo el sistema responde dudas y agenda o vende automáticamente.
   - Cómo se cobran los abonos o compras con tarjeta al instante.
   - Cómo se sincroniza todo con la caja o la agenda médica sin que nadie tenga que pasar datos a mano.
4. Impacto medible concreto: Menciona resultados reales (ej: reducción superior al 80% en inasistencias en clínicas con Clinicafy, o inventario sincronizado al segundo sin errores de stock en e-commerce).
5. Plazo de instalación: Destaca que entregamos el sistema 100% operativo llave en mano en 14 a 21 días hábiles con capacitación presencial o virtual para todo tu equipo.
6. Cierre comercial consultivo: Invita cordialmente a coordinar un Diagnóstico Operativo gratuito de 30 minutos (vía videollamada) para revisar cómo funciona su negocio hoy y mostrarle una propuesta a su medida.

BASE DE CONOCIMIENTO (RAG EN TIEMPO REAL):
${matchedChunks}`;

            fallbackReply = `¡Hola! Un gusto saludarte. Te escribe el equipo de consultoría de Mercenario (https://mercenario.cl).

En Mercenario ayudamos a pequeñas y medianas empresas en Chile a modernizar y conectar toda su operación comercial, usando software a medida e Inteligencia Artificial en palabras simples.

A diferencia del desarrollo tradicional que entrega páginas web abandonadas que nadie visita, nosotros implementamos sistemas completos que resuelven los problemas reales del día a día:

• Clínica & Salud 360 (Clinicafy): Una agenda médica online con un WhatsApp inteligente que atiende a tus pacientes día y noche las 24 horas, y les envía recordatorios automáticos interactivos que reducen las inasistencias en más de un 80%.
• E-Commerce 360: Una tienda web con Next.js (la última tecnología web ultra rápida para que la página abra al instante en el celular), venta asistida por WhatsApp con cobro con tarjeta al segundo, y una caja en tu local físico que descuenta el stock al mismo tiempo para no vender de más.
• Servicios & B2B 360: Una página web moderna que filtra a los clientes que de verdad tienen presupuesto y les permite agendar una reunión directamente en el calendario de tu equipo comercial.

Todo lo entregamos 100% instalado, probado y listo para usar en solo 14 a 21 días hábiles, e incluye capacitación completa para que tú y tu equipo lo usen con total facilidad.

Cuéntame: ¿qué proceso de tu empresa te gustaría ordenar o automatizar hoy? Si prefieres, podemos agendar un Diagnóstico Operativo gratuito de 30 minutos por videollamada para revisar tu caso con calma.`;
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
