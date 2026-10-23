# 📋 Checklist Maestro de Pendientes, Recursos e Ideas — Santiago Hiking

> **Última actualización:** 17 de Octubre, 2026  
> **Objetivo:** Registro dinámico y centralizado de todas las tareas, recursos, descargables, mejoras técnicas y estratégicas que quedan en cola de espera (backlog) para ser abordadas progresivamente sin perder el foco del desarrollo activo.

---

## 📥 Bandeja de Entrada Rápida (Nuevos Pendientes / Agregar Aquí)
*Espacio ágil para anotar ideas, bugs o solicitudes que surjan en el día a día antes de clasificarlas:*
- [ ] *[Anotar nuevo pendiente aquí...]*

---

## 🎒 1. Recursos para Visitantes & Lead Magnets (Backlog de Contenido)

### A. Rutas y Navegación (Formatos GPX / PDF)
- [ ] **Pack de Tracks GPX con Waypoints Críticos:**
  - Armar archivos `.gpx` oficiales para las rutas reinas (Sierra de Ramón, Manquehue, Pochoco, Pintor).
  - Incluir puntos de control (*checkpoints*), tiempos de corte (*cut-off times*), ubicación de últimas fuentes de agua estacionales y puntos de escape rápido hacia la ciudad.
- [ ] **Guía Editorial PDF: "Top 5 Ascensos Cerca de Santiago":**
  - Ebook/PDF visual descargable de 5 a 8 páginas estilo editorial Arc'teryx.
  - Clasificación por nivel técnico, desnivel acumulado, perfil de esfuerzo y mejor época del año para cada cumbre.
- [ ] **Calendario Infográfico de Temporadas de Montaña:**
  - Gráfico visual que resuma las condiciones mes a mes en la Cordillera Central (verano, deshielos, temporada de nieve, riesgo de radiación UV y ventanas climáticas óptimas).

### B. Checklists y Preparación Física (Formatos PDF / Secuencia de Email)
- [ ] **Checklist Definitivo de Equipamiento de Montaña:**
  - Ficha imprimible/digital en 2 modalidades: *Trekking por el Día* vs. *Expedición con Pernocte*.
  - Desglose del sistema de 3 capas, especificaciones de calzado de relieve, hidratación obligatoria (mínimo 1.5L-2.0L) y equipo de seguridad/comunicaciones.
- [ ] **Plan de Acondicionamiento Físico Urbano (4 Semanas):**
  - Guía paso a paso para senderistas urbanos antes de enfrentar cerros >3.000m (rutinas de escaleras en cerros isla / Costanera, fortalecimiento de cuádriceps, rodillas y cardio).
  - Evaluar entrega mediante secuencia automatizada de correos semanales.
- [ ] **Guía Rápida de Aclimatación y Prevención de Puna (Mal de Altura):**
  - Documento técnico compacto con protocolos de hidratación previa, electrolitos, alimentación y señales de alerta médica para salidas de alta montaña (El Pintor, Leonera, Plomo).

### C. Comunidad y Beneficios de Conversión Inmediata
- [ ] **Canal / Comunidad VIP de Alertas en WhatsApp:**
  - Enlace de invitación entregado tras registrar correo o descargar track.
  - Uso: boletines meteorológicos cordilleranos de fin de semana, estado de senderos (abierto/cerrado) y preventa exclusiva de cupos para salidas guiadas.
- [ ] **Bono de Bienvenida / Código Primera Salida:**
  - Envío automatizado de cupón de bienvenida (15% OFF o arriendo de bastones/casco de montaña bonificado en su primera reserva guiada).

### D. Herramientas Interactivas en la Web
- [ ] **Expansión del Diagnóstico "Tu Próxima Cumbre":**
  - Refinar el flujo interactivo de `LeadMagnetForm.tsx` para segmentar usuarios con/sin transporte propio (identificar prospectos directos para el formato *Expedition Boutique* con pick-up).

---

## 🎨 2. Experiencia de Usuario (UI/UX) y Diseño Web
- [ ] **Revisión de Alineación en Resto de Vistas:**
  - Auditar vistas complementarias (`/rutas/[id]`, `/desafios/[slug]`, `/atlas/[slug]`) asegurando que los contenedores respeten el estándar uniforme establecido (`max-w-4xl` en ficha técnica o columnas consistentes).
- [x] **Optimización de Assets & Imágenes:**
  - Agregado atributo `sizes` a todas las imágenes con propiedad `fill` (incluyendo `ImageRotator`, `HikeAndFlySection`, `UnifiedExpeditionsTabs`, `AtlasShowcaseSection`, `DesafiosSection` y `GlobalSearchModal`).
  - Asegurada compresión `.webp` y `.avif` en fotos de gran formato.
- [x] **Manifest PWA & Marca Unificada:**
  - Actualizado `src/app/manifest.ts` con el nombre oficial "Santiago Hiking", paleta `stone-950` e icono responsive.
- [ ] **PWA & Modo Offline:**
  - Mejorar el Service Worker (`public/sw.js`) para permitir caching de tracks GPX y fichas de cerros sin cobertura móvil en la montaña.

---

## 🔒 2.5 Seguridad y Arquitectura
- [x] **Protección de Consola Administrativa (`/admin`):**
  - Descomentado el control de acceso en `src/lib/supabase/middleware.ts` exigiendo sesión válida a través de Supabase Auth.
- [x] **Middleware Oficial de Next.js (`src/middleware.ts`):**
  - Creado el interceptor oficial para garantizar el enrutamiento internacional (`/en`, `/pt`, `/de`, `/fr`) y refresco de tokens de autenticación.

---

## ⚙️ 3. Operaciones, Pasarelas & Automatizaciones
- [ ] **Webhooks de Pago (MercadoPago / Transbank):**
  - Configurar endpoints de retorno para actualizar estado de reservas en Supabase automáticamente.
- [ ] **Automatización de Correos Transaccionales:**
  - Plantillas oficiales de confirmación con archivo GPX adjunto y checklist PDF de la salida respectiva.
- [ ] **Gestión de Leads en Supabase:**
  - Panel interno en `/admin` para visualizar los contactos recolectados por descarga de tracks o diagnóstico interactivo.

---

## 📌 Guía de Uso del Documento
1. **Marcar tareas completadas:** Cambiar `- [ ]` por `- [x]`.
2. **Agregar nuevas ideas:** Añadirlas directamente en la sección *Bandeja de Entrada Rápida* durante las sesiones de trabajo.
3. **Priorización:** Al iniciar un nuevo sprint, mover elementos de esta lista a desarrollo activo.
