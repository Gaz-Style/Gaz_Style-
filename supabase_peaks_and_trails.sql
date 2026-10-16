-- =======================================================================================
-- MIGRACIÓN: SANTIAGO HIKING PEAKS & TRAILS EXPLORER
-- Infraestructura de Cumbres, Accesos y Variantes de la Cordillera de Santiago
-- =======================================================================================

-- 1. Tabla de Cumbres (Peaks)
CREATE TABLE IF NOT EXISTS public.peaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    altitude_msnm INTEGER NOT NULL,
    prominence_m INTEGER,
    massif TEXT NOT NULL,
    comunas TEXT[] NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    summary TEXT NOT NULL,
    panoramic_summary TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    is_popular_sunset BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Puntos de Acceso / Entradas (Trailheads)
CREATE TABLE IF NOT EXISTS public.trailheads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    peak_id UUID NOT NULL REFERENCES public.peaks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    address_description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    google_maps_link TEXT,
    parking_type TEXT NOT NULL CHECK (parking_type IN ('calle_publica', 'estacionamiento_privado_pago', 'sin_estacionamiento', 'parque_oficial')),
    parking_fee_clp INTEGER DEFAULT 0,
    parking_security_tip TEXT,
    public_transit_info TEXT,
    operating_hours TEXT DEFAULT 'Acceso libre 24/7',
    entry_fee_required BOOLEAN DEFAULT false,
    entry_fee_clp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(peak_id, slug)
);

-- 3. Tabla de Rutas y Variantes (Routes)
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    peak_id UUID NOT NULL REFERENCES public.peaks(id) ON DELETE CASCADE,
    trailhead_id UUID NOT NULL REFERENCES public.trailheads(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    slug TEXT NOT NULL,
    distance_km NUMERIC(5, 2) NOT NULL,
    elevation_gain_m INTEGER NOT NULL,
    avg_duration_up_hours NUMERIC(4, 2) NOT NULL,
    avg_duration_down_hours NUMERIC(4, 2) NOT NULL,
    technical_difficulty TEXT NOT NULL CHECK (technical_difficulty IN ('facil_familiar', 'moderada', 'exigente', 'alta_montana')),
    physical_exertion TEXT NOT NULL CHECK (physical_exertion IN ('1/5', '2/5', '3/5', '4/5', '5/5')),
    trail_surface TEXT NOT NULL,
    water_available BOOLEAN DEFAULT false,
    shade_percentage TEXT DEFAULT 'Baja (10-20%)',
    family_friendly BOOLEAN DEFAULT false,
    pet_friendly BOOLEAN DEFAULT true,
    best_time_of_day TEXT DEFAULT 'Atardecer (Sunset)',
    description TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    required_equipment TEXT[] DEFAULT '{}',
    geojson_track JSONB,
    is_guided_by_santiago_hiking BOOLEAN DEFAULT true,
    commercial_price_clp INTEGER DEFAULT 25000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(peak_id, slug)
);

-- 4. Tabla de Leads por Descarga de GPX o Consultas (mountain_leads)
CREATE TABLE IF NOT EXISTS public.mountain_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    peak_id UUID REFERENCES public.peaks(id) ON DELETE SET NULL,
    route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
    full_name TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT,
    lead_source TEXT DEFAULT 'web_gpx_download',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas ultrarrápidas
CREATE INDEX IF NOT EXISTS idx_peaks_slug ON public.peaks(slug);
CREATE INDEX IF NOT EXISTS idx_trailheads_peak_id ON public.trailheads(peak_id);
CREATE INDEX IF NOT EXISTS idx_routes_peak_id ON public.routes(peak_id);
CREATE INDEX IF NOT EXISTS idx_routes_trailhead_id ON public.routes(trailhead_id);
CREATE INDEX IF NOT EXISTS idx_routes_slug ON public.routes(slug);

-- RLS (Políticas públicas permisivas para lectura)
ALTER TABLE public.peaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trailheads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mountain_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de cumbres" ON public.peaks;
CREATE POLICY "Lectura pública de cumbres" ON public.peaks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de accesos" ON public.trailheads;
CREATE POLICY "Lectura pública de accesos" ON public.trailheads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública de variantes" ON public.routes;
CREATE POLICY "Lectura pública de variantes" ON public.routes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserción anónima de leads de montaña" ON public.mountain_leads;
CREATE POLICY "Inserción anónima de leads de montaña" ON public.mountain_leads FOR INSERT WITH CHECK (true);
