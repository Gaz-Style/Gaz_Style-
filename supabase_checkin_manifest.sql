-- Añadimos campos médicos y de emergencia al perfil del aventurero
ALTER TABLE public.crm_adventurers ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.crm_adventurers ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.crm_adventurers ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE public.crm_adventurers ADD COLUMN IF NOT EXISTS blood_type TEXT;

-- Añadimos el estado del "Waiver" (Check-in) a la reserva
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS waiver_signed BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS waiver_signed_at TIMESTAMP WITH TIME ZONE;

-- Recargamos caché de postgREST
NOTIFY pgrst, 'reload schema';
