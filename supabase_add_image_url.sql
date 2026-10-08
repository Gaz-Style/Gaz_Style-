-- Agregar columna image_url a adventures_catalog
ALTER TABLE public.adventures_catalog
    ADD COLUMN IF NOT EXISTS image_url TEXT;
