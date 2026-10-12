# 🏔️ Santiago Hiking by Gaz_Style — Pendientes, Roadmap y Expansión

Este documento centraliza todos los hitos completados, las tareas pendientes para el lanzamiento oficial y las oportunidades de expansión internacional para no olvidar ningún detalle.

---

## ✅ 1. Ecosistema Digital Completado (Estado Actual)

| Canal / Herramienta | Identificador / Configuración | Estado |
|---|---|---|
| **WhatsApp Cloud API** | Número: `+56 9 5795 8467` / WABA ID: `1583891890177219` | ✅ Operativo |
| **Bot IA Asistente (Gaz)** | DeepSeek API (`deepseek-chat`) con prompt de montaña | ✅ Respondiendo en vivo |
| **Meta Pixel** | `1772258644467735` (Santiago Hiking Pixel) | ✅ Activo |
| **Meta Conversions API (CAPI)** | Token Servidor: `EAAeZAc...` | ✅ Probado (`events_received: 1`) |
| **Google Analytics 4 (GA4)** | `G-BPRY7P4YPL` (Propiedad independiente) | ✅ Midiendo en tiempo real |
| **Google Tag Manager (GTM)** | `GTM-TSLBSQQN` | ✅ Enlazado |
| **Microsoft Clarity** | `ywf770g6y5` (Grabaciones de sesión y mapas de calor) | ✅ Configurado |
| **TikTok Pixel** | `DB6827BC77UDJT301L90` | ✅ Configurado |
| **TikTok Events API (CAPI)** | Token Servidor: `caaa066fae652...` | ✅ Probado (`code: 0, message: OK`) |
| **Google Search Console** | Archivo `google42ee4234a9dc3e43.html` + Meta tag | ✅ Listo en `public/` y `<head>` |
| **Sitemap & SEO** | `https://www.santiagohiking.com/sitemap.xml` dinámico | ✅ Generando rutas |

---

## ⏳ 2. Pendientes Fase 2: Operación y Cobros Locales

Tareas a realizar durante la fase de formalización del negocio:

- [ ] **Correos Electrónicos con Cloudflare & Gmail:**
  - Configurar Cloudflare Email Routing para reenviar correos oficiales (ej: `contacto@santiagohiking.com` o `reservas@santiagohiking.com`) a la bandeja personal de Gmail.
- [ ] **Inicio de Actividades & Tributario (SII):**
  - Formalizar la razón social o inicio como persona natural con giro de turismo aventura / servicios deportivos.
- [ ] **Webhooks de Pasarelas de Pago (MercadoPago & Transbank Webpay):**
  - Conectar los Webhooks para actualizar reservas automáticamente en Supabase de `pending` a `confirmed` cuando entre un pago real.
- [ ] **Método de Pago en Meta Business:**
  - Agregar tarjeta de crédito/débito en WhatsApp Manager / Facturación de Meta para asegurar que el bot nunca se pause tras superar las 1.000 conversaciones gratuitas mensuales.
- [ ] **Historial de Mensajes en Supabase (Opcional):**
  - Ejecutar la tabla `crm_whatsapp_messages` para guardar el log histórico de conversaciones del bot en la base de datos.
- [ ] **Ficha de Google Maps (Google Business Profile) sin oficina:**
  - Crear la ficha configurada como *"Área de servicio"* (cubre Lo Barnechea, Las Condes, Vitacura, Santiago) sin mostrar dirección residencial, para recibir reseñas y llamadas orgánicas.

---

## 🌍 3. Expansión Internacional: Captación de Turistas Extranjeros

Los turistas en Santiago (brasileños, norteamericanos, europeos) son el público con mayor margen: valoran la seguridad, guías bilingües y fotografía profesional, y pagan tarifas en dólares (USD).

### A. Airbnb Experiencias (Airbnb Experiences)
Plataforma #1 para viajeros que ya están hospedados en Santiago buscando qué hacer.

* **Requisitos para postular como Anfitrión Local:**
  - Perfil de anfitrión con biografía clara y enfoque apasionado por la cordillera.
  - Certificación de primeros auxilios en áreas remotas (WFR) mencionada como diferencial de seguridad.
  - Fotos profesionales en alta resolución que transmitan vibra, aventura y atardeceres.
* **Estructura de la Oferta a publicar:**
  - **Título sugerido:** *"Sunset Trek at Cerro Manquehuito + Pro Photography & Mountain Sunset"*
  - **Duración:** 3.5 a 4 horas (ascenso, cumbre al atardecer, descenso con linternas).
  - **Qué incluye:** Guía bilingüe certificado, linternas frontales Petzl, botiquín WFR, sesión de fotos profesionales editadas en la cumbre, snack/picoteo chileno.
  - **Qué debe traer el huésped:** Calzado de trekking o zapatillas con buen agarre, 1.5L de agua, cortaviento/abrigo ligero.
  - **Precio sugerido:** **USD $45 a $65 por persona** (vs $25.000 CLP local).

---

### B. GetYourGuide & Viator (TripAdvisor)
Las dos mayores plataformas globales donde las agencias de viaje y turistas reservan excursiones antes de volar a Chile.

* **Requisitos de la Oferta:**
  - Ficha técnica completa de la actividad (nivel de dificultad, restricciones de edad/salud).
  - Política de cancelación flexible (hasta 24 horas antes con reembolso completo por clima).
  - Integración de disponibilidad de calendario (fechas fijas o tours privados bajo solicitud).
* **Productos recomendados para extranjeros:**
  1. *Sunset Manquehuito Trek* (Medio día / Tarde).
  2. *Andes Mountain Day-Trip: Cerro Pintor o Glaciar El Morado* (Día completo privado, tarifa premium USD $120 - $180 por persona).

---

## 🎯 4. Estrategia de Contenidos & Redes (GazStyle ➔ Santiago Hiking)

Para mantener sincronizada la marca personal con el negocio:

* **Bio de TikTok / Instagram de @GazStyle:**
  - Enlace directo a `https://www.santiagohiking.com` o `https://www.santiagohiking.com/reservar`.
* **Fórmula de Contenido:**
  1. *Gancho (Hook):* Atardecer épico sobre el mar de nubes de Santiago.
  2. *Desarrollo:* Cómo subir seguro, qué equipo llevar, la experiencia de bajar de noche con linternas.
  3. *Llamado a la acción (CTA):* *"Súmate a la próxima salida este fin de semana en santiagohiking.com o escríbenos al WhatsApp de la bio"*.
* **El Píxel de TikTok y Meta:**
  - Ya están optimizados para aprender de cada clic que llegue desde tus videos y convertir a los espectadores en participantes confirmados.

---

*Documento actualizado en el repositorio `gaz_style`. Conservar para seguimiento en las próximas etapas.*
