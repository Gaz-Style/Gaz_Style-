const fs = require('fs');
const path = require('path');
const { createClient } = require(path.join(__dirname, '..', 'node_modules', '@supabase', 'supabase-js'));

const env = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        env[key] = val;
      }
    }
  });
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const allExperiences = [
  // ==========================================
  // 1. SALIDAS GRUPALES (Community Pass)
  // ==========================================
  {
    title: 'Cerro Manquehuito Sunset · Café sobre las Nubes',
    category: 'grupales',
    vertical_type: 'trekking',
    custom_discipline: 'Trekking Grupal',
    badge: 'INICIACIÓN · ATARDECER',
    tagline: 'Tu primera cumbre sobre el mar de nubes de Santiago.',
    description: 'Ascenso vespertino de baja dificultad hacia la cumbre del Manquehuito (1.319 m). Conquista la cima al caer el sol, disfruta de un café caliente o infusión de montaña y comparte con la comunidad Gaz-Style con vista panorámica a la cuenca de Santiago.',
    difficulty_level: 'Baja',
    duration_text: '3.5 hrs',
    duration_days: 1,
    max_altitude: '1.319 m',
    elevation_gain: '+350 m',
    distance: '4.5 km',
    base_price: 25000,
    price_usd: 'US$26',
    max_pax: 14,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Lo Barnechea', acceso: 'Vía Roja / Los Trapenses', puntoEncuentro: 'Punto de acceso Vía Roja' },
    highlights: [
      { titulo: 'Café en la Cumbre', descripcion: 'Café caliente o infusión andina mientras cae el sol.' },
      { titulo: 'Comunidad Activa', descripcion: 'Ambiente distendido, seguro y de motivación constante.' }
    ],
    itinerary_steps: [
      { hora: '17:00', titulo: 'Encuentro y Charla Técnica', descripcion: 'Revisión de calzado, bastones y calentamiento.' },
      { hora: '18:45', titulo: 'Cumbre y Atardecer', descripcion: 'Café en cumbre y fotos panorámicas.' },
      { hora: '20:30', titulo: 'Descenso Seguro', descripcion: 'Bajada con frontales y cierre.' }
    ],
    required_equipment: ['Zapatillas con buen agarre', 'Linterna frontal o celular cargado', 'Cortaviento', '1.5L agua'],
    is_active: true
  },
  {
    title: 'Cerro Manquehue Clásico · La Cumbre Ícono',
    category: 'grupales',
    vertical_type: 'trekking',
    custom_discipline: 'Trekking Grupal',
    badge: 'CLÁSICO · COTA 1.627M',
    tagline: 'El gran centinela de la cuenca central de Santiago.',
    description: 'La ruta clásica por excelencia de la capital. Ascenso continuo por senderos de bosque esclerófilo hasta alcanzar la arista rocosa y la meseta cumbrera a 1.627 msnm con vista 360° a toda la ciudad y la Cordillera de los Andes.',
    difficulty_level: 'Media',
    duration_text: '4.5 hrs',
    duration_days: 1,
    max_altitude: '1.627 m',
    elevation_gain: '+625 m',
    distance: '6.0 km',
    base_price: 28000,
    price_usd: 'US$30',
    max_pax: 12,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Lo Barnechea / Vitacura', acceso: 'Cara Norte / Los Trapenses' },
    highlights: [
      { titulo: 'Gateo de Manos Final', descripcion: 'Emocionante tramo final entre bloques de roca.' },
      { titulo: 'Vista 360° Imponente', descripcion: 'Toda la ciudad y el cordón de Los Andes a tus pies.' }
    ],
    itinerary_steps: [
      { hora: '08:30', titulo: 'Inicio de Ascenso', descripcion: 'Paso sostenido entre quillayes y espinos.' },
      { hora: '11:00', titulo: 'Cumbre Manquehue', descripcion: 'Descanso amplio, snack y fotos grupales.' },
      { hora: '13:00', titulo: 'Descenso y Cierre', descripcion: 'Retorno asistido por la misma ruta.' }
    ],
    required_equipment: ['Calzado de trekking', 'Ropa cómoda por capas', '2L agua', 'Protección solar'],
    is_active: true
  },
  {
    title: 'Alto del Naranjo · Bosque & Mirador de Los Andes',
    category: 'grupales',
    vertical_type: 'trekking',
    custom_discipline: 'Trekking Grupal',
    badge: 'MEDIA MONTAÑA · 1.890M',
    tagline: 'La gran terraza natural bajo la imponente cumbre del Cerro Provincia.',
    description: 'Ascenso por la precordillera de Las Condes hasta la famosa meseta del Naranjo (1.890 msnm), protegida por un milenario árbol de quillay y vistas directas a los farallones del Cerro Provincia. Ideal para quienes buscan un buen desafío cardiovascular sin escalada técnica.',
    difficulty_level: 'Media',
    duration_text: '5 hrs',
    duration_days: 1,
    max_altitude: '1.890 m',
    elevation_gain: '+850 m',
    distance: '8.5 km',
    base_price: 28000,
    price_usd: 'US$30',
    max_pax: 14,
    image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Las Condes', acceso: 'Puente Ñilhue / Camino a Farellones' },
    highlights: [
      { titulo: 'El Quillay Centenario', descripcion: 'Un árbol icónico que ha resistido siglos en la altura.' },
      { titulo: 'Entrenamiento de Desnivel', descripcion: 'Más de 850 metros de subida continua para forjar piernas.' }
    ],
    itinerary_steps: [
      { hora: '08:00', titulo: 'Partida desde Puente Ñilhue', descripcion: 'Subida progresiva por la arista.' },
      { hora: '11:00', titulo: 'Llegada al Alto del Naranjo', descripcion: 'Almuerzo ligero bajo la sombra del quillay.' },
      { hora: '13:30', titulo: 'Regreso al Valle', descripcion: 'Bajada fluida y estiramientos.' }
    ],
    required_equipment: ['Calzado de trekking', 'Bastones de apoyo', '2L agua', 'Snack de marcha'],
    is_active: true
  },
  {
    title: 'Cuevas del Manzano · Aventura Precordillerana',
    category: 'grupales',
    vertical_type: 'trekking',
    custom_discipline: 'Trekking Grupal',
    badge: 'CAJÓN DEL MAIPO · NATURALEZA',
    tagline: 'Cuevas geológicas y esteros cristalinos en el corazón del Cajón del Maipo.',
    description: 'Ruta refrescante y formativa que bordea el Estero El Manzano adentrándose en bosques nativos de peumos y litres, culminando en imponentes formaciones rocosas y cavernas de origen sedimentario con miradores hacia el Río Maipo.',
    difficulty_level: 'Media',
    duration_text: '5 hrs',
    duration_days: 1,
    max_altitude: '1.650 m',
    elevation_gain: '+790 m',
    distance: '9.2 km',
    base_price: 30000,
    price_usd: 'US$32',
    max_pax: 12,
    image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'San José de Maipo', acceso: 'El Manzano / Camping El Estero' },
    highlights: [
      { titulo: 'Cavernas Naturales', descripcion: 'Exploración de formaciones geológicas únicas.' },
      { titulo: 'Río y Sombra Nativa', descripcion: 'Senda boscosa fresca con cruces de estero.' }
    ],
    itinerary_steps: [
      { hora: '09:00', titulo: 'Ingreso a la Quebrada', descripcion: 'Caminata sombreada junto al agua.' },
      { hora: '11:30', titulo: 'Llegada a las Cuevas', descripcion: 'Exploración, fotografías y descanso.' },
      { hora: '14:00', titulo: 'Regreso al Manzano', descripcion: 'Descenso suave y cierre grupal.' }
    ],
    required_equipment: ['Calzado con agarre para roca', 'Ropa ligera', 'Ración de marcha', '2L agua'],
    is_active: true
  },
  {
    title: 'Cerro Pochoco · La Escuela Vertical de Santiago',
    category: 'grupales',
    vertical_type: 'trekking',
    custom_discipline: 'Trekking Grupal',
    badge: 'DESAFÍO VERTICAL · 1.804M',
    tagline: 'Pendiente pura y directa para templar el carácter montañero.',
    description: 'El gran campo de entrenamiento de los montañistas de Santiago. Una subida empinada desde el Arrayán que pone a prueba la cadencia y el equilibrio sobre terreno de roca y tierra suelta, premiando con una vista majestuosa al macizo del Plomo y Farellones.',
    difficulty_level: 'Media - Alta',
    duration_text: '4.5 hrs',
    duration_days: 1,
    max_altitude: '1.804 m',
    elevation_gain: '+800 m',
    distance: '5.5 km',
    base_price: 28000,
    price_usd: 'US$30',
    max_pax: 12,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Lo Barnechea', acceso: 'El Arrayán / Observatorio Pochoco' },
    highlights: [
      { titulo: 'Pendiente Fuerte', descripcion: '+800 metros en solo 3 kilómetros de distancia.' },
      { titulo: 'Vista a Farellones', descripcion: 'Mirador hacia los centros invernales y cumbres mayores.' }
    ],
    itinerary_steps: [
      { hora: '08:30', titulo: 'Inicio desde el Observatorio', descripcion: 'Ascenso directo por el filo oeste.' },
      { hora: '11:00', titulo: 'Cumbre Pochoco', descripcion: 'Snack y descanso en la cima.' },
      { hora: '13:00', titulo: 'Descenso Técnico', descripcion: 'Bajada con apoyo de bastones.' }
    ],
    required_equipment: ['Botas o zapatillas con suela Vibram/taqueada', 'Bastones obligatorios', '2L agua', 'Gorro y bloqueador'],
    is_active: true
  },
  {
    title: 'Cerro Carbón · Mirador Panorámico del Parque Metropolitano',
    category: 'grupales',
    vertical_type: 'trekking',
    custom_discipline: 'Trekking Grupal',
    badge: 'SUNSET · COTA 1.365M',
    tagline: 'El mejor mirador urbano sobre el poniente y centro de Santiago.',
    description: 'Ruta amigable y panorámica que sube desde Saint George o Parque Bicentenario hacia la cumbre del Carbón. Perfecta para entrenar entre semana o ver la puesta de sol iluminando el skyline de la ciudad.',
    difficulty_level: 'Baja',
    duration_text: '3 hrs',
    duration_days: 1,
    max_altitude: '1.365 m',
    elevation_gain: '+450 m',
    distance: '5.0 km',
    base_price: 25000,
    price_usd: 'US$26',
    max_pax: 14,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Vitacura / Huechuraba', acceso: 'Rotonda La Pirámide / Bosque Santiago' },
    highlights: [
      { titulo: 'Mirador del Portezuelo', descripcion: 'Vista aérea a la Costanera Norte y el río Mapocho.' },
      { titulo: 'Atardecer Urbano', descripcion: 'Luces de la ciudad encendiéndose al bajar.' }
    ],
    itinerary_steps: [
      { hora: '17:30', titulo: 'Comienzo en La Pirámide', descripcion: 'Subida por senderos amplios con pausas.' },
      { hora: '19:00', titulo: 'Cumbre Cerro Carbón', descripcion: 'Puesta de sol y fotos del skyline.' },
      { hora: '20:30', titulo: 'Cierre', descripcion: 'Bajada asistida.' }
    ],
    required_equipment: ['Zapatillas cómodas', 'Frontal o luz', '1.5L agua', 'Cortaviento'],
    is_active: true
  },

  // ==========================================
  // 2. TRAVESÍAS & GRANDES DESAFÍOS (Endurance)
  // ==========================================
  {
    title: 'Cerro Provincia · El Titán de la Sierra de Ramón',
    category: 'desafios',
    vertical_type: 'challenges',
    custom_discipline: 'Endurance Trekking',
    badge: 'GRAN RETO · +1.800M D+',
    tagline: '1.800 metros de desnivel en una sola jornada. La prueba reina de resistencia en Santiago.',
    description: 'El gran hito de resistencia andina de la capital. Partiendo a orillas del Río Mapocho en Puente Ñilhue, se asciende de forma continua por filos de roca hasta la cumbre a 2.750 msnm con su domo refugio y vista colosal a Santiago y la Cordillera Central.',
    difficulty_level: 'Alta',
    duration_text: 'Full Day (9 - 10 hrs)',
    duration_days: 1,
    max_altitude: '2.750 m',
    elevation_gain: '+1.800 m',
    distance: '18.0 km',
    base_price: 49000,
    price_usd: 'US$54',
    max_pax: 10,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Las Condes', acceso: 'Puente Ñilhue', desnivel: '1.800 metros' },
    highlights: [
      { titulo: '1.800m de Desnivel Puro', descripcion: 'Uno de los mayores desniveles de acceso directo en Chile.' },
      { titulo: 'Domo Refugio en Cumbre', descripcion: 'Histórico refugio metálico en la arista cumbrera.' }
    ],
    itinerary_steps: [
      { hora: '06:30', titulo: 'Partida Madrugadora', descripcion: 'Inicio fresco pasando por Alto del Naranjo.' },
      { hora: '12:00', titulo: 'Cumbre Cerro Provincia (2.750m)', descripcion: 'Tiempo de cumbre, alimentación y descanso.' },
      { hora: '16:30', titulo: 'Llegada al Valle', descripcion: 'Bajada técnica y celebración final.' }
    ],
    required_equipment: ['Calzado de montaña', 'Bastones de trekking', 'Mínimo 3.5L de agua', 'Ración de marcha abundante', 'Cortaviento y polar'],
    is_active: true
  },
  {
    title: 'Cerro San Ramón 3.253m · El Techo de la Cuenca',
    category: 'desafios',
    vertical_type: 'challenges',
    custom_discipline: 'Alta Resistencia',
    badge: 'COTA 3.253M · RETO EXTREMO',
    tagline: 'La montaña más alta frente a Santiago: 2.300 metros de desnivel vertical.',
    description: 'La cumbre tutelar más elevada de la Sierra de Ramón. Una expedición de día completo extremadamente exigente que asciende por Quebrada de Macul o Parque Mahuida cruzando canchales, neveros y pasos de roca hasta los 3.253 msnm.',
    difficulty_level: 'Muy Alta',
    duration_text: 'Full Day Extremo (11 - 13 hrs)',
    duration_days: 1,
    max_altitude: '3.253 m',
    elevation_gain: '+2.300 m',
    distance: '22.0 km',
    base_price: 65000,
    price_usd: 'US$70',
    max_pax: 8,
    image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'La Reina / Peñalolén', acceso: 'Parque Mahuida o Quebrada de Macul' },
    highlights: [
      { titulo: 'Cota 3.253 Metros', descripcion: 'Supera la barrera de los 3.000 metros con vista al Maipo y Plomo.' },
      { titulo: 'Reto de Resistencia Mental', descripcion: 'Jornada épica de más de 20 kilómetros de marcha alpina.' }
    ],
    itinerary_steps: [
      { hora: '05:00', titulo: 'Salida Nocturna con Frontales', descripcion: 'Inicio en Parque Mahuida ganando aristas antes del calor.' },
      { hora: '11:30', titulo: 'Cumbre Cerro San Ramón', descripcion: 'Contemplación del corazón de los Andes.' },
      { hora: '17:30', titulo: 'Fin del Desafío', descripcion: 'Regreso al punto de inicio.' }
    ],
    required_equipment: ['Botas de trekking', 'Bastones', 'Mínimo 4L de agua / sales', 'Ropa técnica de abrigo', 'Frontal potente'],
    is_active: true
  },
  {
    title: 'La Triple Corona Andina · 3 Cumbres en 1 Día',
    category: 'desafios',
    vertical_type: 'challenges',
    custom_discipline: 'Desafío Deportivo',
    badge: '3 CUMBRES · +2.100M D+',
    tagline: 'Manquehuito, Manquehue y Pochoco en un solo envión de pura montaña.',
    description: 'El desafío de ultra-hiking de la cuenca central. Encadenamiento deportivo de las 3 cumbres más emblemáticas en una sola jornada, coordinando traslados estratégicos entre cerros para completar más de 2.100 metros de desnivel positivo.',
    difficulty_level: 'Muy Alta',
    duration_text: 'Full Day (10 hrs)',
    duration_days: 1,
    max_altitude: '1.804 m',
    elevation_gain: '+2.100 m',
    distance: '16.5 km',
    base_price: 59000,
    price_usd: 'US$65',
    max_pax: 10,
    image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Lo Barnechea / Vitacura', concepto: 'Manquehuito + Manquehue + Pochoco' },
    highlights: [
      { titulo: '3 Cumbres en 24 Horas', descripcion: 'Completar la trilogía reina de Santiago.' },
      { titulo: 'Logística Coordinada', descripcion: 'Traslados entre inicio y término de cerros organizados.' }
    ],
    itinerary_steps: [
      { hora: '06:00', titulo: 'Cumbre 1: Manquehuito al Amanecer', descripcion: 'Apertura en Vía Roja.' },
      { hora: '09:30', titulo: 'Cumbre 2: Manquehue Clásico', descripcion: 'Cruce por la arista cumbrera.' },
      { hora: '14:30', titulo: 'Cumbre 3: Pochoco Vertical', descripcion: 'Ataque final al Arrayán y cierre.' }
    ],
    required_equipment: ['Calzado probado', 'Bastones', 'Hidratación 3.5L', 'Comida energética', 'Muda de recambio'],
    is_active: true
  },
  {
    title: 'Cerro La Cruz 2.552m · Aristas de la Sierra',
    category: 'desafios',
    vertical_type: 'challenges',
    custom_discipline: 'Endurance',
    badge: 'SIERRA DE RAMÓN · 2.552M',
    tagline: 'La arista más aérea y escénica sobre el valle oriente de Santiago.',
    description: 'Ascenso sostenido desde Parque Mahuida por la Quebrada de Ramón ganando altura hacia la imponente cruz de hierro que corona los 2.552 msnm. Gran mirador de aves rapaces (cóndores y aguiluchos) y terreno rocoso emocionante.',
    difficulty_level: 'Alta',
    duration_text: 'Full Day (8 hrs)',
    duration_days: 1,
    max_altitude: '2.552 m',
    elevation_gain: '+1.700 m',
    distance: '15.0 km',
    base_price: 48000,
    price_usd: 'US$52',
    max_pax: 10,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'La Reina', acceso: 'Parque Mahuida' },
    highlights: [
      { titulo: 'Aristas de Roca', descripcion: 'Secciones aéreas y panorámicas sobre la ciudad.' },
      { titulo: 'Avistamiento de Cóndores', descripcion: 'Vuelo cercano de cóndores en las térmicas del mediodía.' }
    ],
    itinerary_steps: [
      { hora: '07:00', titulo: 'Partida desde Parque Mahuida', descripcion: 'Subida por sendero de la quebrada.' },
      { hora: '11:30', titulo: 'Cumbre Cerro La Cruz', descripcion: 'Almuerzo en la cruz de hierro a 2.552m.' },
      { hora: '15:30', titulo: 'Retorno al Parque', descripcion: 'Bajada fluida.' }
    ],
    required_equipment: ['Calzado de trekking', 'Bastones', '3L agua', 'Cortaviento y polar'],
    is_active: true
  },
  {
    title: 'Morro Buitrero & Cerro San Roque',
    category: 'desafios',
    vertical_type: 'challenges',
    custom_discipline: 'Media Montaña Técnica',
    badge: 'PRECORDILLERA SALVAJE',
    tagline: 'El rincón agreste de Peñalolén: cascadas, quebradas profundas y cumbres rocosas.',
    description: 'Travesía por la Quebrada de Macul ascendiendo por sectores de pozas de agua y vegetación tupida hacia las cumbres gemelas del Morro Buitrero (2.108m) y Cerro San Roque (2.304m). Menos transitado y más salvaje que las rutas comerciales.',
    difficulty_level: 'Alta',
    duration_text: 'Full Day (8 hrs)',
    duration_days: 1,
    max_altitude: '2.304 m',
    elevation_gain: '+1.500 m',
    distance: '16.0 km',
    base_price: 48000,
    price_usd: 'US$52',
    max_pax: 10,
    image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Peñalolén', acceso: 'Parque Quebrada de Macul' },
    highlights: [
      { titulo: 'Sendero Agreste', descripcion: 'Vegetación espesa y menor afluencia de personas.' },
      { titulo: 'Vistas a la Quebrada', descripcion: 'Profundas vistas hacia el cañón de Macul.' }
    ],
    itinerary_steps: [
      { hora: '07:30', titulo: 'Comienzo en Quebrada de Macul', descripcion: 'Paso por la cascada y desvío al filo.' },
      { hora: '12:00', titulo: 'Cumbres Buitrero y San Roque', descripcion: 'Descanso y fotos en las alturas.' },
      { hora: '16:00', titulo: 'Regreso', descripcion: 'Descenso al portal de entrada.' }
    ],
    required_equipment: ['Zapatillas de trekking con grip', 'Bastones', '3L agua', 'Snack completo'],
    is_active: true
  },
  {
    title: 'Cerro Carpa & Conchalí 2.776m · El Balcón del Arrayán',
    category: 'desafios',
    vertical_type: 'challenges',
    custom_discipline: 'Endurance',
    badge: 'LO BARNECHEA · 2.776M',
    tagline: 'Filos interminables sobre la precordillera norte de Santiago.',
    description: 'Partiendo desde El Arrayán, se remonta la arista divisoria hacia el Cerro Conchalí (2.552m) y se continúa por filos de alta energía hacia la cumbre del Cerro Carpa (2.776 msnm), con vistas directas a Farellones y el glaciar de La Paloma.',
    difficulty_level: 'Alta',
    duration_text: 'Full Day (9 hrs)',
    duration_days: 1,
    max_altitude: '2.776 m',
    elevation_gain: '+1.300 m',
    distance: '16.0 km',
    base_price: 49000,
    price_usd: 'US$54',
    max_pax: 10,
    image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Lo Barnechea', acceso: 'El Arrayán / Santuario del Arrayán' },
    highlights: [
      { titulo: 'Filos Interminables', descripcion: 'Caminata sobre la cresta con viento de cordillera.' },
      { titulo: 'Vista al Glaciar La Paloma', descripcion: 'Panorámica frontal al macizo de Yerba Loca.' }
    ],
    itinerary_steps: [
      { hora: '07:00', titulo: 'Inicio en El Arrayán', descripcion: 'Subida técnica por quebradas secas.' },
      { hora: '12:30', titulo: 'Cumbre Cerro Carpa', descripcion: 'Almuerzo de altura frente al Plomo.' },
      { hora: '16:30', titulo: 'Retorno', descripcion: 'Bajada fluida.' }
    ],
    required_equipment: ['Botas de trekking', 'Bastones obligatorios', '3L agua', 'Corta viento y polar'],
    is_active: true
  },

  // ==========================================
  // 3. EXPEDITION PASS (Privados & Tailor-Made · Costo Base x 3)
  // ==========================================
  {
    title: 'Cerro Manquehue Sunset · Expedition Pass',
    category: 'expedition_pass',
    vertical_type: 'expeditions',
    custom_discipline: 'Trekking Privado Boutique',
    badge: 'EXPEDITION PASS · ATARDECER',
    tagline: 'Tu cumbre privada sobre el mar de nubes de Santiago de Chile.',
    description: 'Ascenso exclusivo y a tu ritmo al cerro más emblemático de Santiago (1.627 msnm). Recogida privada puerta a puerta en tu hotel o residencia, guía bilingüe dedicado, box lunch ancestral gourmet, brindis en cumbre y registro en video Reel 4K editado para tus redes sociales.',
    difficulty_level: 'Media',
    duration_text: 'Medio día (4.5 hrs)',
    duration_days: 1,
    max_altitude: '1.627 m',
    elevation_gain: '+625 m',
    distance: '6.0 km',
    base_price: 280000,
    price_usd: 'US$295',
    max_pax: 4,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Lo Barnechea / Vitacura', pickup: 'Recogida privada incluida en hoteles o residencia', formula: 'Costo Base x 3' },
    highlights: [
      { titulo: 'Pick-up Puerta a Puerta', descripcion: 'Traslado privado en SUV/Van desde tu hotel o domicilio.' },
      { titulo: 'Reel Vertical 4K Editado', descripcion: 'Video cinemático listo para compartir en redes.' },
      { titulo: 'Brindis en Cumbre', descripcion: 'Café caliente o brindis al atardecer sobre Santiago.' },
      { titulo: 'Bebida Helada de Cierre', descripcion: 'Hidratación helada al descender.' }
    ],
    itinerary_steps: [
      { hora: '15:30', titulo: 'Pick-up en tu Hotel/Domicilio', descripcion: 'Encuentro con tu guía Gaz-Style y traslado privado.' },
      { hora: '16:15', titulo: 'Inicio de Ascenso a tu Ritmo', descripcion: 'Caminata sostenida por senderos nativos con pausas fotográficas.' },
      { hora: '18:30', titulo: 'Cumbre Manquehue (1.627m) & Sunset', descripcion: 'Atardecer sobre Santiago, café caliente y catering andino.' },
      { hora: '21:00', titulo: 'Drop-off en Hotel', descripcion: 'Regreso cómodo.' }
    ],
    required_equipment: ['Calzado cómodo con agarre', 'Cortaviento', 'Botella reutilizable', 'Protector solar'],
    is_active: true
  },
  {
    title: 'Cerro Pintor 4.180m VIP · Expedition Pass',
    category: 'expedition_pass',
    vertical_type: 'expeditions',
    custom_discipline: 'Alta Montaña Privada',
    badge: 'EXPEDITION PASS · 4.000M+',
    tagline: 'Tu primera cumbre sobre los 4.000 metros en la cordillera de Farellones.',
    description: 'Experiencia privada de alta montaña con acceso desde La Parva hacia el colorido Cerro Pintor (4.180 msnm). Admira los tonos minerales ocres, verdes y rojizos con vista monumental al Glaciar Iver y la pared sur del Cerro El Plomo. Transporte 4x4 privado, raciones de marcha energéticas, bastones, oximetría y Reel 4K.',
    difficulty_level: 'Alta',
    duration_text: 'Full Day (8 - 9 hrs)',
    duration_days: 1,
    max_altitude: '4.180 m',
    elevation_gain: '+1.235 m',
    distance: '14.0 km',
    base_price: 380000,
    price_usd: 'US$395',
    max_pax: 4,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'La Parva / Farellones', pickup: 'Recogida privada 06:30 AM en tu hospedaje', transporte: 'SUV 4x4' },
    highlights: [
      { titulo: 'Vista Monumental a El Plomo', descripcion: 'Perspectiva de la montaña sagrada de los Incas.' },
      { titulo: 'Monitoreo de Oximetría', descripcion: 'Seguridad activa en aclimatación y control de saturación de oxígeno.' },
      { titulo: 'Reel Vertical 4K', descripcion: 'Video cinemático de tu conquista de los 4.000 metros.' }
    ],
    itinerary_steps: [
      { hora: '06:30', titulo: 'Pick-up Privado', descripcion: 'Subida 4x4 por curvas hacia Farellones y La Parva.' },
      { hora: '08:15', titulo: 'Inicio en Laguna Piuquenes', descripcion: 'Caminata a 3.500m con ritmo personalizado.' },
      { hora: '13:00', titulo: 'Cumbre Cerro Pintor (4.180m)', descripcion: 'Almuerzo de altura frente a glaciares andinos.' },
      { hora: '16:30', titulo: 'Drop-off en Hotel', descripcion: 'Regreso a Santiago.' }
    ],
    required_equipment: ['Botas de montaña con soporte de tobillo', 'Tercera capa cortaviento', 'Gorro y guantes', 'Lentes categoría 3/4'],
    is_active: true
  },
  {
    title: 'Glaciar Nieves Negras & Termas de Colina VIP · Expedition Pass',
    category: 'expedition_pass',
    vertical_type: 'expeditions',
    custom_discipline: 'Trekking & Relax Privado',
    badge: 'EXPEDITION PASS · CAJÓN DEL MAIPO',
    tagline: 'Trekking escénico al glaciar andino y relajación en pozas termales de montaña.',
    description: 'El combo definitivo en el Cajón del Maipo. Trekking privado hacia el imponente Glaciar Nieves Negras a los pies del Volcán San José (3.350m), seguido de baño termal relajante en las piscinas escalonadas de Termas de Colina con aperitivo campestre y vino chileno.',
    difficulty_level: 'Media',
    duration_text: 'Full Day (10 hrs)',
    duration_days: 1,
    max_altitude: '3.350 m',
    elevation_gain: '+620 m',
    distance: '13.0 km',
    base_price: 390000,
    price_usd: 'US$410',
    max_pax: 4,
    image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Cajón del Maipo profundo', pickup: 'Recogida privada 06:30 AM', incluye: 'Entradas a Termas de Colina + Toallas' },
    highlights: [
      { titulo: 'Glaciar Nieves Negras', descripcion: 'Trekking al anfiteatro volcánico del San José.' },
      { titulo: 'Termas Naturales de Colina', descripcion: 'Aguas termales minerales entre 35°C y 55°C.' },
      { titulo: 'Picoteo & Vino Chileno', descripcion: 'Celebración campestre en las termas.' }
    ],
    itinerary_steps: [
      { hora: '06:30', titulo: 'Pick-up en tu Hotel', descripcion: 'Viaje privado por el cañón del Maipo.' },
      { hora: '09:30', titulo: 'Trekking al Glaciar Nieves Negras', descripcion: 'Caminata entre morrenas volcánicas.' },
      { hora: '14:00', titulo: 'Termas de Colina & Picoteo', descripcion: 'Baño termal relajante y almuerzo.' },
      { hora: '18:00', titulo: 'Drop-off en Santiago', descripcion: 'Regreso descansado a la ciudad.' }
    ],
    required_equipment: ['Calzado de trekking', 'Traje de baño y sandalias', 'Ropa de abrigo para la tarde', 'Bloqueador solar'],
    is_active: true
  },
  {
    title: 'Monumento Natural El Morado VIP · Expedition Pass',
    category: 'expedition_pass',
    vertical_type: 'expeditions',
    custom_discipline: 'Trekking Boutique',
    badge: 'EXPEDITION PASS · PARQUE CONAF',
    tagline: 'Caminata alpina a la laguna glaciar del Morado con box lunch gourmet.',
    description: 'Excursión privada al santuario protegido por CONAF en Baños Morales. Sendero que remonta el valle andino pasando por aguas minerales subterráneas hasta la Laguna El Morado a los pies de glaciares colgantes. Incluye entradas al parque, bastones, guía bilingüe y picnic gourmet.',
    difficulty_level: 'Media',
    duration_text: 'Full Day (7 hrs)',
    duration_days: 1,
    max_altitude: '3.120 m',
    elevation_gain: '+450 m',
    distance: '9.0 km',
    base_price: 350000,
    price_usd: 'US$370',
    max_pax: 4,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Baños Morales, Cajón del Maipo', pickup: 'Recogida privada incluida' },
    highlights: [
      { titulo: 'Laguna y Glaciar El Morado', descripcion: 'Espejo de agua alpina bajo glaciares colgantes.' },
      { titulo: 'Aguas Panimávida', descripcion: 'Manantiales naturales de agua mineral gasificada.' },
      { titulo: 'Trato Boutique Personalizado', descripcion: 'Paso adaptado a tus tiempos de disfrute.' }
    ],
    itinerary_steps: [
      { hora: '07:00', titulo: 'Pick-up en Santiago', descripcion: 'Traslado escénico al Cajón del Maipo.' },
      { hora: '09:30', titulo: 'Ingreso a CONAF & Trekking', descripcion: 'Caminata progresiva por el valle.' },
      { hora: '12:30', titulo: 'Laguna El Morado (3.120m)', descripcion: 'Picnic gourmet frente a la pared de roca.' },
      { hora: '16:00', titulo: 'Drop-off en Hotel', descripcion: 'Regreso a Santiago.' }
    ],
    required_equipment: ['Calzado de trekking', 'Cortaviento y polar', 'Lentes de sol', 'Botella de agua'],
    is_active: true
  },

  // ==========================================
  // 4. HIGH MOUNTAIN (Expediciones 5.000m+ · Iguales a Puma Adventures)
  // ==========================================
  {
    title: 'Expedición Cerro Leonera 4.954m · Cancha de Carreras',
    category: 'high_mountain',
    vertical_type: 'expeditions',
    custom_discipline: 'Alta Montaña 2-3 Días',
    badge: 'HIGH MOUNTAIN · 4.954M',
    tagline: 'Campamento de altura a 4.100 metros bajo el cielo más limpio de Chile central.',
    description: 'La gran escuela andina para quienes sueñan con superar los 5.000 y 6.000 metros. Vivencia de 2 a 3 días con campamento en el altiplano de Cancha de Carreras (4.100 m) con vistas directas a la pared sur del Cerro El Plomo. Incluye logística completa de campamento base 4 estaciones, raciones de alta montaña, guías certificados WFR y monitoreo médico de altura.',
    difficulty_level: 'Alta',
    duration_text: '2 Días / 1 Noche',
    duration_days: 2,
    max_altitude: '4.954 m',
    elevation_gain: '+2.100 m',
    distance: '26.0 km',
    base_price: 1160000,
    price_usd: 'US$1.200',
    max_pax: 6,
    image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'La Parva / Cancha de Carreras', campamento: 'Cancha de Carreras (4.100m)', precio_puma: 'Igualado exacto a Puma Adventures US$1.200' },
    highlights: [
      { titulo: 'Campamento Cancha de Carreras', descripcion: 'Una de las planicies de campamento más altas y escénicas de Sudamérica.' },
      { titulo: 'Atardecer & Cielo Estrellado', descripcion: 'Astrofotografía de nivel mundial sobre la cordillera central.' },
      { titulo: 'Cumbre de Casi 5.000 Metros', descripcion: 'El trampolín definitivo para preparar expediciones a los grandes seismiles.' }
    ],
    itinerary_steps: [
      { hora: 'Día 1', titulo: 'La Parva a Cancha de Carreras (4.100m)', descripcion: 'Traslado desde Santiago, ascenso bordeando Laguna Piuquenes y filos hasta la planicie de Cancha de Carreras. Montaje de carpas y cena caliente.' },
      { hora: 'Día 2', titulo: 'Cumbre Leonera (4.954m) & Descenso', descripcion: 'Ataque a cumbre a las 05:00 AM. Acarreo final sostenido y cumbre con vista 360° al Plomo, Marmolejo y Tupungato. Descenso completo a La Parva y regreso a Santiago.' }
    ],
    required_equipment: ['Botas de montaña', 'Saco de dormir confort -5°C / -10°C', 'Carpa 4 estaciones', 'Vestimenta por capas (térmica, polar, cortaviento, pluma)', 'Linterna frontal con pilas de repuesto'],
    is_active: true
  },
  {
    title: 'Expedición Cerro El Plomo 5.424m · Apu Sagrado',
    category: 'high_mountain',
    vertical_type: 'expeditions',
    custom_discipline: 'Expedición de Alta Montaña',
    badge: 'HIGH MOUNTAIN · 5.424M',
    tagline: 'La peregrinación ancestral al santuario de altura inca más importante de Chile central.',
    description: 'Expedición de 3 a 4 días al guardián espiritual del Valle del Mapocho. Cruza el Valle de Piedra Numerada, establece campamento base en Federación (4.150m), supera el histórico Glaciar Iver con crampones y alcanza el adoratorio donde fue ofrendado el Niño del Plomo en el siglo XV. Incluye arrieros con mulas para carga pesada, carpas 4 estaciones, oxígeno medicinal y guías WFR.',
    difficulty_level: 'Muy Alta',
    duration_text: '3 Días / 2 Noches',
    duration_days: 3,
    max_altitude: '5.424 m',
    elevation_gain: '+2.350 m',
    distance: '33.0 km',
    base_price: 1460000,
    price_usd: 'US$1.500',
    max_pax: 8,
    image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'La Parva / Valle del Cepo / Glaciar Iver', campamentos: 'Piedra Numerada (3.400m) y Federación (4.150m)', logistica_mulas: 'Arrieros y mulas incluidas para carga pesada', precio_puma: 'Igualado exacto a Puma Adventures US$1.500' },
    highlights: [
      { titulo: 'Santuario Ceremonial Inca', descripcion: 'Visita el altar ceremonial a más de 5.400 metros donde se descubrió el Niño del Plomo en 1954.' },
      { titulo: 'Cruce Técnico de Glaciar Iver', descripcion: 'Progresión con crampones y piolet sobre hielo milenario.' },
      { titulo: 'Mulas de Carga Incluidas', descripcion: 'Sube liviano el primer día: las mulas trasladan el equipo pesado de campamento.' },
      { titulo: 'Seguridad Médica & Oximetría', descripcion: 'Monitoreo constante de saturación y botiquín de gran altitud.' }
    ],
    itinerary_steps: [
      { hora: 'Día 1', titulo: 'La Parva a Campamento Federación (4.150m)', descripcion: 'Encuentro temprano en Santiago, traslado 4x4 a La Parva. Carga de mulas y marcha escénica pasando por Piedra Numerada hasta montar Campamento Base en Federación.' },
      { hora: 'Día 2', titulo: 'Ataque a Cumbre (5.424m) & Glaciar Iver', descripcion: 'Despertar a las 02:30 AM. Ascenso nocturno por Refugio Agostini, cruce del Glaciar Iver con crampones y llegada al Santuario Inca y Cumbre al amanecer. Retorno a Federación.' },
      { hora: 'Día 3', titulo: 'Descenso a Valle & Regreso a Santiago', descripcion: 'Desarmado de campamento, entrega de carga a arrieros, marcha de descenso a La Parva y traslado a Santiago para celebración de cumbre.' }
    ],
    required_equipment: ['Botas rígidas o semirrígidas de alta montaña', 'Crampones ajustados y piolet de marcha', 'Saco de dormir confort -10°C / -15°C', 'Parka de pluma de alta montaña', 'Colchoneta aislante inflable (R-Value > 4.0)', 'Mochila de ataque 35-45L'],
    is_active: true
  },
  {
    title: 'Expedición Volcán San José 5.856m · Cráter Activo',
    category: 'high_mountain',
    vertical_type: 'expeditions',
    custom_discipline: 'Alta Montaña Extrema',
    badge: 'HIGH MOUNTAIN · 5.856M',
    tagline: 'Asciende al coloso volcánico fronterizo en el corazón salvaje del Cajón del Maipo.',
    description: 'Expedición mayor de 4 días y 3 noches hacia el cráter activo del Volcán San José (5.856 msnm). Desde el Valle de las Arenas hasta los refugios y campamentos de altura (Refugio Plantat 3.130m y Las Lajas 4.100m). Ataque nocturno con vistas a fumarolas volcánicas y un amanecer inigualable sobre la frontera andina chileno-argentina. Logística completa de mulas, campamentos y guías certificados.',
    difficulty_level: 'Muy Alta',
    duration_text: '4 Días / 3 Noches',
    duration_days: 4,
    max_altitude: '5.856 m',
    elevation_gain: '+3.463 m',
    distance: '33.0 km',
    base_price: 1550000,
    price_usd: 'US$1.600',
    max_pax: 6,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    logistics: { sector: 'Cajón del Maipo / Baños Morales', campamentos: 'Refugio Plantat (3.130m) y Campo 1 Las Lajas (4.100m)', precio_puma: 'Igualado exacto a Puma Adventures US$1.600' },
    highlights: [
      { titulo: 'Cráter Activo con Fumarolas', descripcion: 'Experiencia volcánica sobrecogedora a casi 6.000 metros de altitud.' },
      { titulo: 'Aclimatación Escalonada', descripcion: 'Estrategia de dos campos de altura para maximizar la tasa de cumbre.' },
      { titulo: 'Logística Integral en Cajón del Maipo', descripcion: 'Transporte 4x4, arrieros y soporte de seguridad WFR.' }
    ],
    itinerary_steps: [
      { hora: 'Día 1', titulo: 'Santiago a Campamento Base Plantat (3.130m)', descripcion: 'Traslado al Cabrerío en Cajón del Maipo. Marcha hacia el histórico refugio de piedra Plantat y primera noche de campamento.' },
      { hora: 'Día 2', titulo: 'Porteo y Ascenso a Campo 1 Las Lajas (4.100m)', descripcion: 'Jornada de ganancia de altura y aclimatación. Instalación del campo de altura en Las Lajas.' },
      { hora: 'Día 3', titulo: 'Jornada de Cumbre Cráter San José (5.856m)', descripcion: 'Salida a las 02:00 AM. Ascenso por pendientes de nieve y rocas volcánicas hasta el cráter activo. Retorno a Campo 1 o Plantat.' },
      { hora: 'Día 4', titulo: 'Descenso a Cabrerío y Retorno', descripcion: 'Bajada al valle, celebración tradicional en San José de Maipo y traslado a Santiago.' }
    ],
    required_equipment: ['Botas rígidas de alta montaña', 'Crampones y piolet', 'Saco de dormir confort -15°C', 'Carpa 4 estaciones resistente al viento', 'Pluma gruesa 800+ fill power', 'Balaclava y mitones térmicos'],
    is_active: true
  }
];

async function seedCatalog() {
  console.log(`Starting seed of ${allExperiences.length} experiences to adventures_catalog...`);
  let inserted = 0;
  let updated = 0;

  for (const exp of allExperiences) {
    // Check if exists by title
    const { data: existing } = await supabase
      .from('adventures_catalog')
      .select('id')
      .eq('title', exp.title)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('adventures_catalog')
        .update(exp)
        .eq('id', existing.id);

      if (error) {
        console.error(`Error updating "${exp.title}":`, error.message);
      } else {
        updated++;
        console.log(`[UPDATE] ${exp.title}`);
      }
    } else {
      const { error } = await supabase
        .from('adventures_catalog')
        .insert(exp);

      if (error) {
        console.error(`Error inserting "${exp.title}":`, error.message);
      } else {
        inserted++;
        console.log(`[INSERT] ${exp.title}`);
      }
    }
  }

  console.log(`\nSEED COMPLETED: ${inserted} inserted, ${updated} updated.`);
}

seedCatalog();
