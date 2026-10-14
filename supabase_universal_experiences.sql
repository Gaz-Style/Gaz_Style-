-- ==============================================================================
-- MIGRACIÓN SUPABASE: DISEÑADOR UNIVERSAL DE EXPERIENCIAS SANTIAGO HIKING
-- Soporte para: Trekking, Deportes de Acción, Alojamientos, Gastronomía y All-Inclusive
-- ==============================================================================

ALTER TABLE public.adventures_catalog 
  ADD COLUMN IF NOT EXISTS vertical_type VARCHAR(50) DEFAULT 'trekking', -- 'trekking', 'action_sports', 'accommodation', 'gastronomy', 'all_inclusive'
  ADD COLUMN IF NOT EXISTS custom_discipline VARCHAR(100),                -- 'Canyoning', 'Parapente', 'Cabalgata', etc.
  ADD COLUMN IF NOT EXISTS badge VARCHAR(100),
  ADD COLUMN IF NOT EXISTS number_code VARCHAR(10),                      -- '01', '02', etc.
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS story_paragraphs JSONB DEFAULT '[]'::jsonb,   -- [p1, p2, p3]
  ADD COLUMN IF NOT EXISTS logistics JSONB DEFAULT '{}'::jsonb,          -- { sector, acceso, puntoEncuentro, coordenadas, lat, lng }
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,         -- [{ titulo, descripcion, imagen }]
  ADD COLUMN IF NOT EXISTS gallery_items JSONB DEFAULT '[]'::jsonb,      -- [{ url, caption }]
  ADD COLUMN IF NOT EXISTS itinerary_steps JSONB DEFAULT '[]'::jsonb,    -- [{ hora, titulo, descripcion }]
  ADD COLUMN IF NOT EXISTS required_equipment JSONB DEFAULT '[]'::jsonb, -- ['Calzado...', 'Cortaviento...']
  ADD COLUMN IF NOT EXISTS specific_requirements JSONB DEFAULT '[]'::jsonb, -- [{ label: 'Peso máx', value: '100kg' }]
  ADD COLUMN IF NOT EXISTS accommodation_amenities JSONB DEFAULT '[]'::jsonb, -- ['Tinaja caliente', 'Starlink', 'Calefacción a leña']
  ADD COLUMN IF NOT EXISTS gastronomy_menu JSONB DEFAULT '{}'::jsonb,   -- { service_type, courses: [], dietary_options: [] }
  ADD COLUMN IF NOT EXISTS strava_url TEXT,
  ADD COLUMN IF NOT EXISTS gpx_track_url TEXT,
  ADD COLUMN IF NOT EXISTS elevation_profile JSONB DEFAULT '[]'::jsonb,  -- [{ km, alt }]
  ADD COLUMN IF NOT EXISTS price_usd VARCHAR(20),
  ADD COLUMN IF NOT EXISTS guide_credentials JSONB DEFAULT '{}'::jsonb;  -- { name, role, wfr_cert, inreach_active }

-- Refrescar la caché de PostgREST
NOTIFY pgrst, 'reload schema';
