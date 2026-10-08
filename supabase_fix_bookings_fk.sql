-- ==============================================================
-- MIGRACIÓN: Corregir FK en bookings para usar crm_adventurers
-- Ejecutar en Supabase SQL Editor
-- ==============================================================

-- 1. Eliminar el FK constraint antiguo que apunta a "adventurers"
ALTER TABLE public.bookings
    DROP CONSTRAINT IF EXISTS bookings_adventurer_id_fkey;

-- 2. Agregar el nuevo FK apuntando a crm_adventurers
ALTER TABLE public.bookings
    ADD CONSTRAINT bookings_adventurer_id_fkey
    FOREIGN KEY (adventurer_id)
    REFERENCES public.crm_adventurers(id)
    ON DELETE SET NULL;

-- 3. Asegurarse que la columna departure_id también tiene su FK correcta
ALTER TABLE public.bookings
    DROP CONSTRAINT IF EXISTS bookings_departure_id_fkey;

ALTER TABLE public.bookings
    ADD CONSTRAINT bookings_departure_id_fkey
    FOREIGN KEY (departure_id)
    REFERENCES public.agenda_departures(id)
    ON DELETE SET NULL;
