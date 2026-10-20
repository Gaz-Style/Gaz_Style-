-- ==============================================================================
-- MÓDULO DE CUPONES DE DESCUENTO Y PREMIOS / SORTEOS (SANTIAGO HIKING)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS discount_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    campaign_name TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_ticket')),
    discount_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
    min_purchase_amount NUMERIC(10, 2) DEFAULT 0,
    max_uses INT DEFAULT NULL,
    times_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_discount_coupons_code ON discount_coupons(code);
CREATE INDEX IF NOT EXISTS idx_discount_coupons_active ON discount_coupons(is_active);

-- Registro de uso de cupones por reserva
CREATE TABLE IF NOT EXISTS coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES discount_coupons(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    adventurer_email TEXT NOT NULL,
    discount_applied NUMERIC(10, 2) NOT NULL,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon_id ON coupon_redemptions(coupon_id);

-- RLS
ALTER TABLE discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discount_coupons' AND policyname = 'Allow admin read coupons') THEN
        CREATE POLICY "Allow admin read coupons" ON discount_coupons FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discount_coupons' AND policyname = 'Allow service role all coupons') THEN
        CREATE POLICY "Allow service role all coupons" ON discount_coupons FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupon_redemptions' AND policyname = 'Allow admin redemptions') THEN
        CREATE POLICY "Allow admin redemptions" ON coupon_redemptions FOR ALL USING (true);
    END IF;
END $$;

-- Cupones iniciales para Premios y Sorteos de Lanzamiento
INSERT INTO discount_coupons (code, campaign_name, discount_type, discount_value, max_uses, is_active)
VALUES 
    ('SORTEO2026', 'Sorteo Instagram Santiago Hiking', 'percentage', 20, 50, true),
    ('PREMIO100', 'Ganador Entrada Gratuita Sorteo', 'free_ticket', 100, 5, true),
    ('WILD10K', 'Bono Descuento Comunidad', 'fixed_amount', 10000, 100, true)
ON CONFLICT (code) DO NOTHING;
