-- ==============================================================
-- GAZ STYLE OS - MIGRACIÓN: Tabla bookings para motor de reservas
-- Ejecutar en Supabase SQL Editor
-- ==============================================================

-- Agregar columnas faltantes a la tabla bookings (si existe)
ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS departure_id UUID REFERENCES public.agenda_departures(id),
    ADD COLUMN IF NOT EXISTS adventurer_id UUID REFERENCES public.crm_adventurers(id),
    ADD COLUMN IF NOT EXISTS total_price DECIMAL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS amount_paid DECIMAL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS booking_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Si bookings no existe aún, créala desde cero:
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    departure_id UUID REFERENCES public.agenda_departures(id),
    adventurer_id UUID REFERENCES public.crm_adventurers(id),
    total_price DECIMAL DEFAULT 0,
    amount_paid DECIMAL DEFAULT 0,
    payment_status TEXT DEFAULT 'pending',  -- 'pending', 'paid', 'refunded', 'failed'
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
