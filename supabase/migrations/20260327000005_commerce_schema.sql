-- Migration: Commerce Integration Schema
-- Philosophy: "Go by the Numbers, No Guessing"

CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    stock_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trainer_id UUID REFERENCES public.profiles(id) NOT NULL,
    total_cents INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by all authenticated users."
    ON public.products FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Orders are viewable by the trainer who placed them."
    ON public.orders FOR SELECT
    USING (auth.uid() = trainer_id);

-- Seed Initial Hardware
INSERT INTO public.products (name, description, price_cents, stock_level) VALUES 
('Precision Refractometer', 'Clinical-grade optical instrument for absolute Brix (0-10%) sugar measurements.', 14500, 50),
('Conductivity Meter (ms)', 'High-fidelity sensory probe for microsiemens testing (calculates C = ms * 1.43).', 8900, 75),
('Equine pH Strips (100x)', 'Calibrated colorimetric strips for strict 6.4-7.0 biological targeting.', 2500, 200);
