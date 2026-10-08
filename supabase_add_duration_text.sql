ALTER TABLE public.adventures_catalog ADD COLUMN IF NOT EXISTS duration_text TEXT;
NOTIFY pgrst, 'reload schema';
