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

        const systemPrompt = `Eres Gaz, el Asistente Virtual Inteligente de "Santiago Hiking" (by Gaz_Style Expeditions).
Tu objetivo es orientar a personas interesadas en salidas de montaña, trekking guiado y atardeceres en Santiago de Chile.

REGLAS DE ORO OBLIGATORIAS:
1. BREVEDAD ABSOLUTA: Responde en MÁXIMO 2 o 3 líneas por mensaje. Lenguaje enérgico, cercano, motivador ("buena vibra ⚡"). Prohibido sonar como un bot aburrido o dar monólogos.
2. PREGUNTA GUÍA FINAL: Cada respuesta DEBE terminar con 1 sola pregunta directa para guiar al cliente (ej: "¿Te gustaría sumarte a un atardecer en Manquehuito o buscas una ruta deportiva?", "¿Quieres revisar las próximas fechas en la web?").
3. CATÁLOGO BÁSICO:
   - Sunset Trek (Manquehuito): desde $25.000 CLP (atardecer, fotos pro y linternas frontales).
   - Networking Manquehuito: $45.000 CLP (conexión para emprendedores con picoteo en cumbre).
   - WildTrek: $25.000 CLP (desconexión y deporte).
   - Expediciones privadas y Alta Montaña (Cerro Pintor / Provincia): personalizadas.
4. DIFERENCIALES: Fotografía profesional incluida, guías certificados WFR (primeros auxilios en áreas remotas) y "Tercer Tiempo" gastronómico al bajar.
5. RESERVAS: Invita a reservar directo en https://www.santiagohiking.com/reservar.
6. DERIVACIÓN HUMANA: Si el cliente pide hablar con una persona o tiene una duda médica específica, avísale con calidez que Gaz o un guía lo contactará de inmediato.`;

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
        const aiReply = responseData.choices?.[0]?.message?.content || "Disculpe, en este momento el atelier está con alta demanda. Un asesor humano le atenderá a la brevedad.";

        // Guardar respuesta del bot en el CRM
        await supabase
            .from('crm_whatsapp_messages')
            .insert([{
                chat_id: chatId,
                sender_type: 'bot',
                message_type: 'text',
                content: aiReply
            }]);

        // Enviar a la API de WhatsApp de Meta
        const metaToken = process.env.WHATSAPP_API_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        
        if (metaToken && phoneId) {
            await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
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
        }
    } catch (e) {
        console.error("Error en processDirectWhatsAppMessage:", e);
    }
}
