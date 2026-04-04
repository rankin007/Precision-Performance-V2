-- PRECISION PERFORMANCE V3: COMPREHENSIVE MODULAR ARCHITECTURE
-- Target Project: ukqncqjhnokxlvfifeyn.supabase.com
-- Philosophy: "Modular, Data-Driven, Permission-Based"

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ACCESS CONTROL LAYER (Modular Permissions)
CREATE TABLE public.membership_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- e.g., 'Bronze', 'Silver', 'Gold', 'Admin'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE, -- e.g., 'view_reports', 'edit_horse', 'manage_stable'
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

-- Join table for Owners (One horse can have multiple owners)
CREATE TABLE public.horse_ownership (
    horse_id UUID REFERENCES public.horses(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ownership_percent NUMERIC(5,2) DEFAULT 100.0,
    PRIMARY KEY (horse_id, owner_id)
);

-- 4. LOG LAYER (Expanded Physiological & Operational Tracking)

-- Master Daily Record (Header)
CREATE TABLE public.daily_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    staff_id UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Biochemistry Log (RBTI)
CREATE TABLE public.biochemistry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID UNIQUE REFERENCES public.daily_records(id) ON DELETE CASCADE,
    urine_brix NUMERIC(4,2),
    urine_ph NUMERIC(3,1),
    urine_salts_ms NUMERIC(6,2),
    urine_salts_c NUMERIC(6,2) GENERATED ALWAYS AS (urine_salts_ms * 1.43) STORED,
    saliva_ph NUMERIC(3,1)
);

-- Physical Metrics Log
CREATE TABLE public.physical_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID UNIQUE REFERENCES public.daily_records(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,1),
    temp_c NUMERIC(3,1),
    water_intake_l NUMERIC(3,1)
);

-- Track Session Log
CREATE TABLE public.track_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID REFERENCES public.daily_records(id) ON DELETE CASCADE,
    duration INTERVAL,
    distance_m NUMERIC(6,2),
    session_type TEXT, -- e.g., Gallop, Trot
    track_condition TEXT -- e.g., Heavy 8, Good 4
);

-- Weather Log
CREATE TABLE public.weather_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID REFERENCES public.daily_records(id) ON DELETE CASCADE,
    ambient_temp_c NUMERIC(3,1),
    humidity_percent INTEGER,
    status TEXT -- e.g., Sunny, Rain
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

-- 6. SECURITY LAYER (Row-Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biochemistry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 7. AUDIT LOGGING
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

---
-- END OF V3 SCHEMA
