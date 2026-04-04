-- PRECISION PERFORMANCE V3: THE MASTER DATA-DRIVEN RESET
-- Origin: Project Plan Section 6 & 9
-- Target Project: ukqncqjhnokxlvfifeyn.supabase.com
-- Strategy: "Archive-Reset-Rebuild-Restore"

BEGIN;

-- =============================================================================
-- PHASE 3.1: DATA PRESERVATION (Conditional Snapshotting)
-- =============================================================================

DO $$ 
BEGIN
    -- 1. STAGING TRAINERS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trainers') THEN
        CREATE TEMP TABLE staging_trainers AS 
        SELECT id, full_name, stable_name, created_at FROM public.trainers;
    ELSE
        CREATE TEMP TABLE staging_trainers (id uuid, full_name text, stable_name text, created_at timestamptz);
    END IF;

    -- 2. STAGING CLIENTS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clients') THEN
        CREATE TEMP TABLE staging_clients AS 
        SELECT id, full_name, contact_number, created_at FROM public.clients;
    ELSE
        CREATE TEMP TABLE staging_clients (id uuid, full_name text, contact_number text, created_at timestamptz);
    END IF;

    -- 3. STAGING HORSES
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'horses') THEN
        CREATE TEMP TABLE staging_horses AS SELECT * FROM public.horses;
        
        -- Ensure standard columns exist for the restoration phase
        DO $inner$ BEGIN
            BEGIN ALTER TABLE staging_horses ADD COLUMN trainer_id uuid; EXCEPTION WHEN duplicate_column THEN NULL; END;
            BEGIN ALTER TABLE staging_horses ADD COLUMN client_id uuid; EXCEPTION WHEN duplicate_column THEN NULL; END;
            BEGIN ALTER TABLE staging_horses ADD COLUMN default_weight_kg numeric DEFAULT 500; EXCEPTION WHEN duplicate_column THEN NULL; END;
        END $inner$;
    ELSE
        CREATE TEMP TABLE staging_horses (id uuid, name text, trainer_id uuid, client_id uuid, default_weight_kg numeric, created_at timestamptz);
    END IF;
END $$;

-- =============================================================================
-- PHASE 3.2: TEARDOWN (Removal of Conflict Structures)
-- =============================================================================

-- Views
DROP VIEW IF EXISTS public.vw_elite_performance_summary CASCADE;
DROP VIEW IF EXISTS public.vw_daily_metrics_summary CASCADE;

-- V3 Tables (in case of re-run)
DROP TABLE IF EXISTS public.biochemistry_logs CASCADE;
DROP TABLE IF EXISTS public.physical_logs CASCADE;
DROP TABLE IF EXISTS public.track_sessions CASCADE;
DROP TABLE IF EXISTS public.weather_logs CASCADE;
DROP TABLE IF EXISTS public.daily_records CASCADE;
DROP TABLE IF EXISTS public.horse_ownership CASCADE;
DROP TABLE IF EXISTS public.horses CASCADE;
DROP TABLE IF EXISTS public.stables CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.product_categories CASCADE;
DROP TABLE IF EXISTS public.level_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.membership_levels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- V2 / Legacy Tables
DROP TABLE IF EXISTS public.bio_logs CASCADE;
DROP TABLE IF EXISTS public.performance_metrics CASCADE;
DROP TABLE IF EXISTS public.trainers CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;

-- =============================================================================
-- PHASE 3.3: MODULAR V3 INSTALLATION (Permissions, Profiles, Logs, Commerce)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ACCESS CONTROL
CREATE TABLE public.membership_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, 
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE, 
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.level_permissions (
    level_id UUID REFERENCES public.membership_levels(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (level_id, permission_id)
);

-- 2. USER PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    membership_level_id UUID REFERENCES public.membership_levels(id),
    role TEXT CHECK (role IN ('Trainer', 'Owner', 'Staff', 'Admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENTITY LAYER (Stables, Horses, Assignments)
CREATE TABLE public.stables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT,
    head_trainer_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.horses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    stable_id UUID REFERENCES public.stables(id) ON DELETE SET NULL,
    microchip_id TEXT UNIQUE,
    photo_urls TEXT[],
    default_weight_kg NUMERIC(5,1) DEFAULT 500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.horse_ownership (
    horse_id UUID REFERENCES public.horses(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ownership_percent NUMERIC(5,2) DEFAULT 100.0,
    PRIMARY KEY (horse_id, owner_id)
);

-- 4. LOG LAYER (Expanded Physiology & Operation Tracking)
CREATE TABLE public.daily_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    staff_id UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.biochemistry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID UNIQUE REFERENCES public.daily_records(id) ON DELETE CASCADE,
    urine_brix NUMERIC(4,2),
    urine_ph NUMERIC(3,1),
    urine_salts_ms NUMERIC(6,2),
    urine_salts_c NUMERIC(6,2) GENERATED ALWAYS AS (urine_salts_ms * 1.43) STORED,
    saliva_ph NUMERIC(3,1)
);

CREATE TABLE public.physical_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID UNIQUE REFERENCES public.daily_records(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,1),
    temp_c NUMERIC(3,1),
    water_intake_l NUMERIC(3,1)
);

CREATE TABLE public.track_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID REFERENCES public.daily_records(id) ON DELETE CASCADE,
    duration INTERVAL,
    distance_m NUMERIC(6,2),
    session_type TEXT, 
    track_condition TEXT 
);

CREATE TABLE public.weather_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID REFERENCES public.daily_records(id) ON DELETE CASCADE,
    ambient_temp_c NUMERIC(3,1),
    humidity_percent INTEGER,
    status TEXT 
);

-- 5. COMMERCE LAYER
CREATE TABLE public.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.product_categories(id),
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    stock_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'pending',
    total_amount NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL
);

-- =============================================================================
-- PHASE 3.4: BOOTSTRAP SEEDING (Elite Levels and Permissions)
-- =============================================================================

-- Seed Levels
INSERT INTO public.membership_levels (name, description) VALUES
('Bronze', 'Standard data entry and physiological tracking.'),
('Silver', 'Enhanced trend reporting and diet history.'),
('Gold', 'Full stable analytics and team management.'),
('Platinum', 'Elite dashboard, track-weather correlation, and priority support.'),
('Admin', 'System-level access and permission management.');

-- Seed Permissions
INSERT INTO public.permissions (slug, description) VALUES
('view_basic_data', 'View basic horse profiles and bios.'),
('entry_daily_metrics', 'Submit daily biochemistry and physical logs.'),
('view_detailed_reports', 'Access trend reports and history logs.'),
('manage_stable_staff', 'Allocate horses to staff and manage associations.'),
('view_platinum_analytics', 'Access track session and weather correlation data.'),
('admin_full_access', 'Universal system controls.');

-- Mapping Permissions (Bronze gets basic)
INSERT INTO public.level_permissions (level_id, permission_id)
SELECT l.id, p.id FROM public.membership_levels l, public.permissions p 
WHERE l.name = 'Bronze' AND p.slug IN ('view_basic_data', 'entry_daily_metrics');

-- Gold gets management
INSERT INTO public.level_permissions (level_id, permission_id)
SELECT l.id, p.id FROM public.membership_levels l, public.permissions p 
WHERE l.name = 'Gold' AND p.slug IN ('view_basic_data', 'entry_daily_metrics', 'view_detailed_reports', 'manage_stable_staff');

-- Platinum gets target analytics
INSERT INTO public.level_permissions (level_id, permission_id)
SELECT l.id, p.id FROM public.membership_levels l, public.permissions p 
WHERE l.name = 'Platinum' AND p.slug IN ('view_basic_data', 'entry_daily_metrics', 'view_detailed_reports', 'manage_stable_staff', 'view_platinum_analytics');

-- =============================================================================
-- PHASE 3.5: DATA RESTORATION (Mapping V2 -> V3)
-- =============================================================================

-- Restore Trainers to Profiles & Create Stables
INSERT INTO public.profiles (id, full_name, membership_level_id, role, created_at)
SELECT id, full_name, (SELECT id FROM public.membership_levels WHERE name = 'Gold'), 'Trainer', created_at 
FROM staging_trainers;

INSERT INTO public.stables (name, head_trainer_id, created_at)
SELECT stable_name, id, created_at FROM staging_trainers WHERE stable_name IS NOT NULL;

-- Restore Clients to Profiles (Assign Bronze)
INSERT INTO public.profiles (id, full_name, membership_level_id, role, created_at)
SELECT id, full_name, (SELECT id FROM public.membership_levels WHERE name = 'Bronze'), 'Owner', created_at 
FROM staging_clients;

-- Restore Horses (Attaching to new Stables)
INSERT INTO public.horses (id, name, stable_id, default_weight_kg, created_at)
SELECT h.id, h.name, s.id, h.default_weight_kg, h.created_at 
FROM staging_horses h 
JOIN public.stables s ON s.head_trainer_id = h.trainer_id;

-- Restore Ownership Relationships
INSERT INTO public.horse_ownership (horse_id, owner_id, ownership_percent)
SELECT id, client_id, 100.0 FROM staging_horses;

COMMIT;

-- FINAL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biochemistry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RE-GENERATE ANALYTICS VIEWS
CREATE OR REPLACE VIEW public.vw_elite_performance_summary AS
SELECT 
    h.id AS horse_id,
    h.name AS horse_name,
    dr.recorded_at,
    bl.urine_brix,
    bl.urine_salts_c,
    bl.urine_ph,
    pl.weight_kg,
    ws.ambient_temp_c,
    ts.session_type
FROM 
    public.horses h
LEFT JOIN public.daily_records dr ON dr.horse_id = h.id
LEFT JOIN public.biochemistry_logs bl ON bl.record_id = dr.id
LEFT JOIN public.physical_logs pl ON pl.record_id = dr.id
LEFT JOIN public.weather_logs ws ON ws.record_id = dr.id
LEFT JOIN public.track_sessions ts ON ts.record_id = dr.id;
