-- ==============================================================================
-- GAZ STYLE - TABLAS DEL MÓDULO PUNTO DE VENTA (POS) Y PRODUCCIÓN
-- ==============================================================================

-- 1. CONFIGURACIÓN DEL TALLER / POS
CREATE TABLE IF NOT EXISTS public.atelier_config (
    id UUID PRIMARY KEY DEFAULT 'c0ffee88-8888-8888-8888-888888888888'::uuid,
    labor_capacity_per_operator_daily NUMERIC DEFAULT 7,
    total_active_operators NUMERIC DEFAULT 3,
    logistic_buffer_days NUMERIC DEFAULT 2,
    delivery_window_start TEXT DEFAULT '15:00:00',
    delivery_window_end TEXT DEFAULT '18:00:00',
    delivery_allowed_days INTEGER[] DEFAULT '{2,4}', -- Días de la semana permitidos para entrega
    workshop_working_days INTEGER[] DEFAULT '{1,2,3,4,5,6}',
    workshop_working_hour_start TEXT DEFAULT '09:00:00',
    workshop_working_hour_end TEXT DEFAULT '18:00:00',
    hc_templates JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar configuración por defecto
INSERT INTO public.atelier_config (id)
VALUES ('c0ffee88-8888-8888-8888-888888888888'::uuid)
ON CONFLICT (id) DO NOTHING;

-- 2. OPERARIOS / GUÍAS DEL TALLER
CREATE TABLE IF NOT EXISTS public.atelier_operators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    daily_hours_capacity NUMERIC DEFAULT 7,
    working_days INTEGER[] DEFAULT '{1,2,3,4,5,6}',
    status TEXT DEFAULT 'active',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.atelier_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.atelier_operators DISABLE ROW LEVEL SECURITY;
