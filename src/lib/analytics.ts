/**
 * Ecosistema de Medición y Analítica Digital: Santiago Hiking
 * Integra dataLayer (GTM), Google Analytics 4 (gtag) y Meta Pixel (fbq).
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

// 1. Envío genérico seguro
export function pushDataLayer(event: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    timestamp: new Date().toISOString(),
    ...params,
  });
}

// 2. Registro de Vistas de Página (PageView)
export function trackPageView(url: string, pageType: string = 'general') {
  if (typeof window === 'undefined') return;

  pushDataLayer('page_view', { page_path: url, page_type: pageType });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: url, page_type: pageType });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

// 3. Vista de Ficha de Ruta / Expedición
export function trackViewRoute(route: { id: string; title: string; price?: number; category?: string }) {
  if (typeof window === 'undefined') return;

  pushDataLayer('view_item', {
    item_id: route.id,
    item_name: route.title,
    price: route.price || 0,
    item_category: route.category || 'Trekking',
    currency: 'CLP',
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'view_item', {
      currency: 'CLP',
      value: route.price || 0,
      items: [{ item_id: route.id, item_name: route.title, price: route.price }],
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: route.title,
      content_ids: [route.id],
      content_type: 'product',
      value: route.price || 0,
      currency: 'CLP',
    });
  }
}

// 4. Inicio de Proceso de Reserva (Begin Checkout)
export function trackBeginCheckout(item: { id: string; title: string; price: number }) {
  if (typeof window === 'undefined') return;

  pushDataLayer('begin_checkout', {
    item_id: item.id,
    item_name: item.title,
    value: item.price,
    currency: 'CLP',
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'begin_checkout', {
      value: item.price,
      currency: 'CLP',
      items: [{ item_id: item.id, item_name: item.title, price: item.price }],
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      content_name: item.title,
      content_ids: [item.id],
      value: item.price,
      currency: 'CLP',
    });
  }
}

// 5. Reserva Completada con Éxito (Purchase)
export function trackPurchaseSuccess(order: { id: string; amount: number; routeTitle: string }) {
  if (typeof window === 'undefined') return;

  pushDataLayer('purchase', {
    transaction_id: order.id,
    value: order.amount,
    currency: 'CLP',
    item_name: order.routeTitle,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.amount,
      currency: 'CLP',
      items: [{ item_name: order.routeTitle, price: order.amount }],
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      content_name: order.routeTitle,
      value: order.amount,
      currency: 'CLP',
    });
  }
}

// 6. Clic en WhatsApp (Contacto de Alta Intención)
export function trackWhatsAppClick(placement: string = 'header') {
  if (typeof window === 'undefined') return;

  pushDataLayer('contact_whatsapp', {
    placement,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      method: 'whatsapp',
      placement,
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_name: `WhatsApp - ${placement}`,
    });
  }
}

// 7. Captura de Email en Lead Magnet
export function trackLeadGuide(email: string) {
  if (typeof window === 'undefined') return;

  pushDataLayer('lead_guide_download', {
    lead_type: 'guia_5_rutas',
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'lead', {
      lead_type: 'guia_5_rutas',
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: 'Guia 5 Rutas Santiago',
    });
  }
}
