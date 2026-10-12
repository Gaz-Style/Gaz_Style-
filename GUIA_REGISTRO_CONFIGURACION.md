# 📖 Guía de Registro y Configuración del Sistema: Santiago Hiking by Gaz
> **Proyecto:** `gaz_style` / `santiagohiking.com`  
> **Fecha de actualización:** Octubre 2026  
> **Estado técnico:** Compilación limpia (`npx tsc --noEmit` sin errores)  

---

## 📌 Tabla de Contenidos
1. [Resumen Ejecutivo y Estado del Proyecto](#1-resumen-ejecutivo-y-estado-del-proyecto)
2. [Historial de Archivos Auditados y Modificados](#2-historial-de-archivos-auditados-y-modificados)
3. [SEO para Inteligencia Artificial y Motores (GEO / LLMs)](#3-seo-para-inteligencia-artificial-y-motores-geo--llms)
4. [Arquitectura MarTech y Analítica Digital (GTM + GA4 + Meta Pixel)](#4-arquitectura-martech-y-analítica-digital-gtm--ga4--meta-pixel)
5. [Endpoints de API y Asistente Inteligente](#5-endpoints-de-api-y-asistente-inteligente)
6. [Optimizaciones de Conversión (CRO) y Experiencia de Usuario](#6-optimizaciones-de-conversión-cro-y-experiencia-de-usuario)
7. [Referencia de Variables de Entorno (`.env.local`)](#7-referencia-de-variables-de-entorno-envlocal)
8. [Checklist de Validación y Próximos Pasos](#8-checklist-de-validación-y-próximos-pasos)

---

## 1. Resumen Ejecutivo y Estado del Proyecto

Se ha completado la refactorización integral del ecosistema digital de **Santiago Hiking by Gaz**, resolviendo las fugas de conversión críticas, unificando la identidad de marca, habilitando la indexación para modelos de lenguaje (LLMs / GEO) y dejando preparada la infraestructura de medición publicitaria y analítica.

- **Stack Tecnológico:** Next.js 16 (Turbopack), React 19, TypeScript 5, Tailwind CSS.
- **Base de Datos & Auth:** Supabase (`adventures_catalog`, `agenda_departures`, `leads_guides`, `bookings`).
- **Pasarelas de Pago:** Soporte híbrido Transbank Webpay Plus y MercadoPago.
- **Salud del Código:** Verificado con `npx tsc --noEmit` (0 errores de tipado).

---

## 2. Historial de Archivos Auditados y Modificados

| Componente / Archivo | Ubicación | Tipo de Intervención |
| :--- | :--- | :--- |
| **Página Principal** | `src/app/page.tsx` | Eliminación de `#`, conexión de WhatsApp con mensaje contextualizado, enlace oficial de Instagram, integración de `LeadMagnetForm`. |
| **Lead Magnet Cliente** | `src/app/LeadMagnetForm.tsx` | Componente interactivo con validación de email, estado de carga y mensaje de confirmación sin recargar la página. |
| **Sitemap Dinámico** | `src/app/sitemap.ts` | Dominio fijado a `https://www.santiagohiking.com` con carga dinámica de rutas activas desde Supabase. |
| **Robots & AI Crawlers** | `src/app/robots.ts` | Reglas de acceso explícitas para bots de IA (`GPTBot`, `PerplexityBot`, `ClaudeBot`, etc.). |
| **Protocolo LLMs** | `src/app/llms.txt/route.ts` & `public/llms.txt` | Documento estandarizado de contexto para asistentes virtuales. |
| **SEO y Metadatos** | `src/lib/seo.ts` & `src/app/layout.tsx` | Título optimizado, Schema.org (`SportsActivityLocation`, `FAQPage`), scripts no bloqueantes. |
| **Centro de Preguntas** | `src/app/faq/page.tsx` | Eliminación total de residuos de texto de sastrería; FAQ 100% de trekking, WFR y seguridad. |
| **Motor Analítico** | `src/lib/analytics.ts` | Helper global para enviar eventos simultáneos a GTM, GA4 y Meta Pixel. |
| **Checkout de Reserva** | `src/app/reservar/BookingClient.tsx` | Disparo del evento `begin_checkout` y `InitiateCheckout`. |
| **Confirmación de Compra** | `src/app/reserva/confirmada/page.tsx` | Pantalla de agradecimiento post-pago con evento `purchase` y resolución de error 404. |
| **API Asistente** | `src/app/api/assistant/route.ts` | Endpoint de chat con soporte OpenAI / Gemini y fallback local. |
| **API Captura Leads** | `src/app/api/lead-guide/route.ts` | Endpoint para guardar suscriptores de la guía en Supabase. |

---

## 3. SEO para Inteligencia Artificial y Motores (GEO / LLMs)

Los motores de búsqueda generativa (Perplexity, ChatGPT Search, Claude, Gemini) premian la disponibilidad de datos estructurados directos:

### 3.1. Archivo `llms.txt`
- **Ruta de acceso:** `https://www.santiagohiking.com/llms.txt`
- **Archivos:** `src/app/llms.txt/route.ts` y `public/llms.txt`.
- **Contenido:** Describe la propuesta de valor ("Lifestyle & Community Outdoor Brand"), catálogo de rutas (WildTrek, Sunset Treks, Networking Manquehuito), certificación WFR, rangos de precios en CLP y políticas de seguridad.

### 3.2. Directivas en `robots.ts`
Permite el rastreo selectivo y prioritario a los siguientes user-agents:
- `GPTBot` (OpenAI / ChatGPT)
- `ChatGPT-User` (Navegación en tiempo real de ChatGPT)
- `PerplexityBot` (Perplexity AI)
- `ClaudeBot` (Anthropic Claude)
- `Google-Extended` (Gemini)
- `Bingbot` (Copilot / Bing)

### 3.3. Marcado Schema.org (JSON-LD)
En `src/lib/seo.ts` y `src/app/faq/page.tsx` se inyectan esquemas estructurados de:
- `SportsActivityLocation`
- `Organization`
- `FAQPage`

---

## 4. Arquitectura MarTech y Analítica Digital (GTM + GA4 + Meta Pixel)

Se implementó un concentrador en `src/lib/analytics.ts` para evitar duplicar código en los componentes. Cada evento se dispara automáticamente hacia todas las plataformas configuradas:

```typescript
// Ejemplo de uso en cualquier componente cliente:
import { trackEvent } from '@/lib/analytics';

trackEvent('lead_guide_download', { category: 'lead_magnet' });
```

### Eventos Estandarizados del Embudo
| Acción del Usuario | Evento GA4 / GTM | Evento Meta Pixel | Archivo Involucrado |
| :--- | :--- | :--- | :--- |
| **Descarga Guía (Lead Magnet)** | `lead_guide_download` | `Lead` | `src/app/LeadMagnetForm.tsx` |
| **Clic a WhatsApp** | `contact_whatsapp` | `Contact` | `src/app/page.tsx` |
| **Clic Iniciar Reserva** | `begin_checkout` | `InitiateCheckout` | `src/app/reservar/BookingClient.tsx` |
| **Pago Exitoso Aprobado** | `purchase` | `Purchase` | `src/app/reserva/confirmada/page.tsx` |

> Los scripts en `layout.tsx` están condicionados para ejecutarse únicamente cuando las variables de entorno correspondientes estén presentes. Si no hay llaves definidas, el sitio sigue cargando sin advertencias ni lentitud.

---

## 5. Endpoints de API y Asistente Inteligente

### 5.1. Asistente Conversacional (`/api/assistant`)
- **Archivo:** `src/app/api/assistant/route.ts`
- **Compatibilidad:** Detecta automáticamente `OPENAI_API_KEY` (modelo `gpt-4o-mini`) o `GEMINI_API_KEY` (`gemini-1.5-flash`).
- **Modo Fallback:** Si no hay API key configurada, responde mediante un motor semántico local preentrenado con las rutas, precios y políticas de Santiago Hiking.

### 5.2. Captura de Leads (`/api/lead-guide`)
- **Archivo:** `src/app/api/lead-guide/route.ts`
- **Función:** Valida correos y los inserta en la tabla `leads_guides` en Supabase con marca temporal y estado.

---

## 6. Optimizaciones de Conversión (CRO) y Experiencia de Usuario

1. **Cero Enlaces Rotos:**
   - Botón `"Entrar al WhatsApp"`: Conectado a la comunidad abierta con mensaje preconfigurado.
   - Botón `"Cotizar Ruta Privada"`: Conectado a chat privado con mensaje traducido según el idioma del visitante (Español, Inglés, Portugués).
   - Botón `"Instagram"`: Redirige a `https://www.instagram.com/santiagohiking`.
2. **Formulario de Captura Activo:**
   - Input de email con validación HTML5 + React, botón con spinner animado y mensaje de confirmación tras envío.
3. **Página de Retorno de Checkout:**
   - Se crearon las rutas `/reserva/confirmada` y `/reservar/confirmada` para recibir al usuario tras el pago en MercadoPago o Webpay, eliminando el antiguo error 404.

---

## 7. Referencia de Variables de Entorno (`.env.local`)

Copia y completa estas variables en tu archivo `.env.local` en la raíz del proyecto:

```env
# ==========================================
# 1. ANALÍTICA Y PÍXELES DE MEDICIÓN
# ==========================================
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789012345

# ==========================================
# 2. ASISTENTE INTELIGENTE (Configurar una de las dos)
# ==========================================
OPENAI_API_KEY=sk-proj-...
# o
GEMINI_API_KEY=AIzaSy...

# ==========================================
# 3. DOMINIO Y URL PÚBLICA
# ==========================================
NEXT_PUBLIC_SITE_URL=https://www.santiagohiking.com
NEXT_PUBLIC_BASE_URL=https://www.santiagohiking.com

# ==========================================
# 4. SUPABASE (Base de datos y Storage)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role

# ==========================================
# 5. PASARELAS DE PAGO
# ==========================================
# Transbank Webpay Plus
TRANSBANK_CC=597055555532
TRANSBANK_API_KEY=579B532A7440BBAB610796F83971109DA062B799E263DE022E5434A3E9733C40
TRANSBANK_ENV=INTEGRACION

# MercadoPago (Si se utiliza como respaldo)
MERCADOPAGO_ACCESS_TOKEN=TEST-...
```

---

## 8. Checklist de Validación y Próximos Pasos

- [x] Corrección de enlaces `#` en toda la página de inicio.
- [x] Lead Magnet interactivo con almacenamiento en base de datos.
- [x] Sitemap y robots.txt listos para indexación en Google y bots de IA.
- [x] FAQ estructurado con Schema JSON-LD.
- [x] Motor analítico centralizado (`analytics.ts`) con GA4, GTM, Meta Pixel, Clarity, TikTok y LinkedIn.
- [x] Pegar IDs reales de analítica en `.env.local` (GA4 `G-BPRY7P4YPL`, Meta `1772258644467735`, Clarity `ywf770g6y5`, TikTok `DB6827BC77UDJT301L90`, LinkedIn `11063657`).
- [x] Vincular número oficial de WhatsApp Cloud API (`+56 9 5795 8467` / ID `1417024801484792`) y webhook con IA DeepSeek.
- [x] Unificación de todos los botones web hacia el número oficial del bot (`56957958467`).
- [ ] Cargar fotos reales de salidas en lugar de avatares de librería en testimonios (`TestimonialsCarousel.tsx`).
- [ ] Sincronizar variables de entorno en el panel de Vercel para producción.
