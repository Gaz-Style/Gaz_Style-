-- =======================================================================================
-- INFRAESTRUCTURA LIVE CHAT & WHATSAPP CRM (SANTIAGO HIKING / GAZ STYLE)
-- =======================================================================================

-- 1. Asegurar columnas en la tabla crm_whatsapp_chats
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    lead_score NUMERIC DEFAULT 0,
    session_status TEXT NOT NULL CHECK (session_status IN ('bot', 'human_handoff', 'closed')) DEFAULT 'bot',
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(phone_number)
);

-- Agregar columnas faltantes de forma segura sin romper la tabla existente
ALTER TABLE public.crm_whatsapp_chats 
ADD COLUMN IF NOT EXISTS customer_id UUID,
ADD COLUMN IF NOT EXISTS last_message TEXT,
ADD COLUMN IF NOT EXISTS last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Historial de Mensajes de WhatsApp
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.crm_whatsapp_chats(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'customer', 'bot', 'human')),
    message_type TEXT NOT NULL CHECK (message_type IN ('text', 'image', 'audio', 'document', 'interactive', 'location')) DEFAULT 'text',
    content TEXT,
    media_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Eliminar trigger antiguo que apuntaba a tabla inexistente 'customers'
DROP TRIGGER IF EXISTS trigger_match_customer_on_whatsapp_chat ON public.crm_whatsapp_chats;
DROP FUNCTION IF EXISTS public.match_customer_on_whatsapp_chat();

-- 4. Trigger de Enrolamiento Automático con la Ficha Real de Aventureros (crm_adventurers)
CREATE OR REPLACE FUNCTION public.match_adventurer_on_whatsapp_chat()
RETURNS TRIGGER AS $$
DECLARE
    matched_id UUID;
    clean_chat_phone TEXT;
BEGIN
    clean_chat_phone := regexp_replace(NEW.phone_number, '\D', '', 'g');
    
    IF length(clean_chat_phone) >= 8 THEN
        SELECT id INTO matched_id 
        FROM public.crm_adventurers 
        WHERE substring(regexp_replace(phone, '\D', '', 'g') from '\d{8}$') = substring(clean_chat_phone from '\d{8}$')
        LIMIT 1;

        IF matched_id IS NOT NULL THEN
            NEW.customer_id := matched_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_match_adventurer_on_whatsapp_chat
BEFORE INSERT OR UPDATE OF phone_number ON public.crm_whatsapp_chats
FOR EACH ROW
EXECUTE FUNCTION public.match_adventurer_on_whatsapp_chat();

-- 5. Habilitar RLS con políticas permisivas
ALTER TABLE public.crm_whatsapp_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo en crm_whatsapp_chats" ON public.crm_whatsapp_chats;
CREATE POLICY "Permitir todo en crm_whatsapp_chats" ON public.crm_whatsapp_chats
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en crm_whatsapp_messages" ON public.crm_whatsapp_messages;
CREATE POLICY "Permitir todo en crm_whatsapp_messages" ON public.crm_whatsapp_messages
FOR ALL USING (true) WITH CHECK (true);

