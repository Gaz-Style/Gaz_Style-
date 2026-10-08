-- ==============================================================================
-- GAZ STYLE EXPEDITIONS OS - ERP: LIBRO MAYOR GENERAL
-- Registro de todos los gastos e ingresos de la empresa (no solo de expediciones)
-- ==============================================================================

-- Tabla de Centros de Costo (Para agrupar gastos)
CREATE TABLE IF NOT EXISTS public.cost_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- 'Operaciones', 'Administración', 'Marketing', 'Recursos Humanos'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Proveedores / Acreedores
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    rut TEXT,
    category TEXT, -- 'Transporte', 'Alojamiento', 'Personal', 'Arriendo', 'Parques'
    contact_email TEXT,
    contact_phone TEXT,
    bank_account TEXT, -- Para transferencias directas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Gastos Generales (Libro Mayor de Egresos)
CREATE TABLE IF NOT EXISTS public.general_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_date DATE NOT NULL,
    description TEXT NOT NULL, -- 'Arriendo Bodega Octubre', 'Sueldo Guía Juan', 'Hostal Cajón del Maipo'
    amount DECIMAL NOT NULL,
    category TEXT NOT NULL, -- 'Arriendo', 'Remuneraciones', 'Alojamiento', 'Combustible', 'Marketing', 'Seguros', 'Otros'
    cost_center_id UUID REFERENCES public.cost_centers(id),
    supplier_id UUID REFERENCES public.suppliers(id),
    -- Si el gasto está asociado a una salida específica (ej: gasto imprevisto en ruta)
    departure_id UUID REFERENCES public.agenda_departures(id),
    payment_method TEXT DEFAULT 'Transferencia', -- 'Efectivo', 'Tarjeta', 'Transferencia', 'Cheque'
    receipt_url TEXT, -- Link al comprobante subido
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Ingresos Generales (Libro Mayor de Ingresos)
-- Ej: Ingresos por arriendo de equipos, donaciones, ventas de merchandising
CREATE TABLE IF NOT EXISTS public.general_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    income_date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    category TEXT NOT NULL, -- 'Reserva Tour', 'Arriendo Equipo', 'Merchandising', 'Subsidio'
    departure_id UUID REFERENCES public.agenda_departures(id),
    payment_method TEXT DEFAULT 'Transferencia',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Remuneraciones (Registro de Sueldos)
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period TEXT NOT NULL, -- 'Octubre 2026', 'Noviembre 2026'
    staff_name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'Guía Senior', 'Guía Trainee', 'Administrativo', 'Operaciones'
    base_salary DECIMAL NOT NULL,
    bonuses DECIMAL DEFAULT 0,
    deductions DECIMAL DEFAULT 0,
    net_pay DECIMAL GENERATED ALWAYS AS (base_salary + bonuses - deductions) STORED,
    payment_date DATE,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar centros de costo base
INSERT INTO public.cost_centers (name, description) VALUES
    ('Operaciones de Campo', 'Gastos directamente asociados a la ejecución de expediciones'),
    ('Administración', 'Gastos de oficina, local, arriendo, servicios básicos'),
    ('Recursos Humanos', 'Remuneraciones, capacitaciones, equipamiento de personal'),
    ('Marketing & Ventas', 'Publicidad, fotografía, redes sociales, ferias'),
    ('Equipo & Bodega', 'Mantención, reposición y almacenamiento del gear')
ON CONFLICT (name) DO NOTHING;
