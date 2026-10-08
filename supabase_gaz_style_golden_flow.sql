-- ==============================================================================
-- GAZ STYLE EXPEDITIONS - GOLDEN FLOW ARCHITECTURE (CRM + ERP)
-- Fase 1: Despliegue de Base de Datos y "Resource Pooling"
-- ==============================================================================

-- ==========================================
-- 1. CRM: FICHA DEL AVENTURERO (Front-Office)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.crm_adventurers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    -- Datos Médicos Críticos
    blood_type TEXT,
    severe_allergies TEXT DEFAULT 'Ninguna',
    medical_conditions TEXT,
    -- Datos de Seguridad
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    waiver_signed BOOLEAN DEFAULT false,
    waiver_document_url TEXT, -- Link al PDF firmado vía Webhook
    waiver_date TIMESTAMP WITH TIME ZONE,
    mountain_experience_level TEXT DEFAULT 'Principiante', -- Principiante, Medio, Avanzado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. INVENTARIO COMPARTIDO (Resource Pool)
-- ==========================================
-- Base de datos central de equipos físicos compartidos entre todas las expediciones
CREATE TABLE IF NOT EXISTS public.shared_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL, -- Ej: 'Carpa Doite 2P', 'Piolet Petzl'
    category TEXT NOT NULL, -- 'Camping', 'Seguridad', 'Alta Montaña'
    total_owned INTEGER NOT NULL DEFAULT 0, -- Cantidad física en bodega
    available_qty INTEGER NOT NULL DEFAULT 0, -- Cantidad disponible en tiempo real
    status TEXT DEFAULT 'active', -- 'active', 'needs_repair', 'retired'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. PRODUCTO: CATÁLOGO DE AVENTURAS (DMC)
-- ==========================================
-- El "Molde" estático de las rutas que se venden.
CREATE TABLE IF NOT EXISTS public.adventures_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Trekking', 'Alta Montaña', 'Familiar'
    difficulty_level TEXT NOT NULL,
    duration_days INTEGER DEFAULT 1,
    base_price DECIMAL NOT NULL,
    min_pax INTEGER DEFAULT 2,
    max_pax INTEGER DEFAULT 12,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. ERP COSTEO: PLANTILLA DE PROVEEDORES
-- ==========================================
-- Estructura de costos esperados para poder calcular el margen (Yield Management)
CREATE TABLE IF NOT EXISTS public.adventure_costs_template (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adventure_id UUID REFERENCES public.adventures_catalog(id) ON DELETE CASCADE,
    cost_name TEXT NOT NULL, -- ej: 'Transporte Van', 'Ticket CONAF', 'Guía'
    expected_amount DECIMAL NOT NULL,
    cost_type TEXT DEFAULT 'fixed', -- 'fixed' (Costo fijo por salida ej: Van), 'per_pax' (Costo por persona ej: Ticket Parque)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. AGENDA: SALIDAS PROGRAMADAS (Calendario)
-- ==========================================
-- Las instancias reales que se ven en el calendario de operaciones.
CREATE TABLE IF NOT EXISTS public.agenda_departures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adventure_id UUID REFERENCES public.adventures_catalog(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guide_id UUID, -- Referencia a la tabla de staff/guías
    current_pax INTEGER DEFAULT 0,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 6. BOOKING ENGINE: RESERVAS (Saga Pattern)
-- ==========================================
-- Transacciones de clientes asociadas a una salida específica.
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    departure_id UUID REFERENCES public.agenda_departures(id),
    adventurer_id UUID REFERENCES public.crm_adventurers(id),
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    total_price DECIMAL NOT NULL, -- Precio Final Empaquetado
    amount_paid DECIMAL DEFAULT 0,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid'
    booking_status TEXT DEFAULT 'reserved' -- 'reserved', 'confirmed', 'cancelled' (Para Compensación Saga)
);

-- ==========================================
-- 7. ORQUESTACIÓN: BLOQUEO DE RECURSOS (Gear)
-- ==========================================
-- Tabla transaccional que amarra una reserva con el uso temporal de un recurso.
CREATE TABLE IF NOT EXISTS public.booking_gear_allocation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES public.shared_inventory(id),
    quantity_reserved INTEGER NOT NULL,
    allocation_status TEXT DEFAULT 'active' -- 'active', 'released' (Si se cancela la reserva)
);

-- ==========================================
-- 8. ERP OPERACIONES: GASTOS REALES (Ledger)
-- ==========================================
-- Para comparar la plantilla (Esperado) vs lo que realmente se pagó (Accounts Payable).
CREATE TABLE IF NOT EXISTS public.departure_actual_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    departure_id UUID REFERENCES public.agenda_departures(id),
    cost_name TEXT NOT NULL,
    actual_amount DECIMAL NOT NULL,
    provider_name TEXT, -- Ej: "Transportes del Sur SPA"
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
