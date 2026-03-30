-- PRECISION PERFORMANCE V2: MASTER PRODUCTION DEPLOYMENT (RECOVERY MODE)
-- Target Project: ukqncqjhnokxlvfifeyn.supabase.com
-- Philosophy: "Go by the Numbers, No Guessing"
-- Reason: Purging incompatible legacy "Attempt 1" tables to allow V2 Schema Injection.

-- 0. CLEAN SLATE (Removing Legacy Conflicts)
-- WARNING: This will remove the 4 legacy horses. We are moving to the Elite V2 architecture.
DROP TABLE IF EXISTS public.bio_logs CASCADE;
DROP TABLE IF EXISTS public.performance_metrics CASCADE;
DROP TABLE IF EXISTS public.horses CASCADE;
DROP TABLE IF EXISTS public.trainers CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;

-- 1. PREPARATION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TRAINERS (Elite Auth)
CREATE TABLE public.trainers (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    stable_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CLIENTS
CREATE TABLE public.clients (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    contact_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. HORSES (Relational Logic)
CREATE TABLE public.horses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    photo_urls TEXT[],
    default_weight_kg NUMERIC(5,1) DEFAULT 500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BIO LOGS (The Measurement Engine)
CREATE TABLE public.bio_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Telemetry
    urine_brix NUMERIC(4,2) CHECK (urine_brix >= 0 AND urine_brix <= 13),
    urine_ph NUMERIC(3,1) CHECK (urine_ph >= 0 AND urine_ph <= 10),
    urine_salts_ms NUMERIC(6,2) CHECK (urine_salts_ms >= 0),
    urine_salts_c NUMERIC(6,2) GENERATED ALWAYS AS (urine_salts_ms * 1.43) STORED,
    saliva_ph NUMERIC(3,1) CHECK (saliva_ph >= 0 AND saliva_ph <= 10),
    
    -- Physical
    weight NUMERIC(5,1) CHECK (weight > 0),
    observation_notes TEXT,
    feed_regimen TEXT,
    
    -- Healing Status (Computed for "No Guessing")
    is_healing_brix BOOLEAN GENERATED ALWAYS AS (urine_brix >= 3.0 AND urine_brix <= 4.0) STORED,
    is_healing_ph_urine BOOLEAN GENERATED ALWAYS AS (urine_ph >= 6.4 AND urine_ph <= 7.0) STORED,
    is_healing_ph_saliva BOOLEAN GENERATED ALWAYS AS (saliva_ph >= 6.4 AND saliva_ph <= 7.0) STORED,
    is_healing_salts BOOLEAN GENERATED ALWAYS AS ((urine_salts_ms * 1.43) >= 15.0 AND (urine_salts_ms * 1.43) <= 20.0) STORED,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. COMMERCE (Products & Orders)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('Testing Kits', 'Performance Essentials')),
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    stock_level INTEGER NOT NULL DEFAULT 0 CHECK (stock_level >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SECURITY (RLS)
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Trainers manage own horses" ON public.horses FOR ALL USING (auth.uid() = trainer_id);
CREATE POLICY "Trainers view bio logs" ON public.bio_logs FOR SELECT USING (horse_id IN (SELECT id FROM public.horses WHERE trainer_id = auth.uid()));

-- 8. ANALYTICS (Views)
CREATE OR REPLACE VIEW public.vw_daily_metrics_summary AS
SELECT 
    horse_id,
    DATE(created_at) AS log_date,
    ROUND(AVG(urine_brix), 2) AS avg_brix,
    ROUND(AVG(urine_salts_c), 2) AS avg_salts_c,
    ROUND(AVG(urine_ph), 2) AS avg_urine_ph,
    ROUND(AVG(saliva_ph), 2) AS avg_saliva_ph,
    bool_and(is_healing_brix) AS all_healing_brix,
    bool_and(is_healing_salts) AS all_healing_salts,
    bool_and(is_healing_ph_urine) AS all_healing_ph
FROM 
    public.bio_logs
GROUP BY 
    horse_id, DATE(created_at);
