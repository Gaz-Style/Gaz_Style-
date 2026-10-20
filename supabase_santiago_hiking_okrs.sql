-- ==============================================================================
-- 🏔️ SANTIAGO HIKING — METODOLOGÍA OKR (AGOSTO - DICIEMBRE 2026)
-- Basado en la metodología oficial adaptada de OKRs_EstampateEsta_Ago-Dic_2026.xlsx
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.santiago_hiking_okrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    objective_id TEXT NOT NULL,
    objective_title TEXT NOT NULL,
    kr_title TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('flujo', 'acumulado')),
    unit TEXT NOT NULL DEFAULT '', -- '$', '#', '%', 'USD $'
    baseline NUMERIC NOT NULL DEFAULT 0,
    month_names TEXT[] NOT NULL DEFAULT ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    targets NUMERIC[] NOT NULL,
    actuals NUMERIC[] NOT NULL,
    notes TEXT DEFAULT '',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE public.santiago_hiking_okrs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública/admin para OKRs"
    ON public.santiago_hiking_okrs FOR SELECT USING (true);

CREATE POLICY "Escritura admin para OKRs"
    ON public.santiago_hiking_okrs FOR ALL USING (true);

-- ==============================================================================
-- SEED DATA INICIAL — SANTIAGO HIKING (ESTÁNDAR MUCH BETTER ADVENTURES)
-- ==============================================================================

INSERT INTO public.santiago_hiking_okrs (
    objective_id, objective_title, kr_title, metric_name, metric_type, unit, baseline, month_names, targets, actuals, order_index
) VALUES
-- OBJETIVO 1: Tracción Comercial & Cordadas
(
    'O1',
    'Escalar ventas y cupos de cordada en Santiago Hiking',
    'Duplicar la venta mensual de expediciones respecto al mes base',
    'Ventas mensuales ($ CLP)',
    'flujo',
    '$',
    350000,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[450000, 650000, 950000, 1350000, 1800000],
    ARRAY[480000, 620000, 710000, NULL, NULL]::numeric[],
    1
),
(
    'O1',
    'Escalar ventas y cupos de cordada en Santiago Hiking',
    'Escalar el número de cupos reservados por mes',
    'Cupos reservados (#)',
    'flujo',
    '#',
    12,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[16, 22, 30, 42, 55],
    ARRAY[18, 20, 22, NULL, NULL]::numeric[],
    2
),
(
    'O1',
    'Escalar ventas y cupos de cordada en Santiago Hiking',
    'Mantener o mejorar el margen operativo neto sobre ventas',
    'Margen sobre ventas (%)',
    'flujo',
    '%',
    0.52,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[0.52, 0.53, 0.55, 0.55, 0.58],
    ARRAY[0.54, 0.52, 0.50, NULL, NULL]::numeric[],
    3
),

-- OBJETIVO 2: Comunidad Salvaje & Alcance Orgánico
(
    'O2',
    'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    'Crecer la comunidad de montaña en Instagram (@gaz_style / Santiago Hiking)',
    'Seguidores Instagram (acumulado)',
    'acumulado',
    '#',
    650,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[750, 950, 1250, 1700, 2300],
    ARRAY[780, 920, 1150, NULL, NULL]::numeric[],
    4
),
(
    'O2',
    'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    'Escalar tracción y alcance orgánico en TikTok',
    'Seguidores TikTok (acumulado)',
    'acumulado',
    '#',
    120,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[250, 500, 900, 1500, 2500],
    ARRAY[260, 480, 810, NULL, NULL]::numeric[],
    5
),
(
    'O2',
    'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    'Publicar contenido audiovisual épico de forma consistente',
    'Reels/TikToks acumulados (#)',
    'acumulado',
    '#',
    10,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[20, 35, 55, 75, 100],
    ARRAY[22, 34, 45, NULL, NULL]::numeric[],
    6
),
(
    'O2',
    'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    'Generar leads calificados hacia el Bot Gaz en WhatsApp',
    'Consultas entrantes WhatsApp (#)',
    'flujo',
    '#',
    25,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[40, 65, 95, 140, 200],
    ARRAY[45, 60, 75, NULL, NULL]::numeric[],
    7
),

-- OBJETIVO 3: Excelencia & Reputación de Cordada
(
    'O3',
    'Consolidar reputación 5 estrellas y retención de aventureros',
    'Acumular reseñas 5 estrellas verificadas en Google Maps y plataformas',
    'Reseñas 5★ acumuladas (#)',
    'acumulado',
    '#',
    8,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[15, 25, 40, 60, 85],
    ARRAY[16, 26, 38, NULL, NULL]::numeric[],
    8
),
(
    'O3',
    'Consolidar reputación 5 estrellas y retención de aventureros',
    'Fomentar la repetición de cordada (Repeat Hikers)',
    'Aventureros que repiten cumbre (%)',
    'flujo',
    '%',
    0.15,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[0.18, 0.20, 0.22, 0.25, 0.28],
    ARRAY[0.19, 0.21, 0.20, NULL, NULL]::numeric[],
    9
),

-- OBJETIVO 4: Expansión Internacional & Turistas en USD
(
    'O4',
    'Internacionalización & Captación de Turistas Extranjeros en USD',
    'Homologar y activar canales internacionales (Airbnb / Viator / Bookatrekking)',
    'Canales internacionales activos (#)',
    'acumulado',
    '#',
    0,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[1, 2, 3, 3, 3],
    ARRAY[1, 2, 2, NULL, NULL]::numeric[],
    10
),
(
    'O4',
    'Internacionalización & Captación de Turistas Extranjeros en USD',
    'Facturación directa de viajeros extranjeros en Santiago',
    'Ventas turistas internacionales (USD $)',
    'flujo',
    'USD $',
    0,
    ARRAY['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    ARRAY[250, 600, 1200, 2000, 3200],
    ARRAY[300, 550, 950, NULL, NULL]::numeric[],
    11
)
ON CONFLICT DO NOTHING;
