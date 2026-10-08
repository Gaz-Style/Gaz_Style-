-- Paso 1: Agregar las columnas a la tabla
ALTER TABLE public.adventures_catalog
ADD COLUMN IF NOT EXISTS elevation_gain TEXT,
ADD COLUMN IF NOT EXISTS max_altitude TEXT,
ADD COLUMN IF NOT EXISTS distance TEXT,
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS included JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS not_included JSONB DEFAULT '[]'::jsonb;

-- Paso 2: Refrescar la caché de la API para que Next.js pueda leer las columnas nuevas
NOTIFY pgrst, 'reload schema';
