-- ==============================================================================
-- GAZ STYLE EXPEDITIONS - TREKKING SCHEMA UPDATE
-- ==============================================================================

-- 1. EXPEDITIONS (Replaces the "Products/Catalog" concept)
CREATE TABLE IF NOT EXISTS public.expeditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    difficulty TEXT NOT NULL, -- 'Familiar', 'Media', 'Alta', 'Extrema'
    duration_days INTEGER DEFAULT 1,
    base_price DECIMAL DEFAULT 0,
    max_capacity INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DEPARTURES / CALENDAR (The core engine for the calendar)
CREATE TABLE IF NOT EXISTS public.departures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expedition_id UUID REFERENCES public.expeditions(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guide_id UUID, -- References a users table for guides
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ADVENTURERS (Enhances the "customers" concept)
-- We add columns directly to the existing customers table, or create a new one.
-- Since the user has 'customers' from Elena, let's add trekking-specific fields to it.
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS blood_type TEXT,
ADD COLUMN IF NOT EXISTS severe_allergies TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS trekking_experience_level TEXT,
ADD COLUMN IF NOT EXISTS signed_waiver BOOLEAN DEFAULT false;

-- 4. BOOKINGS (Replaces POS/Orders)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    departure_id UUID REFERENCES public.departures(id),
    customer_id UUID REFERENCES public.customers(id),
    pax_count INTEGER DEFAULT 1,
    total_price DECIMAL DEFAULT 0,
    paid_amount DECIMAL DEFAULT 0,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid'
    booking_status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. GEAR INVENTORY (Replaces Fabric Inventory)
CREATE TABLE IF NOT EXISTS public.gear_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Tent', 'Sleeping Bag', 'Crampons', 'Ice Axe'
    total_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER DEFAULT 0,
    maintenance_status TEXT DEFAULT 'good', -- 'good', 'needs_repair', 'retired'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
