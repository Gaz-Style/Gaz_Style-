-- ==============================================================================
-- GAZ-STYLE: CATÁLOGO MAESTRO INTEGRAL DE EXPERIENCIAS (4 PILARES)
-- 1. Salidas Grupales (Community Pass)
-- 2. Travesías & Desafíos (Full Day Endurance)
-- 3. Expedition Pass (Privado Tailor-Made · Costo Base x 3 con Reel 4K y Pick-up)
-- 4. High Mountain (Expediciones 5.000m+ · Precios Igualados a Puma Adventures)
-- ==============================================================================

-- Asegurar columnas universales
ALTER TABLE public.adventures_catalog 
  ADD COLUMN IF NOT EXISTS vertical_type VARCHAR(50) DEFAULT 'trekking',
  ADD COLUMN IF NOT EXISTS custom_discipline VARCHAR(100),
  ADD COLUMN IF NOT EXISTS badge VARCHAR(100),
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS logistics JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS itinerary_steps JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS required_equipment JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS price_usd VARCHAR(20),
  ADD COLUMN IF NOT EXISTS duration_text VARCHAR(100),
  ADD COLUMN IF NOT EXISTS max_altitude VARCHAR(50);

-- ------------------------------------------------------------------------------
-- PILAR 1: SALIDAS GRUPALES (Community Pass · Iniciación & Comunidad)
-- Precios en el Punto Medio: $25.000 - $30.000 CLP (US$26 - US$32)
-- ------------------------------------------------------------------------------

INSERT INTO public.adventures_catalog (
  title, category, vertical_type, custom_discipline, badge, tagline,
  description, difficulty_level, duration_text, duration_days, max_altitude,
  base_price, price_usd, max_pax, image_url, logistics, highlights, itinerary_steps, required_equipment, is_active
) VALUES 
(
  'Manquehuito Sunset', 'grupales', 'trekking', 'Trekking Grupal', 'INICIACIÓN · ATARDECER',
  'Tu primera cumbre sobre el mar de nubes de Santiago.',
  'Ascenso vespertino de baja dificultad hacia la cumbre del Manquehuito (1.319 m). Conquista la cima al caer el sol, disfruta de un café caliente o infusión de montaña y comparte con la comunidad Gaz-Style con vista panorámica a la cuenca de Santiago.',
  'Baja', '3.5 hrs', 1, '1.319 m', 25000, 'US$26', 14,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Lo Barnechea", "acceso": "Vía Roja / Los Trapenses", "puntoEncuentro": "Punto de acceso Vía Roja"}'::jsonb,
  '[{"titulo": "Café en la Cumbre", "descripcion": "Café caliente o infusión andina mientras cae el sol."}, {"titulo": "Comunidad Activa", "descripcion": "Ambiente distendido, seguro y de motivación constante."}]'::jsonb,
  '[{"hora": "17:00", "titulo": "Encuentro y Charla Técnica", "descripcion": "Revisión de calzado, bastones y calentamiento."}, {"hora": "18:45", "titulo": "Cumbre y Atardecer", "descripcion": "Café en cumbre y fotos panorámicas."}, {"hora": "20:30", "titulo": "Descenso Seguro", "descripcion": "Bajada con frontales y cierre."}]'::jsonb,
  '["Zapatillas con buen agarre", "Linterna frontal o celular cargado", "Cortaviento", "1.5L agua"]'::jsonb, true
),
(
  'Manquehue', 'grupales', 'trekking', 'Trekking Grupal', 'CLÁSICO · COTA 1.627M',
  'El gran centinela de la cuenca central de Santiago.',
  'La ruta clásica por excelencia de la capital. Ascenso continuo por senderos de bosque esclerófilo hasta alcanzar la arista rocosa y la meseta cumbrera a 1.627 msnm con vista 360° a toda la ciudad y la Cordillera de los Andes.',
  'Media', '4.5 hrs', 1, '1.627 m', 28000, 'US$30', 12,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Lo Barnechea / Vitacura", "acceso": "Cara Norte / Los Trapenses"}'::jsonb,
  '[{"titulo": "Gateo de Manos Final", "descripcion": "Emocionante tramo final entre bloques de roca."}, {"titulo": "Vista 360° Imponente", "descripcion": "Toda la ciudad y el cordón de Los Andes a tus pies."}]'::jsonb,
  '[{"hora": "08:30", "titulo": "Inicio de Ascenso", "descripcion": "Paso sostenido entre quillayes y espinos."}, {"hora": "11:00", "titulo": "Cumbre Manquehue", "descripcion": "Descanso amplio, snack y fotos grupales."}, {"hora": "13:00", "titulo": "Descenso y Cierre", "descripcion": "Retorno asistido por la misma ruta."}]'::jsonb,
  '["Calzado de trekking", "Ropa cómoda por capas", "2L agua", "Protección solar"]'::jsonb, true
),
(
  'Alto del Naranjo', 'grupales', 'trekking', 'Trekking Grupal', 'MEDIA MONTAÑA · 1.890M',
  'La gran terraza natural bajo la imponente cumbre del Cerro Provincia.',
  'Ascenso por la precordillera de Las Condes hasta la famosa meseta del Naranjo (1.890 msnm), protegida por un milenario árbol de quillay y vistas directas a los farallones del Cerro Provincia. Ideal para quienes buscan un buen desafío cardiovascular sin escalada técnica.',
  'Media', '5 hrs', 1, '1.890 m', 28000, 'US$30', 14,
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Las Condes", "acceso": "Puente Ñilhue / Camino a Farellones"}'::jsonb,
  '[{"titulo": "El Quillay Centenario", "descripcion": "Un árbol icónico que ha resistido siglos en la altura."}, {"titulo": "Entrenamiento de Desnivel", "descripcion": "Más de 850 metros de subida continua para forjar piernas."}]'::jsonb,
  '[{"hora": "08:00", "titulo": "Partida desde Puente Ñilhue", "descripcion": "Subida progresiva por la arista."}, {"hora": "11:00", "titulo": "Llegada al Alto del Naranjo", "descripcion": "Almuerzo ligero bajo la sombra del quillay."}, {"hora": "13:30", "titulo": "Regreso al Valle", "descripcion": "Bajada fluida y estiramientos."}]'::jsonb,
  '["Calzado de trekking", "Bastones de apoyo", "2L agua", "Snack de marcha"]'::jsonb, true
),
(
  'Cuevas del Manzano', 'grupales', 'trekking', 'Trekking Grupal', 'CAJÓN DEL MAIPO · NATURALEZA',
  'Cuevas geológicas y esteros cristalinos en el corazón del Cajón del Maipo.',
  'Ruta refrescante y formativa que bordea el Estero El Manzano adentrándose en bosques nativos de peumos y litres, culminando en imponentes formaciones rocosas y cavernas de origen sedimentario con miradores hacia el Río Maipo.',
  'Media', '5 hrs', 1, '1.650 m', 30000, 'US$32', 12,
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "San José de Maipo", "acceso": "El Manzano / Camping El Estero"}'::jsonb,
  '[{"titulo": "Cavernas Naturales", "descripcion": "Exploración de formaciones geológicas únicas."}, {"titulo": "Río y Sombra Nativa", "descripcion": "Senda boscosa fresca con cruces de estero."}]'::jsonb,
  '[{"hora": "09:00", "titulo": "Ingreso a la Quebrada", "descripcion": "Caminata sombreada junto al agua."}, {"hora": "11:30", "titulo": "Llegada a las Cuevas", "descripcion": "Exploración, fotografías y descanso."}, {"hora": "14:00", "titulo": "Regreso al Manzano", "descripcion": "Descenso suave y cierre grupal."}]'::jsonb,
  '["Calzado con agarre para roca", "Ropa ligera", "Ración de marcha", "2L agua"]'::jsonb, true
),
(
  'Pochoco', 'grupales', 'trekking', 'Trekking Grupal', 'DESAFÍO VERTICAL · 1.804M',
  'Pendiente pura y directa para templar el carácter montañero.',
  'El gran campo de entrenamiento de los montañistas de Santiago. Una subida empinada desde el Arrayán que pone a prueba la cadencia y el equilibrio sobre terreno de roca y tierra suelta, premiando con una vista majestuosa al macizo del Plomo y Farellones.',
  'Media - Alta', '4.5 hrs', 1, '1.804 m', 28000, 'US$30', 12,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Lo Barnechea", "acceso": "El Arrayán / Observatorio Pochoco"}'::jsonb,
  '[{"titulo": "Pendiente Fuerte", "descripcion": "+800 metros en solo 3 kilómetros de distancia."}, {"titulo": "Vista a Farellones", "descripcion": "Mirador hacia los centros invernales y cumbres mayores."}]'::jsonb,
  '[{"hora": "08:30", "titulo": "Inicio desde el Observatorio", "descripcion": "Ascenso directo por el filo oeste."}, {"hora": "11:00", "titulo": "Cumbre Pochoco", "descripcion": "Snack y descanso en la cima."}, {"hora": "13:00", "titulo": "Descenso Técnico", "descripcion": "Bajada con apoyo de bastones."}]'::jsonb,
  '["Botas o zapatillas con suela Vibram/taqueada", "Bastones obligatorios", "2L agua", "Gorro y bloqueador"]'::jsonb, true
),
(
  'Carbón', 'grupales', 'trekking', 'Trekking Grupal', 'SUNSET · COTA 1.365M',
  'El mejor mirador urbano sobre el poniente y centro de Santiago.',
  'Ruta amigable y panorámica que sube desde Saint George o Parque Bicentenario hacia la cumbre del Carbón. Perfecta para entrenar entre semana o ver la puesta de sol iluminando el skyline de la ciudad.',
  'Baja', '3 hrs', 1, '1.365 m', 25000, 'US$26', 14,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Vitacura / Huechuraba", "acceso": "Rotonda La Pirámide / Bosque Santiago"}'::jsonb,
  '[{"titulo": "Mirador del Portezuelo", "descripcion": "Vista aérea a la Costanera Norte y el río Mapocho."}, {"titulo": "Atardecer Urbano", "descripcion": "Luces de la ciudad encendiéndose al bajar."}]'::jsonb,
  '[{"hora": "17:30", "titulo": "Comienzo en La Pirámide", "descripcion": "Subida por senderos amplios con pausas."}, {"hora": "19:00", "titulo": "Cumbre Cerro Carbón", "descripcion": "Puesta de sol y fotos del skyline."}, {"hora": "20:30", "titulo": "Cierre", "descripcion": "Bajada asistida."}]'::jsonb,
  '["Zapatillas cómodas", "Frontal o luz", "1.5L agua", "Cortaviento"]'::jsonb, true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  max_altitude = EXCLUDED.max_altitude,
  duration_text = EXCLUDED.duration_text,
  description = EXCLUDED.description;


-- ------------------------------------------------------------------------------
-- PILAR 2: TRAVESÍAS & GRANDES DESAFÍOS (Full Day Endurance)
-- Precios en el Punto Medio: $45.000 - $65.000 CLP (US$50 - US$70)
-- ------------------------------------------------------------------------------

INSERT INTO public.adventures_catalog (
  title, category, vertical_type, custom_discipline, badge, tagline,
  description, difficulty_level, duration_text, duration_days, max_altitude,
  base_price, price_usd, max_pax, image_url, logistics, highlights, itinerary_steps, required_equipment, is_active
) VALUES
(
  'Cerro Provincia · El Titán de la Sierra de Ramón', 'desafios', 'challenges', 'Endurance Trekking', 'GRAN RETO · +1.800M D+',
  '1.800 metros de desnivel en una sola jornada. La prueba reina de resistencia en Santiago.',
  'El gran hito de resistencia andina de la capital. Partiendo a orillas del Río Mapocho en Puente Ñilhue, se asciende de forma continua por filos de roca hasta la cumbre a 2.750 msnm con su domo refugio y vista colosal a Santiago y la Cordillera Central.',
  'Alta', 'Full Day (9 - 10 hrs)', 1, '2.750 m', 49000, 'US$54', 10,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Las Condes", "acceso": "Puente Ñilhue", "desnivel": "1.800 metros"}'::jsonb,
  '[{"titulo": "1.800m de Desnivel Puro", "descripcion": "Uno de los mayores desniveles de acceso directo en Chile."}, {"titulo": "Domo Refugio en Cumbre", "descripcion": "Histórico refugio metálico en la arista cumbrera."}]'::jsonb,
  '[{"hora": "06:30", "titulo": "Partida Madrugadora", "descripcion": "Inicio fresco pasando por Alto del Naranjo."}, {"hora": "12:00", "titulo": "Cumbre Cerro Provincia (2.750m)", "descripcion": "Tiempo de cumbre, alimentación y descanso."}, {"hora": "16:30", "titulo": "Llegada al Valle", "descripcion": "Bajada técnica y celebración final."}]'::jsonb,
  '["Calzado de montaña", "Bastones de trekking", "Mínimo 3.5L de agua", "Ración de marcha abundante", "Cortaviento y polar"]'::jsonb, true
),
(
  'Cerro San Ramón 3.253m · El Techo de la Cuenca', 'desafios', 'challenges', 'Alta Resistencia', 'COTA 3.253M · RETO EXTREMO',
  'La montaña más alta frente a Santiago: 2.300 metros de desnivel vertical.',
  'La cumbre tutelar más elevada de la Sierra de Ramón. Una expedición de día completo extremadamente exigente que asciende por Quebrada de Macul o Parque Mahuida cruzando canchales, neveros y pasos de roca hasta los 3.253 msnm.',
  'Muy Alta', 'Full Day Extremo (11 - 13 hrs)', 1, '3.253 m', 65000, 'US$70', 8,
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "La Reina / Peñalolén", "acceso": "Parque Mahuida o Quebrada de Macul"}'::jsonb,
  '[{"titulo": "Cota 3.253 Metros", "descripcion": "Supera la barrera de los 3.000 metros con vista al Maipo y Plomo."}, {"titulo": "Reto de Resistencia Mental", "descripcion": "Jornada épica de más de 20 kilómetros de marcha alpina."}]'::jsonb,
  '[{"hora": "05:00", "titulo": "Salida Nocturna con Frontales", "descripcion": "Inicio en Parque Mahuida ganando aristas antes del calor."}, {"hora": "11:30", "titulo": "Cumbre Cerro San Ramón", "descripcion": "Contemplación del corazón de los Andes."}, {"hora": "17:30", "titulo": "Fin del Desafío", "descripcion": "Regreso al punto de inicio."}]'::jsonb,
  '["Botas de trekking", "Bastones", "Mínimo 4L de agua / sales", "Ropa técnica de abrigo", "Frontal potente"]'::jsonb, true
),
(
  'La Triple Corona Andina · 3 Cumbres en 1 Día', 'desafios', 'challenges', 'Desafío Deportivo', '3 CUMBRES · +2.100M D+',
  'Manquehuito, Manquehue y Pochoco en un solo envión de pura montaña.',
  'El desafío de ultra-hiking de la cuenca central. Encadenamiento deportivo de las 3 cumbres más emblemáticas en una sola jornada, coordinando traslados estratégicos entre cerros para completar más de 2.100 metros de desnivel positivo.',
  'Muy Alta', 'Full Day (10 hrs)', 1, '1.804 m', 59000, 'US$65', 10,
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Lo Barnechea / Vitacura", "concepto": "Manquehuito + Manquehue + Pochoco"}'::jsonb,
  '[{"titulo": "3 Cumbres en 24 Horas", "descripcion": "Completar la trilogía reina de Santiago."}, {"titulo": "Logística Coordinada", "descripcion": "Traslados entre inicio y término de cerros organizados."}]'::jsonb,
  '[{"hora": "06:00", "titulo": "Cumbre 1: Manquehuito al Amanecer", "descripcion": "Apertura en Vía Roja."}, {"hora": "09:30", "titulo": "Cumbre 2: Manquehue Clásico", "descripcion": "Cruce por la arista cumbrera."}, {"hora": "14:30", "titulo": "Cumbre 3: Pochoco Vertical", "descripcion": "Ataque final al Arrayán y cierre."}]'::jsonb,
  '["Calzado probado", "Bastones", "Hidratación 3.5L", "Comida energética", "Muda de recambio"]'::jsonb, true
),
(
  'Cerro La Cruz 2.552m · Aristas de la Sierra', 'desafios', 'challenges', 'Endurance', 'SIERRA DE RAMÓN · 2.552M',
  'La arista más aérea y escénica sobre el valle oriente de Santiago.',
  'Ascenso sostenido desde Parque Mahuida por la Quebrada de Ramón ganando altura hacia la imponente cruz de hierro que corona los 2.552 msnm. Gran mirador de aves rapaces (cóndores y aguiluchos) y terreno rocoso emocionante.',
  'Alta', 'Full Day (8 hrs)', 1, '2.552 m', 48000, 'US$52', 10,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "La Reina", "acceso": "Parque Mahuida"}'::jsonb,
  '[{"titulo": "Aristas de Roca", "descripcion": "Secciones aéreas y panorámicas sobre la ciudad."}, {"titulo": "Avistamiento de Cóndores", "descripcion": "Vuelo cercano de cóndores en las térmicas del mediodía."}]'::jsonb,
  '[{"hora": "07:00", "titulo": "Partida desde Parque Mahuida", "descripcion": "Subida por sendero de la quebrada."}, {"hora": "11:30", "titulo": "Cumbre Cerro La Cruz", "descripcion": "Almuerzo en la cruz de hierro a 2.552m."}, {"hora": "15:30", "titulo": "Retorno al Parque", "descripcion": "Bajada fluida."}]'::jsonb,
  '["Calzado de trekking", "Bastones", "3L agua", "Cortaviento y polar"]'::jsonb, true
),
(
  'Morro Buitrero & Cerro San Roque', 'desafios', 'challenges', 'Media Montaña Técnica', 'PRECORDILLERA SALVAJE',
  'El rincón agreste de Peñalolén: cascadas, quebradas profundas y cumbres rocosas.',
  'Travesía por la Quebrada de Macul ascendiendo por sectores de pozas de agua y vegetación tupida hacia las cumbres gemelas del Morro Buitrero (2.108m) y Cerro San Roque (2.304m). Menos transitado y más salvaje que las rutas comerciales.',
  'Alta', 'Full Day (8 hrs)', 1, '2.304 m', 48000, 'US$52', 10,
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Peñalolén", "acceso": "Parque Quebrada de Macul"}'::jsonb,
  '[{"titulo": "Sendero Agreste", "descripcion": "Vegetación espesa y menor afluencia de personas."}, {"titulo": "Vistas a la Quebrada", "descripcion": "Profundas vistas hacia el cañón de Macul."}]'::jsonb,
  '[{"hora": "07:30", "titulo": "Comienzo en Quebrada de Macul", "descripcion": "Paso por la cascada y desvío al filo."}, {"hora": "12:00", "titulo": "Cumbres Buitrero y San Roque", "descripcion": "Descanso y fotos en las alturas."}, {"hora": "16:00", "titulo": "Regreso", "descripcion": "Descenso al portal de entrada."}]'::jsonb,
  '["Zapatillas de trekking con grip", "Bastones", "3L agua", "Snack completo"]'::jsonb, true
),
(
  'Cerro Carpa & Conchalí 2.776m · El Balcón del Arrayán', 'desafios', 'challenges', 'Endurance', 'LO BARNECHEA · 2.776M',
  'Filos interminables sobre la precordillera norte de Santiago.',
  'Partiendo desde El Arrayán, se remonta la arista divisoria hacia el Cerro Conchalí (2.552m) y se continúa por filos de alta energía hacia la cumbre del Cerro Carpa (2.776 msnm), con vistas directas a Farellones y el glaciar de La Paloma.',
  'Alta', 'Full Day (9 hrs)', 1, '2.776 m', 49000, 'US$54', 10,
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Lo Barnechea", "acceso": "El Arrayán / Santuario del Arrayán"}'::jsonb,
  '[{"titulo": "Filos Interminables", "descripcion": "Caminata sobre la cresta con viento de cordillera."}, {"titulo": "Vista al Glaciar La Paloma", "descripcion": "Panorámica frontal al macizo de Yerba Loca."}]'::jsonb,
  '[{"hora": "07:00", "titulo": "Inicio en El Arrayán", "descripcion": "Subida técnica por quebradas secas."}, {"hora": "12:30", "titulo": "Cumbre Cerro Carpa", "descripcion": "Almuerzo de altura frente al Plomo."}, {"hora": "16:30", "titulo": "Retorno", "descripcion": "Bajada fluida."}]'::jsonb,
  '["Botas de trekking", "Bastones obligatorios", "3L agua", "Corta viento y polar"]'::jsonb, true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  max_altitude = EXCLUDED.max_altitude,
  duration_text = EXCLUDED.duration_text,
  description = EXCLUDED.description;


-- ------------------------------------------------------------------------------
-- PILAR 3: EXPEDITION PASS (Privados & Tailor-Made · Costo Base x 3)
-- Precios en el Punto Medio: $280.000 - $390.000 CLP (US$295 - US$410)
-- ------------------------------------------------------------------------------

INSERT INTO public.adventures_catalog (
  title, category, vertical_type, custom_discipline, badge, tagline,
  description, difficulty_level, duration_text, duration_days, max_altitude,
  base_price, price_usd, max_pax, image_url, logistics, highlights, itinerary_steps, required_equipment, is_active
) VALUES
(
  'Cerro Manquehue Sunset · Expedition Pass', 'expedition_pass', 'expeditions', 'Trekking Privado Boutique', 'EXPEDITION PASS · ATARDECER',
  'Tu cumbre privada sobre el mar de nubes de Santiago de Chile.',
  'Ascenso exclusivo y a tu ritmo al cerro más emblemático de Santiago (1.627 msnm). Recogida privada puerta a puerta en tu hotel o residencia, guía bilingüe dedicado, box lunch ancestral gourmet, brindis en cumbre y registro en video Reel 4K editado para tus redes sociales.',
  'Media', 'Medio día (4.5 hrs)', 1, '1.627 m', 280000, 'US$295', 4,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Lo Barnechea / Vitacura", "pickup": "Recogida privada incluida en hoteles o residencia", "formula": "Costo Base x 3"}'::jsonb,
  '[{"titulo": "Pick-up Puerta a Puerta", "descripcion": "Traslado privado en SUV/Van desde tu hotel o domicilio."}, {"titulo": "Reel Vertical 4K Editado", "descripcion": "Video cinemático listo para compartir en redes."}, {"titulo": "Brindis en Cumbre", "descripcion": "Café caliente o brindis al atardecer sobre Santiago."}, {"titulo": "Bebida Helada de Cierre", "descripcion": "Hidratación helada al descender."}]'::jsonb,
  '[{"hora": "15:30", "titulo": "Pick-up en tu Hotel/Domicilio", "descripcion": "Encuentro con tu guía Gaz-Style y traslado privado."}, {"hora": "16:15", "titulo": "Inicio de Ascenso a tu Ritmo", "descripcion": "Caminata sostenida por senderos nativos con pausas fotográficas."}, {"hora": "18:30", "titulo": "Cumbre Manquehue (1.627m) & Sunset", "descripcion": "Atardecer sobre Santiago, café caliente y catering andino."}, {"hora": "21:00", "titulo": "Drop-off en Hotel", "descripcion": "Regreso cómodo."}]'::jsonb,
  '["Calzado cómodo con agarre", "Cortaviento", "Botella reutilizable", "Protector solar"]'::jsonb, true
),
(
  'Cerro Pintor 4.180m VIP · Expedition Pass', 'expedition_pass', 'expeditions', 'Alta Montaña Privada', 'EXPEDITION PASS · 4.000M+',
  'Tu primera cumbre sobre los 4.000 metros en la cordillera de Farellones.',
  'Experiencia privada de alta montaña con acceso desde La Parva hacia el colorido Cerro Pintor (4.180 msnm). Admira los tonos minerales ocres, verdes y rojizos con vista monumental al Glaciar Iver y la pared sur del Cerro El Plomo. Transporte 4x4 privado, raciones de marcha energéticas, bastones, oximetría y Reel 4K.',
  'Alta', 'Full Day (8 - 9 hrs)', 1, '4.180 m', 380000, 'US$395', 4,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "La Parva / Farellones", "pickup": "Recogida privada 06:30 AM en tu hospedaje", "transporte": "SUV 4x4"}'::jsonb,
  '[{"titulo": "Vista Monumental a El Plomo", "descripcion": "Perspectiva de la montaña sagrada de los Incas."}, {"titulo": "Monitoreo de Oximetría", "descripcion": "Seguridad activa en aclimatación y control de saturación de oxígeno."}, {"titulo": "Reel Vertical 4K", "descripcion": "Video cinemático de tu conquista de los 4.000 metros."}]'::jsonb,
  '[{"hora": "06:30", "titulo": "Pick-up Privado", "descripcion": "Subida 4x4 por curvas hacia Farellones y La Parva."}, {"hora": "08:15", "titulo": "Inicio en Laguna Piuquenes", "descripcion": "Caminata a 3.500m con ritmo personalizado."}, {"hora": "13:00", "titulo": "Cumbre Cerro Pintor (4.180m)", "descripcion": "Almuerzo de altura frente a glaciares andinos."}, {"hora": "16:30", "titulo": "Drop-off en Hotel", "descripcion": "Regreso a Santiago."}]'::jsonb,
  '["Botas de montaña con soporte de tobillo", "Tercera capa cortaviento", "Gorro y guantes", "Lentes categoría 3/4"]'::jsonb, true
),
(
  'Glaciar Nieves Negras & Termas de Colina VIP · Expedition Pass', 'expedition_pass', 'expeditions', 'Trekking & Relax Privado', 'EXPEDITION PASS · CAJÓN DEL MAIPO',
  'Trekking escénico al glaciar andino y relajación en pozas termales de montaña.',
  'El combo definitivo en el Cajón del Maipo. Trekking privado hacia el imponente Glaciar Nieves Negras a los pies del Volcán San José (3.350m), seguido de baño termal relajante en las piscinas escalonadas de Termas de Colina con aperitivo campestre y vino chileno.',
  'Media', 'Full Day (10 hrs)', 1, '3.350 m', 390000, 'US$410', 4,
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Cajón del Maipo profundo", "pickup": "Recogida privada 06:30 AM", "incluye": "Entradas a Termas de Colina + Toallas"}'::jsonb,
  '[{"titulo": "Glaciar Nieves Negras", "descripcion": "Trekking al anfiteatro volcánico del San José."}, {"titulo": "Termas Naturales de Colina", "descripcion": "Aguas termales minerales entre 35°C y 55°C."}, {"titulo": "Picoteo & Vino Chileno", "descripcion": "Celebración campestre en las termas."}]'::jsonb,
  '[{"hora": "06:30", "titulo": "Pick-up en tu Hotel", "descripcion": "Viaje privado por el cañón del Maipo."}, {"hora": "09:30", "titulo": "Trekking al Glaciar Nieves Negras", "descripcion": "Caminata entre morrenas volcánicas."}, {"hora": "14:00", "titulo": "Termas de Colina & Picoteo", "descripcion": "Baño termal relajante y almuerzo."}, {"hora": "18:00", "titulo": "Drop-off en Santiago", "descripcion": "Regreso descansado a la ciudad."}]'::jsonb,
  '["Calzado de trekking", "Traje de baño y sandalias", "Ropa de abrigo para la tarde", "Bloqueador solar"]'::jsonb, true
),
(
  'Monumento Natural El Morado VIP · Expedition Pass', 'expedition_pass', 'expeditions', 'Trekking Boutique', 'EXPEDITION PASS · PARQUE CONAF',
  'Caminata alpina a la laguna glaciar del Morado con box lunch gourmet.',
  'Excursión privada al santuario protegido por CONAF en Baños Morales. Sendero que remonta el valle andino pasando por aguas minerales subterráneas hasta la Laguna El Morado a los pies de glaciares colgantes. Incluye entradas al parque, bastones, guía bilingüe y picnic gourmet.',
  'Media', 'Full Day (7 hrs)', 1, '3.120 m', 350000, 'US$370', 4,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Baños Morales, Cajón del Maipo", "pickup": "Recogida privada incluida"}'::jsonb,
  '[{"titulo": "Laguna y Glaciar El Morado", "descripcion": "Espejo de agua alpina bajo glaciares colgantes."}, {"titulo": "Aguas Panimávida", "descripcion": "Manantiales naturales de agua mineral gasificada."}, {"titulo": "Trato Boutique Personalizado", "descripcion": "Paso adaptado a tus tiempos de disfrute."}]'::jsonb,
  '[{"hora": "07:00", "titulo": "Pick-up en Santiago", "descripcion": "Traslado escénico al Cajón del Maipo."}, {"hora": "09:30", "titulo": "Ingreso a CONAF & Trekking", "descripcion": "Caminata progresiva por el valle."}, {"hora": "12:30", "titulo": "Laguna El Morado (3.120m)", "descripcion": "Picnic gourmet frente a la pared de roca."}, {"hora": "16:00", "titulo": "Drop-off en Hotel", "descripcion": "Regreso a Santiago."}]'::jsonb,
  '["Calzado de trekking", "Cortaviento y polar", "Lentes de sol", "Botella de agua"]'::jsonb, true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  max_altitude = EXCLUDED.max_altitude,
  duration_text = EXCLUDED.duration_text,
  description = EXCLUDED.description;


-- ------------------------------------------------------------------------------
-- PILAR 4: HIGH MOUNTAIN (Expediciones 5.000m+ · Precios Igualados a Puma Adventures)
-- Leonera: US$1.200 | El Plomo: US$1.500 | Volcán San José: US$1.600
-- ------------------------------------------------------------------------------

INSERT INTO public.adventures_catalog (
  title, category, vertical_type, custom_discipline, badge, tagline,
  description, difficulty_level, duration_text, duration_days, max_altitude,
  base_price, price_usd, max_pax, image_url, logistics, highlights, itinerary_steps, required_equipment, is_active
) VALUES
(
  'Expedición Cerro Leonera 4.954m · Cancha de Carreras', 'high_mountain', 'expeditions', 'Alta Montaña 2-3 Días', 'HIGH MOUNTAIN · 4.954M',
  'Campamento de altura a 4.100 metros bajo el cielo más limpio de Chile central.',
  'La gran escuela andina para quienes sueñan con superar los 5.000 y 6.000 metros. Vivencia de 2 a 3 días con campamento en el altiplano de Cancha de Carreras (4.100 m) con vistas directas a la pared sur del Cerro El Plomo. Incluye logística completa de campamento base 4 estaciones, raciones de alta montaña, guías certificados WFR y monitoreo médico de altura.',
  'Alta', '2 Días / 1 Noche', 2, '4.954 m', 1160000, 'US$1.200', 6,
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "La Parva / Cancha de Carreras", "campamento": "Cancha de Carreras (4.100m)", "precio_puma": "Igualado exacto a Puma Adventures US$1.200"}'::jsonb,
  '[{"titulo": "Campamento Cancha de Carreras", "descripcion": "Una de las planicies de campamento más altas y escénicas de Sudamérica."}, {"titulo": "Atardecer & Cielo Estrellado", "descripcion": "Astrofotografía de nivel mundial sobre la cordillera central."}, {"titulo": "Cumbre de Casi 5.000 Metros", "descripcion": "El trampolín definitivo para preparar expediciones a los grandes seismiles."}]'::jsonb,
  '[{"hora": "Día 1", "titulo": "La Parva a Cancha de Carreras (4.100m)", "descripcion": "Traslado desde Santiago, ascenso bordeando Laguna Piuquenes y filos hasta la planicie de Cancha de Carreras. Montaje de carpas y cena caliente."}, {"hora": "Día 2", "titulo": "Cumbre Leonera (4.954m) & Descenso", "descripcion": "Ataque a cumbre a las 05:00 AM. Acarreo final sostenido y cumbre con vista 360° al Plomo, Marmolejo y Tupungato. Descenso completo a La Parva y regreso a Santiago."}]'::jsonb,
  '["Botas de montaña", "Saco de dormir confort -5°C / -10°C", "Carpa 4 estaciones", "Vestimenta por capas (térmica, polar, cortaviento, pluma)", "Linterna frontal con pilas de repuesto"]'::jsonb, true
),
(
  'Expedición Cerro El Plomo 5.424m · Apu Sagrado', 'high_mountain', 'expeditions', 'Expedición de Alta Montaña', 'HIGH MOUNTAIN · 5.424M',
  'La peregrinación ancestral al santuario de altura inca más importante de Chile central.',
  'Expedición de 3 a 4 días al guardián espiritual del Valle del Mapocho. Cruza el Valle de Piedra Numerada, establece campamento base en Federación (4.150m), supera el histórico Glaciar Iver con crampones y alcanza el adoratorio donde fue ofrendado el Niño del Plomo en el siglo XV. Incluye arrieros con mulas para carga pesada, carpas 4 estaciones, oxígeno medicinal y guías WFR.',
  'Muy Alta', '3 Días / 2 Noches', 3, '5.424 m', 1460000, 'US$1.500', 8,
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "La Parva / Valle del Cepo / Glaciar Iver", "campamentos": "Piedra Numerada (3.400m) y Federación (4.150m)", "logistica_mulas": "Arrieros y mulas incluidas para carga pesada", "precio_puma": "Igualado exacto a Puma Adventures US$1.500"}'::jsonb,
  '[{"titulo": "Santuario Ceremonial Inca", "descripcion": "Visita el altar ceremonial a más de 5.400 metros donde se descubrió el Niño del Plomo en 1954."}, {"titulo": "Cruce Técnico de Glaciar Iver", "descripcion": "Progresión con crampones y piolet sobre hielo milenario."}, {"titulo": "Mulas de Carga Incluidas", "descripcion": "Sube liviano el primer día: las mulas trasladan el equipo pesado de campamento."}, {"titulo": "Seguridad Médica & Oximetría", "descripcion": "Monitoreo constante de saturación y botiquín de gran altitud."}]'::jsonb,
  '[{"hora": "Día 1", "titulo": "La Parva a Campamento Federación (4.150m)", "descripcion": "Encuentro temprano en Santiago, traslado 4x4 a La Parva. Carga de mulas y marcha escénica pasando por Piedra Numerada hasta montar Campamento Base en Federación."}, {"hora": "Día 2", "titulo": "Ataque a Cumbre (5.424m) & Glaciar Iver", "descripcion": "Despertar a las 02:30 AM. Ascenso nocturno por Refugio Agostini, cruce del Glaciar Iver con crampones y llegada al Santuario Inca y Cumbre al amanecer. Retorno a Federación."}, {"hora": "Día 3", "titulo": "Descenso a Valle & Regreso a Santiago", "descripcion": "Desarmado de campamento, entrega de carga a arrieros, marcha de descenso a La Parva y traslado a Santiago para celebración de cumbre."}]'::jsonb,
  '["Botas rígidas o semirrígidas de alta montaña", "Crampones ajustados y piolet de marcha", "Saco de dormir confort -10°C / -15°C", "Parka de pluma de alta montaña", "Colchoneta aislante inflable (R-Value > 4.0)", "Mochila de ataque 35-45L"]'::jsonb, true
),
(
  'Expedición Volcán San José 5.856m · Cráter Activo', 'high_mountain', 'expeditions', 'Alta Montaña Extrema', 'HIGH MOUNTAIN · 5.856M',
  'Asciende al coloso volcánico fronterizo en el corazón salvaje del Cajón del Maipo.',
  'Expedición mayor de 4 días y 3 noches hacia el cráter activo del Volcán San José (5.856 msnm). Desde el Valle de las Arenas hasta los refugios y campamentos de altura (Refugio Plantat 3.130m y Las Lajas 4.100m). Ataque nocturno con vistas a fumarolas volcánicas y un amanecer inigualable sobre la frontera andina chileno-argentina. Logística completa de mulas, campamentos y guías certificados.',
  'Muy Alta', '4 Días / 3 Noches', 4, '5.856 m', 1550000, 'US$1.600', 6,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{"sector": "Cajón del Maipo / Baños Morales", "campamentos": "Refugio Plantat (3.130m) y Campo 1 Las Lajas (4.100m)", "precio_puma": "Igualado exacto a Puma Adventures US$1.600"}'::jsonb,
  '[{"titulo": "Cráter Activo con Fumarolas", "descripcion": "Experiencia volcánica sobrecogedora a casi 6.000 metros de altitud."}, {"titulo": "Aclimatación Escalonada", "descripcion": "Estrategia de dos campos de altura para maximizar la tasa de cumbre."}, {"titulo": "Logística Integral en Cajón del Maipo", "descripcion": "Transporte 4x4, arrieros y soporte de seguridad WFR."}]'::jsonb,
  '[{"hora": "Día 1", "titulo": "Santiago a Campamento Base Plantat (3.130m)", "descripcion": "Traslado al Cabrerío en Cajón del Maipo. Marcha hacia el histórico refugio de piedra Plantat y primera noche de campamento."}, {"hora": "Día 2", "titulo": "Porteo y Ascenso a Campo 1 Las Lajas (4.100m)", "descripcion": "Jornada de ganancia de altura y aclimatación. Instalación del campo de altura en Las Lajas."}, {"hora": "Día 3", "titulo": "Jornada de Cumbre Cráter San José (5.856m)", "descripcion": "Salida a las 02:00 AM. Ascenso por pendientes de nieve y rocas volcánicas hasta el cráter activo. Retorno a Campo 1 o Plantat."}, {"hora": "Día 4", "titulo": "Descenso a Cabrerío y Retorno", "descripcion": "Bajada al valle, celebración tradicional en San José de Maipo y traslado a Santiago."}]'::jsonb,
  '["Botas rígidas de alta montaña", "Crampones y piolet", "Saco de dormir confort -15°C", "Carpa 4 estaciones resistente al viento", "Pluma gruesa 800+ fill power", "Balaclava y mitones térmicos"]'::jsonb, true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  max_altitude = EXCLUDED.max_altitude,
  duration_text = EXCLUDED.duration_text,
  description = EXCLUDED.description;

-- Notificar a PostgREST para refrescar caché
NOTIFY pgrst, 'reload schema';
