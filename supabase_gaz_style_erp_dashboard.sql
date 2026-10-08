-- ==============================================================================
-- GAZ STYLE - TABLAS FALTANTES DEL DASHBOARD (IA, CRM WHATSAPP, CONFIGS)
-- ==============================================================================

-- ==========================================
-- 12. CONFIGURACIONES DE LA EMPRESA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 13. CHATS DE WHATSAPP DEL CRM (LIVECHAT)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number TEXT UNIQUE NOT NULL,
    lead_score INTEGER,
    session_status TEXT DEFAULT 'bot', -- 'bot', 'human_handoff', 'closed'
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 14. TAREAS DEL AGENTE DE IA (ORQUESTADOR)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ai_agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    agent_role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 15. NOTIFICACIONES DEL SISTEMA (DASHBOARD)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'success'
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 16. CATÁLOGO DE SERVICIOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    production_time_minutes INTEGER DEFAULT 0,
    material_cost DECIMAL DEFAULT 0,
    price DECIMAL DEFAULT 0,
    suggested_price DECIMAL DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar configuraciones base para que el Dashboard no falle
INSERT INTO public.company_settings (key, value, description) VALUES
('cost_structure', '{"labor_hourly_rate": 25000}', 'Estructura de costos base para métricas')
ON CONFLICT (key) DO NOTHING;
