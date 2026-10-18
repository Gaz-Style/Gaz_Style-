-- ==============================================================================
-- MIGRACIÓN: AGREGAR COLUMNAS DE DESCUENTO Y OFERTA A ADVENTURES_CATALOG
-- ==============================================================================

-- 1. Agregar columnas a adventures_catalog si no existen
ALTER TABLE public.adventures_catalog
ADD COLUMN IF NOT EXISTS is_discount_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS discount_price NUMERIC,
ADD COLUMN IF NOT EXISTS discount_badge TEXT DEFAULT 'ÚLTIMOS CUPOS OFF';

-- 2. Recargar schema cache de PostgREST para Supabase
NOTIFY pgrst, 'reload schema';
