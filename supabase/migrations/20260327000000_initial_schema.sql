-- Create extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Trainers Table
CREATE TABLE public.trainers (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    stable_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Clients Table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    contact_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Horses Table
CREATE TABLE public.horses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    photo_urls TEXT[], -- Array of URLs pointing to Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bio Logs Table (RBTI & Metadata)
CREATE TABLE public.bio_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Urine Parameters
    urine_brix NUMERIC(4,2) CHECK (urine_brix >= 0),
    urine_ph NUMERIC(3,1) CHECK (urine_ph >= 0 AND urine_ph <= 14),
    urine_conductivity NUMERIC(5,2),
    urine_nitrates NUMERIC(5,2),
    
    -- Saliva Parameters
    saliva_ph NUMERIC(3,1) CHECK (saliva_ph >= 0 AND saliva_ph <= 14),
    
    -- Physical Metadata
    temperature NUMERIC(3,1) CHECK (temperature >= 35.0 AND temperature <= 42.0),
    weight NUMERIC(5,1) CHECK (weight > 0),
    
    -- Trainer Communication
    trainer_comments TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Performance Metrics Table
CREATE TABLE public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    distance_metres INTEGER CHECK (distance_metres > 0),
    time_seconds NUMERIC(6,2) CHECK (time_seconds > 0),
    results_of_event TEXT,
    trainer_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Horses
-- Trainers can view and edit their own horses
CREATE POLICY "Trainers view own horses" ON public.horses
    FOR SELECT USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers manage own horses" ON public.horses
    FOR ALL USING (auth.uid() = trainer_id);

-- Clients can view horses they own
CREATE POLICY "Clients view own horses" ON public.horses
    FOR SELECT USING (auth.uid() = client_id);

-- RLS Policies for Bio Logs
CREATE POLICY "Trainers view bio logs for their horses" ON public.bio_logs
    FOR SELECT USING (horse_id IN (SELECT id FROM public.horses WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers insert bio logs for their horses" ON public.bio_logs
    FOR INSERT WITH CHECK (horse_id IN (SELECT id FROM public.horses WHERE trainer_id = auth.uid()));

CREATE POLICY "Clients view bio logs for their horses" ON public.bio_logs
    FOR SELECT USING (horse_id IN (SELECT id FROM public.horses WHERE client_id = auth.uid()));

-- RLS Policies for Performance Metrics
CREATE POLICY "Trainers view performance for their horses" ON public.performance_metrics
    FOR SELECT USING (horse_id IN (SELECT id FROM public.horses WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers manage performance for their horses" ON public.performance_metrics
    FOR ALL USING (horse_id IN (SELECT id FROM public.horses WHERE trainer_id = auth.uid()));

CREATE POLICY "Clients view performance for their horses" ON public.performance_metrics
    FOR SELECT USING (horse_id IN (SELECT id FROM public.horses WHERE client_id = auth.uid()));
