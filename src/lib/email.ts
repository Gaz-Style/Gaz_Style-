import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Setup Nodemailer transporter using Santiago Hiking Google App Password from .env.local
const rawSmtpUser = process.env.GMAIL_SMTP_USER || process.env.SMTP_USER || 'gazstylechile@gmail.com';
const rawSmtpPass = process.env.GMAIL_SMTP_APP_PASSWORD || process.env.SMTP_PASSWORD || '';
const smtpUser = rawSmtpUser.replace(/^["']|["']$/g, '').trim();
const smtpPass = rawSmtpPass.replace(/^["']|["']$/g, '').trim();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Sender oficial según el tipo de comunicación (usando tus alias configurados de Google Workspace)
export const EMAIL_SENDERS = {
  booking: `"Santiago Hiking | Booking" <booking@santiagohiking.com>`,
  contacto: `"Santiago Hiking | Contacto" <contacto@santiagohiking.com>`,
  info: `"Santiago Hiking | Info" <info@santiagohiking.com>`,
  pagos: `"Santiago Hiking | Pagos" <pagos@santiagohiking.com>`,
  mario: `"Santiago Hiking | Mario Cruz" <mario.cruz@santiagohiking.com>`,
};

export const fromAddress = EMAIL_SENDERS.booking;
const defaultFrom = EMAIL_SENDERS.booking;

/**
 * Helper to load an HTML template and replace variables
 */
const loadTemplate = (templateName: string, variables: Record<string, string> = {}) => {
  try {
    const templatePath = path.join(process.cwd(), 'src', 'lib', 'templates', 'emails', templateName);
    let html = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace all placeholders like {{NAME}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value);
    });
    
    return html;
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    return '';
  }
};

/**
 * Sends the welcome manifesto email to a new subscriber or client.
 */
export const sendWelcomeEmail = async (to: string, name: string) => {
  const html = loadTemplate('welcome.html', { NAME: name });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: 'Bienvenido a Santiago Hiking · Cordada Oficial',
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};

/**
 * Sends an appointment confirmation email.
 */
export const sendAppointmentConfirmation = async (to: string, name: string, date: string, time: string, service: string) => {
  const html = loadTemplate('appointment_scheduled.html', {
    NAME: name,
    DATE: date,
    TIME: time,
    SERVICE: service
  });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: `"Citas - Gaz La Guía" <${fromAddress}>`,
      to,
      subject: `Tu cita para ${service} está confirmada`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending appointment email:', error);
    return { success: false, error };
  }
};

/**
 * Sends a budget reminder / follow up email.
 */
export const sendBudgetReminder = async (to: string, name: string, link: string) => {
  const html = loadTemplate('budget_reminder.html', {
    NAME: name,
    LINK: link
  });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: `"Gaz La Guía" <${fromAddress}>`,
      to,
      subject: 'Tu diseño a medida te está esperando',
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending budget reminder email:', error);
    return { success: false, error };
  }
};

/**
 * Sends a payment confirmation email.
 */
export const sendPaymentReceivedEmail = async (to: string, name: string, amount: string, method: string, service: string) => {
  const html = loadTemplate('payment_received.html', {
    NAME: name,
    AMOUNT: amount,
    METHOD: method,
    SERVICE: service
  });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: `"Pagos - Gaz La Guía" <${fromAddress}>`,
      to,
      subject: 'Confirmación de Pago - Gaz Style',
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error };
  }
};

/**
 * Sends an order ready notification email.
 */
export const sendOrderReadyEmail = async (to: string, name: string, item: string, hours: string) => {
  const html = loadTemplate('order_ready.html', {
    NAME: name,
    ITEM: item,
    HOURS: hours
  });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: `"Campamento Base - Gaz La Guía" <${fromAddress}>`,
      to,
      subject: 'Tu prenda está lista para retiro ✨ - Gaz Style',
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order ready email:', error);
    return { success: false, error };
  }
};

/**
 * Sends a general contact notification email.
 */
export const sendGeneralContactEmail = async (
  to: string,
  name: string,
  subject: string,
  message: string,
  headers?: Record<string, string>
) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elenalaguía.cl';
  const attachments: any[] = [];
  let cardBgUrl = '';
  
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'public', 'trabajos', 'model_desnuda_bw.png');
  if (fs.existsSync(filePath)) {
    attachments.push({
      filename: 'model_desnuda_bw.png',
      path: filePath,
      cid: 'luxuryPassBg'
    });
    cardBgUrl = 'cid:luxuryPassBg';
  } else {
    cardBgUrl = `${siteUrl}/trabajos/model_desnuda_bw.png`;
  }

  const html = loadTemplate('general_contact.html', {
    NAME: name,
    SUBJECT: subject,
    MESSAGE: message,
    BACKGROUND_URL: cardBgUrl
  });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: `"Gaz La Guía" <${fromAddress}>`,
      to,
      subject: subject || 'Mensaje de Gaz Style',
      html,
      attachments,
      headers
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending general contact email:', error);
    return { success: false, error };
  }
};

/**
 * Sends a raw email containing full custom HTML (e.g. from template compilation).
 */
export const sendRawCustomEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
  headers?: Record<string, string>
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Gaz La Guía" <${fromAddress}>`,
      to,
      subject: subject || 'Notificación - Gaz Style',
      html: htmlContent,
      headers
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending raw custom email:', error);
    return { success: false, error };
  }
};

/**
 * Sends a raw email to multiple recipients in bulk/batches.
 */
export const sendBulkEmail = async (
  recipients: string[],
  subject: string,
  htmlContent: string
) => {
  const results = await Promise.all(
    recipients.map(async (to) => {
      try {
        const info = await transporter.sendMail({
          from: `"Gaz La Guía" <${fromAddress}>`,
          to,
          subject,
          html: htmlContent,
        });
        return { to, success: true, messageId: info.messageId };
      } catch (error) {
        console.error(`Error sending bulk email to ${to}:`, error);
        return { to, success: false, error };
      }
    })
  );
  return results;
};

/**
 * Sends a custom Luxury Pass invitation email.
 */
export const sendLuxuryPassEmail = async (
  to: string,
  name: string,
  subject: string,
  title: string,
  subtitle: string,
  field1Label: string,
  field1Value: string,
  field2Label: string,
  field2Value: string,
  details: string,
  barcodeText: string
) => {
  const html = loadTemplate('luxury_pass.html', {
    NAME: name,
    SUBJECT: subject,
    TITLE: title,
    SUBTITLE: subtitle,
    FIELD1_LABEL: field1Label,
    FIELD1_VALUE: field1Value,
    FIELD2_LABEL: field2Label,
    FIELD2_VALUE: field2Value,
    DETAILS: details,
    BARCODE_TEXT: barcodeText
  });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: `"Expedition Pass - Santiago Hiking" <${fromAddress}>`,
      to,
      subject: subject || 'Tu Expedition Pass Oficial - Santiago Hiking',
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending luxury pass email:', error);
    return { success: false, error };
  }
};

/**
 * Sends a client review / opinion request email.
 */
export const sendReviewEmail = async (to: string, name: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elenalaguía.cl';
  const attachments: any[] = [];
  let cardBgUrl = '';
  
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'public', 'elena-torso.webp');
  if (fs.existsSync(filePath)) {
    attachments.push({
      filename: 'elena-torso.webp',
      path: filePath,
      cid: 'reviewBg'
    });
    cardBgUrl = 'cid:reviewBg';
  } else {
    cardBgUrl = `${siteUrl}/elena-torso.webp`;
  }

  const html = loadTemplate('review.html', {
    NAME: name,
    SITE_URL: siteUrl,
    BACKGROUND_URL: cardBgUrl
  });
  
  if (!html) throw new Error('Template not found');

  try {
    const info = await transporter.sendMail({
      from: `"Gaz La Guía" <${fromAddress}>`,
      to,
      subject: '¡Tu opinión es importante! - Gaz Style',
      html,
      attachments
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending review email:', error);
    return { success: false, error };
  }
};

/**
 * Dynamically composites the hero image with the brand logo (top-left),
 * pass badge (top-right), and the signature Triple Corona degradé (bottom fade).
 */
export const generateTicketHeroBuffer = async (shortTicketId: string): Promise<Buffer | null> => {
  try {
    const sharp = require('sharp');
    const inputPath = path.join(process.cwd(), 'public', 'images', 'trail-running-cosa-mi-serve.jpg');
    const logoPath = path.join(process.cwd(), 'public', 'logotipo blanco.png');

    if (!fs.existsSync(inputPath) || !fs.existsSync(logoPath)) return null;

    const width = 1040;
    const height = 585;

    const logoBuffer = await sharp(logoPath)
      .resize({ height: 110 })
      .toBuffer();

    const passText = `PASS #${shortTicketId}`;
    const badgeWidth = Math.max(160, passText.length * 13 + 30);
    const badgeX = width - 40 - badgeWidth;
    const badgeY = 36;

    const svgOverlay = Buffer.from(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0c0a09" stop-opacity="0.80" />
            <stop offset="35%" stop-color="#0c0a09" stop-opacity="0.45" />
            <stop offset="65%" stop-color="#0c0a09" stop-opacity="0.10" />
            <stop offset="100%" stop-color="#0c0a09" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="bottomDegrade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0c0a09" stop-opacity="0.0" />
            <stop offset="45%" stop-color="#0c0a09" stop-opacity="0.20" />
            <stop offset="68%" stop-color="#0c0a09" stop-opacity="0.60" />
            <stop offset="88%" stop-color="#0c0a09" stop-opacity="0.92" />
            <stop offset="100%" stop-color="#0c0a09" stop-opacity="1.0" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height * 0.55}" fill="url(#topVignette)" />
        <rect width="${width}" height="${height}" fill="url(#bottomDegrade)" />
        <g transform="translate(${badgeX}, ${badgeY})">
          <rect width="${badgeWidth}" height="42" rx="21" fill="#0c0a09" fill-opacity="0.65" stroke="#f59e0b" stroke-opacity="0.75" stroke-width="1.5" />
          <text x="${badgeWidth / 2}" y="26" text-anchor="middle" fill="#fbbf24" font-family="'JetBrains Mono', monospace, sans-serif" font-size="14" font-weight="800" letter-spacing="2">${passText}</text>
        </g>
      </svg>
    `);

    return await sharp(inputPath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .composite([
        { input: svgOverlay, top: 0, left: 0 },
        { input: logoBuffer, top: 28, left: 36 }
      ])
      .jpeg({ quality: 93 })
      .toBuffer();
  } catch (err) {
    console.error('Error generating dynamic composite hero:', err);
    return null;
  }
};

/**
 * Sends the official Expedition Pass Ticket email for Santiago Hiking
 */
export const sendExpeditionTicketEmail = async (payload: {
  to: string;
  name: string;
  adventureTitle: string;
  departureDate: string;
  meetingPoint: string;
  meetingTime: string;
  totalPaid: string;
  ticketId: string;
  whatsappLink: string;
}) => {
  const shortTicketId = payload.ticketId.includes('-') 
    ? payload.ticketId.split('-').pop()?.toUpperCase() || payload.ticketId.slice(0, 8).toUpperCase()
    : payload.ticketId.slice(0, 8).toUpperCase();

  const html = loadTemplate('expedition_ticket.html', {
    NAME: payload.name || 'Aventurero',
    ADVENTURE_TITLE: payload.adventureTitle || 'Expedición Andina',
    DEPARTURE_DATE: payload.departureDate || 'Fecha a confirmar',
    MEETING_POINT: payload.meetingPoint || 'Punto de encuentro cordada',
    MEETING_TIME: payload.meetingTime || '08:00 hrs',
    TOTAL_PAID: payload.totalPaid || '$0 CLP',
    TICKET_ID: payload.ticketId || `SH-${Date.now()}`,
    TICKET_SHORT_ID: shortTicketId,
    WHATSAPP_LINK: payload.whatsappLink || 'https://wa.me/56957958467'
  });

  if (!html) throw new Error('Plantilla expedition_ticket.html no encontrada');

  const heroBuffer = await generateTicketHeroBuffer(shortTicketId);
  const attachments: any[] = [];

  if (heroBuffer) {
    attachments.push({
      filename: `expedition-hero-${shortTicketId}.jpg`,
      content: heroBuffer,
      cid: 'expeditionHero'
    });
  } else {
    const heroGradientPath = path.join(process.cwd(), 'public', 'images', 'expedition-hero-gradient.jpg');
    if (fs.existsSync(heroGradientPath)) {
      attachments.push({
        filename: 'expedition-hero-gradient.jpg',
        path: heroGradientPath,
        cid: 'expeditionHero'
      });
    }
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_SENDERS.booking,
      replyTo: 'booking@santiagohiking.com',
      to: payload.to,
      subject: `🏔️ Tu Expedition Pass Oficial: ${payload.adventureTitle} - Santiago Hiking`,
      html,
      attachments,
    });
    console.log(`[EMAIL] Expedition Pass con Imagen enviado exitosamente a ${payload.to} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[EMAIL ERROR] Error enviando Expedition Pass:', error);
    return { success: false, error: error.message };
  }
};



