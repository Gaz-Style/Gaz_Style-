-- =======================================================================================
-- SANTIAGO HIKING · ATLAS ANDINO ENTERPRISE
-- REINICIO LIMPIO: Asegura que todas las tablas del Atlas Andino se creen con el 100%
-- de sus columnas modernas, tipos e índices sin conflictos de esquemas previos.
-- (No toca adventures_catalog, ni bookings, ni usuarios).
-- =======================================================================================
DROP TABLE IF EXISTS public.trail_reviews CASCADE;
DROP TABLE IF EXISTS public.expedition_dates CASCADE;
DROP TABLE IF EXISTS public.mountain_leads CASCADE;
DROP TABLE IF EXISTS public.trail_commercial_binding CASCADE;
DROP TABLE IF EXISTS public.trail_waypoints CASCADE;
DROP TABLE IF EXISTS public.trail_peaks CASCADE;
DROP TABLE IF EXISTS public.trails CASCADE;
DROP TABLE IF EXISTS public.trailheads CASCADE;
DROP TABLE IF EXISTS public.peaks CASCADE;

-- 1. TABLA DE CUMBRES FÍSICAS (PEAKS)
CREATE TABLE IF NOT EXISTS public.peaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    altitude_msnm INTEGER NOT NULL,
    prominence_m INTEGER,
    massif TEXT NOT NULL,                     -- ej: 'Cordón Manquehue', 'Sierra de Ramón'
    comunas TEXT[] NOT NULL,
    basin TEXT NOT NULL DEFAULT 'Cuenca del Mapocho', -- 'Cuenca del Mapocho', 'Valle del Maipo', 'Cordillera Central'
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    -- I18N NATIVO (5 IDIOMAS: es, en, pt, fr, de)
    summary TEXT NOT NULL,                    -- Texto base (fallback rápido)
    summary_i18n JSONB DEFAULT '{}',          -- {"es": "...", "en": "...", "pt": "...", "fr": "...", "de": "..."}
    panoramic_summary TEXT NOT NULL,
    panoramic_summary_i18n JSONB DEFAULT '{}',
    history_and_cosmovision TEXT,
    history_and_cosmovision_i18n JSONB DEFAULT '{}',

    -- SEO & GEO METADATA ESTRATÉGICA (5 IDIOMAS)
    meta_title_i18n JSONB DEFAULT '{}',       -- {"es": "Cerro Manquehue (1.638m) · Ruta & GPX", "en": "Cerro Manquehue Hike · Guide"}
    meta_description_i18n JSONB DEFAULT '{}', -- Resumen exacto de 155 caracteres optimizado por idioma
    search_keywords TEXT[] DEFAULT '{}',      -- ['manquehue', 'cerro manquehue', 'manquehue hike', 'trekking vitacura']

    cover_image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    is_popular_sunset BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE PUNTOS DE ACCESO / ENTRADAS (TRAILHEADS - ESTÁNDAR Santiago Hiking)
CREATE TABLE IF NOT EXISTS public.trailheads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    comuna TEXT NOT NULL,
    address_description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    google_maps_link TEXT,
    waze_deep_link TEXT,                      -- Link directo para abrir Waze nativo en el celular
    uber_dropoff_tip TEXT,                    -- Instrucción para turistas: 'Pedir Uber a Puente Centenario con Vespucio'
    uber_dropoff_tip_i18n JSONB DEFAULT '{}',
    parking_type TEXT NOT NULL CHECK (parking_type IN ('calle_publica', 'estacionamiento_privado_pago', 'sin_estacionamiento', 'parque_oficial')),
    parking_fee_clp INTEGER DEFAULT 0,
    parking_security_tip TEXT,                -- 'Cámaras municipales, cuidadores habituales en horario diurno'
    parking_security_tip_i18n JSONB DEFAULT '{}',
    public_transit_info TEXT,                 -- 'Micros C02 y C14 desde Metro Escuela Militar'
    public_transit_info_i18n JSONB DEFAULT '{}',
    operating_hours TEXT DEFAULT 'Acceso libre 24/7',
    operating_hours_i18n JSONB DEFAULT '{}',
    entry_fee_required BOOLEAN DEFAULT false,
    entry_fee_clp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE TRAZADOS, VARIANTES TÉCNICAS Y TRAVESÍAS (TRAILS)
CREATE TABLE IF NOT EXISTS public.trails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    trail_type TEXT NOT NULL CHECK (trail_type IN ('cumbre_directa', 'variante_tecnica', 'travesia_cordon', 'circuito_cerrado')),
    trailhead_start_id UUID REFERENCES public.trailheads(id) ON DELETE RESTRICT,
    trailhead_end_id UUID REFERENCES public.trailheads(id) ON DELETE RESTRICT,
    distance_km NUMERIC(5, 2) NOT NULL,
    elevation_gain_m INTEGER NOT NULL,
    elevation_loss_m INTEGER DEFAULT 0,
    max_altitude_m INTEGER NOT NULL,
    avg_duration_up_hours NUMERIC(4, 2) NOT NULL,
    avg_duration_down_hours NUMERIC(4, 2) NOT NULL,
    technical_difficulty TEXT NOT NULL CHECK (technical_difficulty IN ('facil_iniciacion', 'moderada_trekker', 'exigente_montana', 'alta_montana_tecnica')),
    physical_exertion TEXT NOT NULL CHECK (physical_exertion IN ('1/5', '2/5', '3/5', '4/5', '5/5')),
    trail_surface TEXT NOT NULL,              -- 'Acarreo, roca firme, sendero de tierra'
    water_available BOOLEAN DEFAULT false,
    water_detail TEXT,                        -- 'Sin fuentes de agua en toda la ruta. Carga mínima obligatoria: 2L'
    shade_percentage TEXT DEFAULT 'Baja (10-20%)',
    family_friendly BOOLEAN DEFAULT false,
    pet_friendly BOOLEAN DEFAULT false,
    best_time_of_day TEXT DEFAULT 'Amanecer / Mañana temprano',
    -- I18N NATIVO (5 IDIOMAS: es, en, pt, fr, de)
    description TEXT NOT NULL,
    description_i18n JSONB DEFAULT '{}',
    crux_highlights TEXT[] DEFAULT '{}',
    crux_highlights_i18n JSONB DEFAULT '{}',  -- {"es": [...], "en": [...], "pt": [...], "fr": [...], "de": [...]}
    required_equipment TEXT[] DEFAULT '{}',
    escape_routes_info TEXT,                  -- Alternativas de escape y descenso seguro
    escape_routes_info_i18n JSONB DEFAULT '{}',
    return_notes_i18n JSONB DEFAULT '{}',
    
    -- TOPOLOGÍA TÉCNICA DE RUTA (Out-and-Back vs Travesía)
    route_topology TEXT NOT NULL DEFAULT 'ida_y_vuelta' 
        CHECK (route_topology IN ('ida_y_vuelta', 'travesia_punto_a_punto', 'circuito_bucle')),
    direction_sense TEXT NOT NULL DEFAULT 'ascenso_descenso_mismo_punto'
        CHECK (direction_sense IN ('norte_a_sur', 'sur_a_norte', 'este_a_oeste', 'oeste_a_este', 'ascenso_descenso_mismo_punto')),
    ascent_distance_km NUMERIC(5, 2),         -- Distancia sólo ascenso (ej: 2.6 km en Carbón)
    return_notes TEXT,                        -- 'Descenso por la misma vía hacia Portón La Pirámide'
    rescue_jurisdiction TEXT DEFAULT 'Cuerpo de Socorro Andino 136 · GOPE Carabineros',
    strava_segment_url TEXT,

    -- METADATA PARA VISOR CARTOGRÁFICO 3D
    camera_3d_pitch NUMERIC(4, 1) DEFAULT 60.0,
    camera_3d_bearing NUMERIC(4, 1) DEFAULT 45.0,
    elevation_profile JSONB DEFAULT '[]',     -- Array [{km, alt, label}]
    geojson_track JSONB,                      -- Coordenadas 3D del track
    glow_color TEXT DEFAULT '#f59e0b',        -- Color del trazo en mapa 3D
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA INTERMEDIA PARA TRAVESÍAS MULTICUMBRE (TRAIL_PEAKS)
-- Permite encadenar cumbres en orden estricto (ej: Sierra de Ramón)
CREATE TABLE IF NOT EXISTS public.trail_peaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
    peak_id UUID NOT NULL REFERENCES public.peaks(id) ON DELETE RESTRICT,
    summit_order INTEGER NOT NULL,            -- 1: Provincia, 2: Tambor, 3: San Ramón, etc.
    is_main_summit BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trail_id, peak_id)
);

-- 5. TABLA DE HITOS 3D, FOTOGRAFÍAS REALES Y CRUX SUPREMO (TRAIL_WAYPOINTS)
CREATE TABLE IF NOT EXISTS public.trail_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                       -- ej: 'El Filo de la Muerte', 'Refugio Domo'
    order_index INTEGER NOT NULL,
    altitude_m INTEGER NOT NULL,
    km_milestone NUMERIC(5, 2) NOT NULL,
    waypoint_type TEXT NOT NULL CHECK (waypoint_type IN ('cumbre', 'crux_tecnico', 'refugio_vivac', 'fuente_agua', 'mirador_clave', 'punto_escape')),
    danger_level TEXT NOT NULL CHECK (danger_level IN ('baja', 'moderada', 'alta', 'extrema')),
    exposure_rating TEXT,                     -- 'E4: Caída potencialmente mortal a ambos flancos'
    is_main_attraction BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    technical_notes TEXT,
    photo_url TEXT,                           -- Fotografía real de alta resolución
    photo_caption TEXT,
    video_url TEXT,                           -- Metraje en video en terreno
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PUENTE ENTERPRISE CON EL CATÁLOGO COMERCIAL EXISTENTE (SIN MODIFICARLO)
CREATE TABLE IF NOT EXISTS public.trail_commercial_binding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
    adventure_id UUID NOT NULL REFERENCES public.adventures_catalog(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trail_id, adventure_id)
);

-- 7. TABLA DE LEADS POR DESCARGA GPX O CONTACTO (MOUNTAIN_LEADS)
CREATE TABLE IF NOT EXISTS public.mountain_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID REFERENCES public.trails(id) ON DELETE SET NULL,
    full_name TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT,
    country_code TEXT DEFAULT '+56',          -- '+56' (Chile), '+1' (USA), '+55' (Brasil), '+44' (UK), etc.
    preferred_language TEXT DEFAULT 'es',     -- 'es', 'en', 'pt', 'fr', 'de' para automatización WhatsApp
    client_intent TEXT DEFAULT 'solo_gpx' CHECK (client_intent IN ('solo_gpx', 'interes_guiado', 'boutique_privado', 'networking', 'desafio_extremo')),
    lead_source TEXT DEFAULT 'web_gpx_download',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 8. TABLA DE EXPEDICIONES PROGRAMADAS (MODELO MUCH BETTER ADVENTURES)
-- Fechas concretas con cupos en vivo para cada sendero/cumbre
CREATE TABLE IF NOT EXISTS public.expedition_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    departure_time TEXT NOT NULL,             -- ej: '17:30 hrs' o '08:30 hrs'
    title_theme TEXT NOT NULL,                -- ej: 'Sunset & Atardecer Dorado', 'Ascenso Clásico & Técnica de Bastones'
    total_slots INTEGER NOT NULL DEFAULT 8,   -- Grupos reducidos estándar MBA
    available_slots INTEGER NOT NULL DEFAULT 8,
    price_clp INTEGER NOT NULL DEFAULT 35000,
    price_usd INTEGER NOT NULL DEFAULT 37,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'last_slots', 'sold_out', 'completed')),
    guide_name TEXT DEFAULT 'Guía Certificado WFR',
    includes_technical_poles BOOLEAN DEFAULT true,
    includes_satellite_sos BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 9. TABLA DE RESEÑAS Y TESTIMONIOS TÉCNICOS VERIFICADOS (SOCIAL PROOF ENTERPRISE)
CREATE TABLE IF NOT EXISTS public.trail_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_country TEXT NOT NULL DEFAULT 'Chile', -- 'Chile', 'United States', 'Brazil', 'Germany', etc.
    author_country_flag TEXT DEFAULT '🇨🇱',       -- Emoji de bandera para UI limpia
    rating_stars INTEGER NOT NULL CHECK (rating_stars BETWEEN 1 AND 5),
    review_date DATE DEFAULT CURRENT_DATE,
    comment_text TEXT NOT NULL,
    comment_i18n JSONB DEFAULT '{}',
    is_verified_hiker BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- ÍNDICES DE RENDIMIENTO ENTERPRISE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_peaks_slug ON public.peaks(slug);
CREATE INDEX IF NOT EXISTS idx_trailheads_slug ON public.trailheads(slug);
CREATE INDEX IF NOT EXISTS idx_trails_slug ON public.trails(slug);
CREATE INDEX IF NOT EXISTS idx_trails_start_th ON public.trails(trailhead_start_id);
CREATE INDEX IF NOT EXISTS idx_trails_end_th ON public.trails(trailhead_end_id);
CREATE INDEX IF NOT EXISTS idx_trail_peaks_trail ON public.trail_peaks(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_peaks_peak ON public.trail_peaks(peak_id);
CREATE INDEX IF NOT EXISTS idx_trail_waypoints_trail ON public.trail_waypoints(trail_id);
CREATE INDEX IF NOT EXISTS idx_commercial_binding_trail ON public.trail_commercial_binding(trail_id);
CREATE INDEX IF NOT EXISTS idx_commercial_binding_adv ON public.trail_commercial_binding(adventure_id);
CREATE INDEX IF NOT EXISTS idx_expedition_dates_trail ON public.expedition_dates(trail_id);
CREATE INDEX IF NOT EXISTS idx_expedition_dates_date ON public.expedition_dates(departure_date);
CREATE INDEX IF NOT EXISTS idx_trail_reviews_trail ON public.trail_reviews(trail_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- ------------------------------------------------------------------------------
ALTER TABLE public.peaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trailheads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_peaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_commercial_binding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mountain_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expedition_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de peaks" ON public.peaks;
CREATE POLICY "Lectura pública de peaks" ON public.peaks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de trailheads" ON public.trailheads;
CREATE POLICY "Lectura pública de trailheads" ON public.trailheads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de trails" ON public.trails;
CREATE POLICY "Lectura pública de trails" ON public.trails FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de trail_peaks" ON public.trail_peaks;
CREATE POLICY "Lectura pública de trail_peaks" ON public.trail_peaks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de waypoints" ON public.trail_waypoints;
CREATE POLICY "Lectura pública de waypoints" ON public.trail_waypoints FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de bindings" ON public.trail_commercial_binding;
CREATE POLICY "Lectura pública de bindings" ON public.trail_commercial_binding FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserción anónima de mountain_leads" ON public.mountain_leads;
CREATE POLICY "Inserción anónima de mountain_leads" ON public.mountain_leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Lectura pública de expedition_dates" ON public.expedition_dates;
CREATE POLICY "Lectura pública de expedition_dates" ON public.expedition_dates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de reviews" ON public.trail_reviews;
CREATE POLICY "Lectura pública de reviews" ON public.trail_reviews FOR SELECT USING (true);



-- =======================================================================================
-- CARGA INICIAL DE DATOS REALES (SEED ENTERPRISE SANDBOX)
-- =======================================================================================

-- 1. CUMBRES FÍSICAS (PEAKS)
INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-carbon', 'Cerro Carbón', 1365, 120, 'Cordón Manquehue', ARRAY['Vitacura', 'Huechuraba'], 'Cuenca del Mapocho', -33.3752, -70.5985, 
    'El mirador natural por excelencia sobre el valle central de Santiago. Un ascenso de media intensidad con sendero técnico y flora esclerófila.',
    '{"es": "El mirador natural por excelencia sobre el valle central de Santiago. Un ascenso de media intensidad con sendero técnico y flora esclerófila.", "en": "The premier natural viewpoint overlooking the Santiago central valley. A moderate ascent featuring a technical ridge path and native sclerophyll woodland.", "pt": "O principal mirante natural sobre o vale central de Santiago. Uma subida de intensidade moderada com trilha técnica e vegetação esclerófila nativa.", "fr": "Le belvédère naturel par excellence sur la vallée centrale de Santiago. Une ascension d''intensité modérée avec un sentier d''arête technique et une forêt sclérophylle.", "de": "Der herausragende natürliche Aussichtspunkt über das Zentraltal von Santiago. Ein mäßiger Aufstieg mit technischem Gratweg und einheimischer Hartlaubvegetation."}'::jsonb,
    'Panorámica 360° hacia el valle de Santiago, río Mapocho, San Cristóbal y el cordón principal de los Andes.',
    '{"es": "Panorámica 360° hacia el valle de Santiago, río Mapocho, San Cristóbal y el cordón principal de los Andes.", "en": "360° panoramic view of the Santiago valley, Mapocho river, San Cristóbal and the main Andes range.", "pt": "Vista panorâmica de 360° do vale de Santiago, rio Mapocho, San Cristóbal e cordilheira principal dos Andes.", "fr": "Vue panoramique à 360° sur la vallée de Santiago, le fleuve Mapocho, San Cristóbal et la chaîne principale des Andes.", "de": "360°-Panoramablick auf das Santiago-Tal, den Mapocho-Fluss, San Cristóbal und die Hauptandenkette."}'::jsonb,
    'Su toponimia recuerda los antiguos hornos de carbón de espino que los leñadores operaban en la época colonial en sus quebradas.',
    '{"es": "Su toponimia recuerda los antiguos hornos de carbón de espino que los leñadores operaban en la época colonial en sus quebradas.", "en": "Its toponymy recalls the colonial-era charcoal kilns where woodcutters produced espino coal in its ravines.", "pt": "Sua toponímia lembra os antigos fornos coloniais de carvão de espinheiro operados por lenhadores em suas ravinas.", "fr": "Sa toponymie rappelle les anciens fours à charbon de bois d''épine exploités par les bûcherons à l''époque coloniale.", "de": "Sein Name erinnert an die kolonialen Holzkohlemeiler in seinen Schluchten, wo Espino-Holz verkohlt wurde."}'::jsonb,
    ARRAY['cerro carbon', 'carbon', 'parquemet norte', 'arista sur carbon', 'trekking vitacura', 'carbon hike'],
    '/images/wildtrek_sunset.png'
)
ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

-- 2. ACCESOS URBANOS / TRAILHEADS
INSERT INTO public.trailheads (slug, name, comuna, address_description, latitude, longitude, google_maps_link, parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp)
VALUES
('saint-george', 'Colegio Saint George / La Pirámide', 'Vitacura',
 'Av. Américo Vespucio Norte con Puente Centenario', -33.3770, -70.5920, 'https://maps.google.com/?q=-33.3770,-70.5920',
 'calle_publica', 0, 'Estacionamiento lateral con cámaras de seguridad y cuidadores habituales en horario diurno.',
 'Micro C02 y C14 desde Metro Escuela Militar (bajada a 200m del inicio de sendero).', 'Acceso libre 24/7', false, 0),

('bosque-santiago', 'Bosque Santiago / Parquemet Norte', 'Huechuraba',
 'Camino La Pirámide s/n, Huechuraba', -33.3720, -70.6020, 'https://maps.google.com/?q=-33.3720,-70.6020',
 'parque_oficial', 0, 'Estacionamiento custodiado dentro del Centro de Educación Ambiental Parquemet.',
 'Recorridos 117 y 712 desde Metro Vespucio Norte hasta cruce La Pirámide.', 'Martes a Domingo 08:30 a 18:00', false, 0),

('san-carlos-apoquindo', 'Parque San Carlos de Apoquindo / Morro Las Papas', 'Las Condes',
 'Av. Plaza 2500, frente a canchas CDUC', -33.3980, -70.4950, 'https://maps.google.com/?q=-33.3980,-70.4950',
 'parque_oficial', 3500, 'Estacionamiento vigilado Asociación Parque Cordillera con control de guardaparques y baños.',
 'Micro C02c y C09 desde Metro Los Dominicos hasta término en San Carlos.', 'Martes a Domingo 08:00 a 17:30', true, 3500),

('puente-nilhue', 'Puente Ñilhue (Lo Barnechea)', 'Lo Barnechea',
 'Camino a Farellones km 5, Curva 0', -33.3640, -70.4780, 'https://maps.google.com/?q=-33.3640,-70.4780',
 'parque_oficial', 0, 'Estacionamiento amplio con caseta de control de guardaparques Asociación Parque Cordillera.',
 'Colectivos y vans a Farellones desde Plaza San Enrique.', 'Martes a Domingo 08:00 a 17:30', true, 3500),

('el-panul', 'Parque Comunitario El Panul (La Florida)', 'La Florida',
 'Final de calle Rojas Magallanes s/n', -33.5480, -70.5280, 'https://maps.google.com/?q=-33.5480,-70.5280',
 'calle_publica', 0, 'Estacionamiento sobre calle residencial frente al portón de ingreso.',
 'Recorrido E07 y 322 desde Metro Bellavista de La Florida.', 'Acceso libre 24/7', false, 0),

('quebrada-de-macul', 'Parque Quebrada de Macul', 'Peñalolén',
 'Av. Las Torres s/n con Diagonal Las Torres', -33.4920, -70.5180, 'https://maps.google.com/?q=-33.4920,-70.5180',
 'parque_oficial', 0, 'Estacionamiento municipal interior vigilado.',
 'Micros 506, 511 y D09 hasta Universidad Adolfo Ibáñez.', 'Martes a Domingo 08:30 a 18:30', false, 0)
ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info;

-- 3. TRAZADOS & VARIANTES (TRAILS)
INSERT INTO public.trails (slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m, avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion, trail_surface, water_available, water_detail, shade_percentage, best_time_of_day, description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile)
VALUES
('carbon-arista-sur', 'Cerro Carbón por Arista Sur (Ruta Normal)', 'cumbre_directa', 3.8, 740, 740, 1365, 2.5, 1.5,
 'moderada_trekker', '2/5', 'Sendero de tierra compacta y acarreo firme con pendiente constante', false,
 'Sin fuentes de agua en toda la ruta. Carga mínima obligatoria: 2 litros.', 'Baja (10%)', 'Amanecer / Mañana',
 'La ruta clásica y más frecuentada. Asciende de forma directa por el filo sur ofreciendo vistas panorámicas permanentes sobre el río Mapocho y Sanhattan.',
 ARRAY['Mirador La Pirámide (820m)', 'Pirca de Piedra (1.050m)', 'El Litre Sombrío (1.220m)'],
 ARRAY['Calzado con agarre', '2L de agua', 'Cortaviento', 'Frontal', 'Protector UV'],
 'Descenso directo por el mismo sendero hacia Saint George.', '#f59e0b',
 '[{"km": 0.0, "alt": 640, "label": "Inicio Saint George"}, {"km": 1.1, "alt": 820, "label": "Mirador La Pirámide"}, {"km": 2.2, "alt": 1050, "label": "Pirca de Piedra"}, {"km": 3.1, "alt": 1220, "label": "El Litre Sombrío"}, {"km": 3.8, "alt": 1365, "label": "Cumbre Cerro Carbón"}]'::jsonb),

('carbon-cara-norte', 'Cerro Carbón por Bosque Santiago', 'variante_tecnica', 4.2, 780, 780, 1365, 2.8, 1.8,
 'moderada_trekker', '3/5', 'Sendero natural con bosque nativo en el tercio bajo y filo norte pedregoso', false,
 'Punto de recarga disponible únicamente en portería de Bosque Santiago.', 'Media (30%)', 'Otoño / Invierno',
 'Una perspectiva distinta inmersa en la vegetación nativa de Bosque Santiago antes de encarar el morro cumbrero por su vertiente norte.',
 ARRAY['Centro Ambiental', 'Quebrada de Quillayes', 'Collado Norte'],
 ARRAY['Calzado de trail running', '2L agua', 'Bastones', 'Cortaviento'],
 'Regreso a portería Bosque Santiago antes del cierre de rejas (18:00 hrs).', '#34d399',
 '[{"km": 0.0, "alt": 610, "label": "Portería Bosque Santiago"}, {"km": 1.2, "alt": 790, "label": "Bosque Esclerófilo"}, {"km": 2.5, "alt": 1040, "label": "Collado Norte"}, {"km": 3.5, "alt": 1240, "label": "Filo Norte"}, {"km": 4.2, "alt": 1365, "label": "Cumbre Cerro Carbón"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights;
-- 6. SEMILLAS DE EXPEDICIONES PROGRAMADAS (MUCH BETTER ADVENTURES)
DO $$
DECLARE
    v_trail_id UUID;
BEGIN
    SELECT id INTO v_trail_id FROM public.trails WHERE slug = 'carbon-arista-sur';

    IF v_trail_id IS NOT NULL THEN
        -- Actualizar datos topológicos de la ruta normal de Cerro Carbón
        UPDATE public.trails 
        SET 
            route_topology = 'ida_y_vuelta',
            ascent_distance_km = 2.6,
            return_notes = 'Descenso controlado por la misma vía hacia Portón La Pirámide (Total 5.2 km)'
        WHERE id = v_trail_id;

        -- Próximas salidas oficiales con cupos reales
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_trail_id, '2026-10-24', '17:30 hrs', 'Sunset & Atardecer Dorado', 8, 2, 35000, 37, 'last_slots'),
        (v_trail_id, '2026-10-25', '08:30 hrs', 'Ascenso Clásico & Técnica de Bastones', 8, 4, 35000, 37, 'open'),
        (v_trail_id, '2026-10-31', '17:30 hrs', 'Sunset & Luna Llena Cordillerana', 8, 6, 35000, 37, 'open')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 7. TESTIMONIOS VERIFICADOS PARA CERRO CARBÓN (SOCIAL PROOF INTERNACIONAL)
DO $$
DECLARE
    v_trail_id UUID;
BEGIN
    SELECT id INTO v_trail_id FROM public.trails WHERE slug = 'carbon-arista-sur';

    IF v_trail_id IS NOT NULL THEN
        -- Actualizar campos estratégicos en Cerro Carbón
        UPDATE public.trails 
        SET 
            strava_segment_url = 'https://www.strava.com/segments/1269934',
            rescue_jurisdiction = 'Cuerpo de Socorro Andino 136 · GOPE Carabineros Vitacura'
        WHERE id = v_trail_id;

        -- Testimonios internacionales
        INSERT INTO public.trail_reviews (trail_id, author_name, author_country, author_country_flag, rating_stars, review_date, comment_text, is_verified_hiker)
        VALUES
        (v_trail_id, 'Sarah Jenkins', 'United States', '🇺🇸', 5, '2026-10-10', 'Incredible sunset views over Santiago. The trail is technical and dusty on the ridge, definitely recommend good grip shoes and trekking poles. Santiago Hiking guide was top notch.', true),
        (v_trail_id, 'Rodrigo Silveira', 'Brazil', '🇧🇷', 5, '2026-10-12', 'Melhor vista de Santiago ao pôr do sol. Subida intensa mas muito bem sinalizada. A descida no maicillo exige atenção.', true),
        (v_trail_id, 'Matías Vial', 'Chile', '🇨🇱', 5, '2026-10-14', 'El cerro escuela por excelencia en Vitacura. Rápido, panorámico y perfecto para entrenar después de la oficina.', true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
