export async function sendWhatsAppMessage(phone: string, message: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneNumberId) {
    console.warn("WhatsApp API credentials missing in .env.local. Simulating message to", phone);
    console.log("Simulated Message:", message);
    return { success: true, simulated: true };
  }

  // Ensure phone has country code and no spaces/plus
  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
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
    const msg = `¡Hola ${name}! 🏔️\nTe recordamos que tu expedición con Gaz Style está agendada para el ${date}. Prepárate para desconectar de la ciudad.\n\nPronto te enviaremos la ubicación exacta de encuentro.`;
    return sendWhatsAppMessage(phone, msg);
}
