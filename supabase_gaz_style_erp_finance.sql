-- ==============================================================================
-- GAZ STYLE - MÓDULO ERP: FINANZAS, CONTABILIDAD Y LIVECHAT
-- Migración Arquitectónica basada en el modelo de Elena Atelier
-- ==============================================================================

-- ==========================================
-- 8. LIVECHAT: Sesiones y Mensajes de WhatsApp
-- ==========================================
CREATE TABLE IF NOT EXISTS public.livechat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adventurer_id UUID REFERENCES public.adventurers(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'bot', -- 'bot', 'human', 'closed'
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.livechat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.livechat_sessions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'user', 'bot', 'admin'
    sender_name TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.livechat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.livechat_messages DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 9. VENTAS: Ledger Histórico de Pagos
-- ==========================================
CREATE TABLE IF NOT EXISTS public.sales_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internal_id TEXT UNIQUE NOT NULL, -- Ej: V-20261008-001
    adventurer_id UUID REFERENCES public.adventurers(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    total_amount DECIMAL NOT NULL DEFAULT 0,
    paid_amount DECIMAL NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
    payment_method TEXT, -- 'webpay', 'transfer', 'cash', 'mercadopago_point'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.sales_ledger DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 10. CAJA CHICA Y MOVIMIENTOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.cash_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE,
    initial_balance DECIMAL DEFAULT 0,
    expected_closing_balance DECIMAL,
    actual_closing_balance DECIMAL,
    status TEXT DEFAULT 'open', -- 'open', 'closed'
    opened_by TEXT,
    closed_by TEXT
);

CREATE TABLE IF NOT EXISTS public.cash_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    register_id UUID REFERENCES public.cash_registers(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'in', 'out'
    amount DECIMAL NOT NULL,
    reason TEXT NOT NULL,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cash_registers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 11. CONTABILIDAD (ERP de Doble Entrada)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- Ej: '1.1.1', '4.1.1'
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'asset', 'liability', 'equity', 'revenue', 'expense'
    parent_account_id UUID REFERENCES public.accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.accounting_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    reference_type TEXT, -- 'sale', 'expense', 'manual'
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.accounting_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES public.accounting_entries(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id),
    debit DECIMAL DEFAULT 0,
    credit DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_lines DISABLE ROW LEVEL SECURITY;

-- Insertar cuentas maestras iniciales para evitar que la contabilidad colapse
INSERT INTO public.accounts (code, name, type) VALUES
('1.1.1', 'Caja y Bancos', 'asset'),
('1.1.2', 'Cuentas por Cobrar (Webpay)', 'asset'),
('2.1.1', 'Cuentas por Pagar', 'liability'),
('3.1.1', 'Capital Social', 'equity'),
('4.1.1', 'Ingresos por Expediciones', 'revenue'),
('5.1.1', 'Gastos de Operación (Guías, Transporte)', 'expense')
ON CONFLICT (code) DO NOTHING;
