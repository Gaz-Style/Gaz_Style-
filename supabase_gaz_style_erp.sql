-- ==============================================================================
-- GAZ STYLE - NÚCLEO ERP & CRM
-- Migración Arquitectónica basada en el modelo de Elena Atelier
-- ==============================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CRM BASE: Aventureros (Clientes)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.adventurers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rut TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    marketing_opt_in BOOLEAN DEFAULT true,
    total_expeditions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.adventurers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON public.adventurers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin all" ON public.adventurers FOR ALL TO authenticated USING (true);


-- ==========================================
-- 2. PERFILES MÉDICOS Y TÉCNICOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.medical_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adventurer_id UUID REFERENCES public.adventurers(id) ON DELETE CASCADE,
    experience_level TEXT NOT NULL, -- principiante, intermedio, avanzado
    allergies TEXT,
    medical_conditions TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    blood_type TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.medical_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON public.medical_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin all" ON public.medical_profiles FOR ALL TO authenticated USING (true);


-- ==========================================
-- 3. AGENDA: Expediciones Planificadas
-- ==========================================
CREATE TABLE IF NOT EXISTS public.expeditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_type TEXT NOT NULL, -- sunset, fullday, vip
    title TEXT NOT NULL,
    trek_date DATE NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 10,
    current_bookings INTEGER DEFAULT 0,
    status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    guide_assigned TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expeditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.expeditions FOR SELECT USING (status = 'scheduled');
CREATE POLICY "Allow admin all" ON public.expeditions FOR ALL TO authenticated USING (true);


-- ==========================================
-- 4. PIPELINE: Reservas (Bookings)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adventurer_id UUID REFERENCES public.adventurers(id),
    expedition_id UUID REFERENCES public.expeditions(id),
    -- Desnormalización por si aún no hay expedición creada (Ej: reserva genérica por landing)
    route_requested TEXT, 
    requested_date DATE,
    
    status TEXT NOT NULL DEFAULT 'lead', -- lead, pending_payment, confirmed, cancelled, no_show, completed
    payment_status TEXT DEFAULT 'pending',
    amount_paid DECIMAL DEFAULT 0,
    webpay_token TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin all" ON public.bookings FOR ALL TO authenticated USING (true);


-- ==========================================
-- 5. AUDITORÍA: Logs de Estado (Para Orquestador)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.booking_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.booking_status_logs DISABLE ROW LEVEL SECURITY; -- Acceso interno del Servidor


-- ==========================================
-- 6. INVENTARIO: Equipamiento (Gear)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gear_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- poles, helmets, first_aid
    name TEXT NOT NULL,
    total_stock INTEGER DEFAULT 0,
    available_stock INTEGER DEFAULT 0,
    condition TEXT DEFAULT 'good',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.gear_inventory DISABLE ROW LEVEL SECURITY;


-- ==========================================
-- 7. NOTIFICACIONES: Historial de WhatsApps/Emails
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adventurer_id UUID REFERENCES public.adventurers(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'email' o 'whatsapp'
    template TEXT NOT NULL,
    status TEXT NOT NULL, -- 'sent', 'failed', 'pending'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.notification_logs DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- Funciones Automáticas (Triggers)
-- ==============================================================================

-- Actualizar cupos de expedición cuando se confirma una reserva
CREATE OR REPLACE FUNCTION update_expedition_capacity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        UPDATE public.expeditions 
        SET current_bookings = current_bookings + 1 
        WHERE id = NEW.expedition_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_capacity
AFTER UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_expedition_capacity();
