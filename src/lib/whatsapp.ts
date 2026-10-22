export async function sendWhatsAppMessage(phone: string, message: string) {
  const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_ID || process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("WhatsApp API credentials missing in .env.local. Simulating message to", phone);
    console.log("Simulated Message:", message);
    return { success: true, simulated: true };
  }

  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "text",
        text: { body: message }
      }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error };
  }
}

export async function sendExpeditionReminder(phone: string, name: string, date: string) {
    const msg = `¡Hola ${name}! 🏔️\nTe recordamos que tu expedición con Santiago Hiking está agendada para el ${date}. Prepárate para una jornada salvaje en la cordillera.\n\nPronto coordinaremos los detalles finales y punto de encuentro.`;
    return sendWhatsAppMessage(phone, msg);
}

/**
 * Dispara la plantilla oficial de Meta al Administrador (Mario Cruz)
 * cuando el bot requiere asistencia humana o el cliente pide hablar con una persona.
 */
export async function sendHumanHandoffAlertToAdmin({
    customerName,
    customerPhone,
    reason = 'Solicitud directa del cliente / Duda compleja'
}: {
    customerName: string;
    customerPhone: string;
    reason?: string;
}) {
    const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_ID || process.env.WHATSAPP_PHONE_NUMBER_ID;
    const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE || '56984021940';
    const cleanAdmin = adminPhone.replace(/\D/g, '');

    if (!token || !phoneNumberId) {
        console.warn("[Handoff Template] Faltan credenciales de WhatsApp en variables de entorno.");
        return { success: false, simulated: true };
    }

    const templateName = process.env.WHATSAPP_HANDOFF_TEMPLATE_NAME || 'alerta_asistencia_humana';

    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanAdmin,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'es' },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: customerName || 'Aventurero' },
                                { type: 'text', text: customerPhone || 'Sin número' },
                                { type: 'text', text: reason.substring(0, 100) }
                            ]
                        }
                    ]
                }
            })
        });

        const data = await response.json();
        
        // Si la plantilla no está aprobada aún en Meta, fallback a mensaje de texto directo
        if (!response.ok && data?.error?.code === 132001) {
            console.warn('[Handoff Template] Plantilla no encontrada o en revisión en Meta. Enviando fallback en texto directo...');
            const fallbackText = 
                `🏔️ *Santiago Hiking — Asistencia Humana Requerida*\n\n` +
                `👤 *Cliente:* ${customerName}\n` +
                `📱 *Teléfono:* ${customerPhone}\n` +
                `💬 *Motivo:* ${reason}\n\n` +
                `👉 *Responder en el LiveChat:*\n` +
                `https://www.santiagohiking.com/admin/livechat`;
            return sendWhatsAppMessage(cleanAdmin, fallbackText);
        }

        return { success: response.ok, data };
    } catch (error) {
        console.error("[Handoff Template] Error al disparar plantilla de asistencia humana:", error);
        return { success: false, error };
    }
}

/**
 * Dispara la plantilla oficial de Meta al Cliente (Aventurero)
 * notificándole que su consulta fue transferida a un guía humano.
 */
export async function sendHumanHandoffNoticeToCustomer({
    customerPhone,
    customerName
}: {
    customerPhone: string;
    customerName: string;
}) {
    const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_ID || process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) return { success: false, simulated: true };

    const cleanPhone = customerPhone.replace(/\D/g, '');
    const templateName = process.env.WHATSAPP_CUSTOMER_HANDOFF_TEMPLATE || 'transferencia_guia_humano';

    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'es' },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: customerName || 'Aventurero' }
                            ]
                        }
                    ]
                }
            })
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error("[Customer Handoff] Error sending notice to customer:", error);
        return { success: false, error };
    }
}
