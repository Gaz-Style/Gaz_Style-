-- ==============================================================================
-- GAZ-STYLE: ARQUITECTURA TARIFARIA OFICIAL
-- 1. HIGH MOUNTAIN: Iguala precios exactos a Puma Adventures (US$1.200 - US$1.600)
-- 2. DEMÁS OFERTAS: Punto medio de mercado calculando costo base
-- ==============================================================================

-- 1. EXPEDITION PASS (Punto Medio calculando Costo Base)
-- ------------------------------------------------------------------------------

-- 1.1 Cerro Manquehue Sunset VIP (Medio Día Privado)
-- Costo base (Pick-up SUV + Guía WFR + Reel 4K + Box Lunch gourmet) -> Punto medio $280.000 CLP / US$295
INSERT INTO public.adventures_catalog (
  title,
  category,
  vertical_type,
  custom_discipline,
  badge,
  tagline,
  description,
  difficulty_level,
  duration_text,
  duration_days,
  max_altitude,
  base_price,
  price_usd,
  max_pax,
  image_url,
  logistics,
  highlights,
  itinerary_steps,
  required_equipment,
  is_active
) VALUES (
  'Cerro Manquehue Sunset · Expedition Pass',
  'expedition_pass',
  'expeditions',
  'Trekking Privado Boutique',
  'EXPEDITION PASS · ATARDECER',
  'Tu cumbre privada sobre el mar de nubes de Santiago de Chile.',
  'Ascenso exclusivo y a tu ritmo al cerro más emblemático de Santiago (1.627 msnm). Recogida privada puerta a puerta en tu hotel o residencia, guía bilingüe dedicado, box lunch ancestral gourmet, brindis en cumbre y registro en video Reel 4K editado para tus redes sociales.',
  'Media',
  'Medio día (4.5 hrs)',
  1,
  '1.627 m',
  280000,
  'US$295',
  4,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  '{
    "sector": "Lo Barnechea / Vitacura, Santiago",
    "acceso": "Privado cara norte / Los Trapenses",
    "pickup": "Recogida privada incluida en hoteles o residencia",
    "coordenadas": "-33.3512, -70.5841"
  }'::jsonb,
  '[
    {"titulo": "Recogida Puerta a Puerta", "descripcion": "Traslado privado en SUV/Van desde tu hotel o domicilio en Santiago."},
    {"titulo": "Reel Vertical 4K Editado", "descripcion": "Registro audiovisual cinemático listo para publicar en tus redes."},
    {"titulo": "Brindis Ceremonial en Cumbre", "descripcion": "Café caliente o brindis al atardecer con vista panorámica 360°."},
    {"titulo": "Bebida Helada de Cierre", "descripcion": "Hidratación helada al descender antes de volver al hotel."}
  ]'::jsonb,
  '[
    {"hora": "15:30", "titulo": "Pick-up en tu Hotel/Domicilio", "descripcion": "Encuentro con tu guía Gaz-Style y traslado privado al punto de inicio."},
    {"hora": "16:15", "titulo": "Inicio de Ascenso a tu Ritmo", "descripcion": "Caminata sostenida por senderos nativos con pausas fotográficas e hidratación."},
    {"hora": "18:30", "titulo": "Cumbre Manquehue (1.627m) & Sunset", "descripcion": "Momento cumbre: contemplación del atardecer sobre Santiago, café caliente y catering andino."},
    {"hora": "19:45", "titulo": "Descenso Seguro", "descripcion": "Bajada asistida con bastones de trekking y linternas frontales si anochece."},
    {"hora": "21:00", "titulo": "Regreso & Drop-off", "descripcion": "Bebida helada al finalizar y traslado de vuelta a tu hospedaje."}
  ]'::jsonb,
  '["Calzado de trekking con buen agarre", "Cortaviento o abrigo liviano", "Botella reutilizable 1.5L", "Lentes de sol y protector solar"]'::jsonb,
  true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  description = EXCLUDED.description;

-- 1.2 Cerro Pintor 4.180m VIP (Full Day Privado)
-- Costo base (Pick-up Farellones 4x4 + Guía alta montaña + Box Lunch + Reel 4K) -> Punto medio $380.000 CLP / US$395
INSERT INTO public.adventures_catalog (
  title,
  category,
  vertical_type,
  custom_discipline,
  badge,
  tagline,
  description,
  difficulty_level,
  duration_text,
  duration_days,
  max_altitude,
  base_price,
  price_usd,
  max_pax,
  image_url,
  logistics,
  highlights,
  itinerary_steps,
  required_equipment,
  is_active
) VALUES (
  'Cerro Pintor 4.180m · Expedition Pass',
  'expedition_pass',
  'expeditions',
  'Alta Montaña Privada',
  'EXPEDITION PASS · 4.000M+',
  'Tu primera cumbre sobre los 4.000 metros en la cordillera de Farellones.',
  'Experiencia privada de alta montaña con acceso desde La Parva hacia el colorido Cerro Pintor (4.180 msnm). Admira los tonos minerales ocres, verdes y rojizos con vista monumental al Glaciar Iver y la pared sur del Cerro El Plomo. Transporte 4x4 privado, raciones de marcha energéticas, bastones y seguridad satelital.',
  'Alta',
  'Full Day (8 - 9 hrs)',
  1,
  '4.180 m',
  380000,
  'US$395',
  4,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{
    "sector": "Centro de Ski La Parva / Cordón de los Piches",
    "acceso": "Camino a Farellones / Curva 40",
    "pickup": "Recogida privada 06:30 AM en tu hospedaje",
    "coordenadas": "-33.3150, -70.2520"
  }'::jsonb,
  '[
    {"titulo": "Vistas Monumentales a El Plomo", "descripcion": "Perspectiva privilegiada de la montaña sagrada de los Incas."},
    {"titulo": "Tonalidades Minerales Andinas", "descripcion": "Cerro bautizado por sus arenas volcánicas multicolor."},
    {"titulo": "Monitoreo de Oximetría", "descripcion": "Seguridad activa en aclimatación y control de saturación de oxígeno."}
  ]'::jsonb,
  '[
    {"hora": "06:30", "titulo": "Recogida Privada en Santiago", "descripcion": "Traslado 4x4 por la ruta escénica de curvas hacia Farellones y La Parva."},
    {"hora": "08:15", "titulo": "Comienzo en Laguna Piuquenes", "descripcion": "Inicio de caminata a 3.500 msnm con ritmo adaptado y bastones."},
    {"hora": "10:30", "titulo": "Paso por Cerro Falsa Parva y La Parva", "descripcion": "Ganancia de altura progresiva por el filo con vistas al valle de Santiago."},
    {"hora": "13:00", "titulo": "Cumbre Cerro Pintor (4.180m)", "descripcion": "Almuerzo de altura, hidratación y tiempo de cumbre frente a los glaciares andinos."},
    {"hora": "16:30", "titulo": "Retorno a Vehículo y Santiago", "descripcion": "Descenso seguro y traslado a tu lugar de alojamiento."}
  ]'::jsonb,
  '["Botas de montaña con soporte de tobillo", "Tercera capa impermeable/cortaviento", "Gorro de abrigo y guantes", "Lentes de sol categoría 3 o 4", "Bloqueador solar FPS 50+"]'::jsonb,
  true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  description = EXCLUDED.description;


-- 2. HIGH MOUNTAIN (Precios Igualados a Puma Adventures)
-- ------------------------------------------------------------------------------

-- 2.1 Cerro Leonera 4.954m (2-3 Días)
-- Puma Adventures: US$1.200 -> Gaz-Style: US$1.200 ($1.160.000 CLP)
INSERT INTO public.adventures_catalog (
  title,
  category,
  vertical_type,
  custom_discipline,
  badge,
  tagline,
  description,
  difficulty_level,
  duration_text,
  duration_days,
  max_altitude,
  base_price,
  price_usd,
  max_pax,
  image_url,
  logistics,
  highlights,
  itinerary_steps,
  required_equipment,
  is_active
) VALUES (
  'Expedición Cerro Leonera 4.954m · Cancha de Carreras',
  'high_mountain',
  'expeditions',
  'Alta Montaña 2-3 Días',
  'HIGH MOUNTAIN · 4.954M',
  'Campamento de altura a 4.100 metros bajo el cielo más limpio de Chile central.',
  'La gran escuela andina para quienes sueñan con superar los 5.000 y 6.000 metros. Vivencia con campamento en el altiplano de Cancha de Carreras (4.100 m) con vistas directas a la pared sur del Cerro El Plomo. Incluye logística completa de campamento base 4 estaciones, raciones de alta montaña, guías certificados WFR y monitoreo médico de altura.',
  'Alta',
  '2 Días / 1 Noche',
  2,
  '4.954 m',
  1160000,
  'US$1.200',
  6,
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
  '{
    "sector": "La Parva / Cancha de Carreras",
    "campamento": "Cancha de Carreras (4.100m)",
    "coordenadas": "-33.2710, -70.2310"
  }'::jsonb,
  '[
    {"titulo": "Campamento Cancha de Carreras", "descripcion": "Una de las planicies de campamento más altas y escénicas de Sudamérica."},
    {"titulo": "Atardecer & Cielo Estrellado", "descripcion": "Astrofotografía de nivel mundial sobre la cordillera central."},
    {"titulo": "Cumbre de Casi 5.000 Metros", "descripcion": "El trampolín definitivo para preparar expediciones a los grandes seismiles."}
  ]'::jsonb,
  '[
    {"hora": "Día 1", "titulo": "La Parva a Cancha de Carreras (4.100m)", "descripcion": "Traslado desde Santiago, ascenso bordeando Laguna Piuquenes y filos hasta la planicie de Cancha de Carreras. Montaje de carpas y cena caliente."},
    {"hora": "Día 2", "titulo": "Cumbre Leonera (4.954m) & Descenso", "descripcion": "Ataque a cumbre a las 05:00 AM. Acarreo final sostenido y cumbre con vista 360° al Plomo, Marmolejo y Tupungato. Descenso completo a La Parva y regreso a Santiago."}
  ]'::jsonb,
  '["Botas de montaña", "Saco de dormir confort -5°C / -10°C", "Carpa 4 estaciones", "Vestimenta por capas (primera capa térmica, polar, cortaviento, pluma)", "Linterna frontal con pilas de repuesto"]'::jsonb,
  true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  description = EXCLUDED.description;

-- 2.2 Cerro El Plomo 5.424m (3-4 Días)
-- Puma Adventures: US$1.500 -> Gaz-Style: US$1.500 ($1.460.000 CLP)
INSERT INTO public.adventures_catalog (
  title,
  category,
  vertical_type,
  custom_discipline,
  badge,
  tagline,
  description,
  difficulty_level,
  duration_text,
  duration_days,
  max_altitude,
  base_price,
  price_usd,
  max_pax,
  image_url,
  logistics,
  highlights,
  itinerary_steps,
  required_equipment,
  is_active
) VALUES (
  'Expedición Cerro El Plomo 5.424m · Apu Sagrado',
  'high_mountain',
  'expeditions',
  'Expedición de Alta Montaña',
  'HIGH MOUNTAIN · 5.424M',
  'La peregrinación ancestral al santuario de altura inca más importante de Chile central.',
  'Expedición de 3 a 4 días al guardián espiritual del Valle del Mapocho. Cruza el Valle de Piedra Numerada, establece campamento base en Federación (4.150m), supera el histórico Glaciar Iver con crampones y alcanza el adoratorio donde fue ofrendado el Niño del Plomo en el siglo XV. Incluye arrieros con mulas para carga pesada, carpas 4 estaciones, oxígeno medicinal y guías WFR.',
  'Muy Alta',
  '3 Días / 2 Noches',
  3,
  '5.424 m',
  1460000,
  'US$1.500',
  8,
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
  '{
    "sector": "La Parva / Valle del Cepo / Glaciar Iver",
    "campamentos": "Piedra Numerada (3.400m) o Federación (4.150m)",
    "logistica_mulas": "Mulas arrieras incluidas para transporte de petates y carpas",
    "coordenadas": "-33.2325, -70.2186"
  }'::jsonb,
  '[
    {"titulo": "Santuario Ceremonial Inca", "descripcion": "Visita el altar ceremonial a más de 5.400 metros donde se descubrió el Niño del Plomo en 1954."},
    {"titulo": "Cruce Técnico de Glaciar Iver", "descripcion": "Progresión con crampones y piolet sobre hielo milenario."},
    {"titulo": "Mulas de Carga Incluidas", "descripcion": "Sube liviano el primer día: las mulas trasladan el equipo pesado de campamento."},
    {"titulo": "Seguridad Médica & Oximetría", "descripcion": "Monitoreo constante de saturación y botiquín de gran altitud."}
  ]'::jsonb,
  '[
    {"hora": "Día 1", "titulo": "La Parva a Campamento Federación (4.150m)", "descripcion": "Encuentro temprano en Santiago, traslado 4x4 a La Parva. Carga de mulas y marcha escénica pasando por Piedra Numerada hasta montar Campamento Base en Federación."},
    {"hora": "Día 2", "titulo": "Ataque a Cumbre (5.424m) & Glaciar Iver", "descripcion": "Despertar a las 02:30 AM. Ascenso nocturno por Refugio Agostini, cruce del Glaciar Iver con crampones y llegada al Santuario Inca y Cumbre al amanecer. Retorno a Federación."},
    {"hora": "Día 3", "titulo": "Descenso a Valle & Regreso a Santiago", "descripcion": "Desarmado de campamento, entrega de carga a arrieros, marcha de descenso a La Parva y traslado a Santiago para celebración de cumbre."}
  ]'::jsonb,
  '["Botas rígidas o semirrígidas de alta montaña", "Crampones ajustados y piolet de marcha", "Saco de dormir confort -10°C / -15°C", "Parka de pluma de alta montaña", "Colchoneta aislante inflable (R-Value > 4.0)", "Mochila de ataque 35-45L"]'::jsonb,
  true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  description = EXCLUDED.description;

-- 2.3 Volcán San José 5.856m (4 Días)
-- Puma Adventures: US$1.600 -> Gaz-Style: US$1.600 ($1.550.000 CLP)
INSERT INTO public.adventures_catalog (
  title,
  category,
  vertical_type,
  custom_discipline,
  badge,
  tagline,
  description,
  difficulty_level,
  duration_text,
  duration_days,
  max_altitude,
  base_price,
  price_usd,
  max_pax,
  image_url,
  logistics,
  highlights,
  itinerary_steps,
  required_equipment,
  is_active
) VALUES (
  'Expedición Volcán San José 5.856m · Cráter Activo',
  'high_mountain',
  'expeditions',
  'Alta Montaña Extrema',
  'HIGH MOUNTAIN · 5.856M',
  'Asciende al coloso volcánico fronterizo en el corazón salvaje del Cajón del Maipo.',
  'Expedición mayor de 4 días y 3 noches hacia el cráter activo del Volcán San José (5.856 msnm). Desde el Valle de las Arenas hasta los refugios y campamentos de altura (Refugio Plantat 3.130m y Las Lajas 4.100m). Ataque nocturno con vistas a fumarolas volcánicas y un amanecer inigualable sobre la frontera andina chileno-argentina.',
  'Muy Alta',
  '4 Días / 3 Noches',
  4,
  '5.856 m',
  1550000,
  'US$1.600',
  6,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  '{
    "sector": "Cajón del Maipo / Cabrerío / Baños Morales",
    "campamentos": "Refugio Plantat (3.130m) y Campo 1 Las Lajas (4.100m)",
    "coordenadas": "-33.7850, -69.8930"
  }'::jsonb,
  '[
    {"titulo": "Cráter Activo con Fumarolas", "descripcion": "Experiencia volcánica sobrecogedora a casi 6.000 metros de altitud."},
    {"titulo": "Aclimatación Escalonada", "descripcion": "Estrategia de dos campos de altura para maximizar la tasa de cumbre."},
    {"titulo": "Logística Integral en Cajón del Maipo", "descripcion": "Transporte 4x4, arrieros y soporte de seguridad WFR."}
  ]'::jsonb,
  '[
    {"hora": "Día 1", "titulo": "Santiago a Campamento Base Plantat (3.130m)", "descripcion": "Traslado al Cabrerío en Cajón del Maipo. Marcha hacia el histórico refugio de piedra Plantat y primera noche de campamento."},
    {"hora": "Día 2", "titulo": "Porteo y Ascenso a Campo 1 Las Lajas (4.100m)", "descripcion": "Jornada de ganancia de altura y aclimatación. Instalación del campo de altura en Las Lajas."},
    {"hora": "Día 3", "titulo": "Jornada de Cumbre Cráter San José (5.856m)", "descripcion": "Salida a las 02:00 AM. Ascenso por pendientes de nieve y rocas volcánicas hasta el cráter activo. Retorno a Campo 1 o Plantat."},
    {"hora": "Día 4", "titulo": "Descenso a Cabrerío y Retorno", "descripcion": "Bajada al valle, celebración tradicional en San José de Maipo y traslado a Santiago."}
  ]'::jsonb,
  '["Botas rígidas de alta montaña", "Crampones y piolet", "Saco de dormir confort -15°C", "Carpa 4 estaciones resistente al viento", "Pluma gruesa 800+ fill power", "Balaclava y mitones térmicos"]'::jsonb,
  true
)
ON CONFLICT (title) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  price_usd = EXCLUDED.price_usd,
  description = EXCLUDED.description;

NOTIFY pgrst, 'reload schema';
