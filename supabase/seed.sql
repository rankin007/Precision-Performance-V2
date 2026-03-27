-- Precision Performance V2 Secure Seeding Script
-- Origin: Mathematically scraped from 'Equine Precision Data Collected.docx'
-- Objective: To aggressively test the 'Go by the Numbers' validation boundaries.

-- Clean state preservation for isolated local testing
TRUNCATE TABLE public.bio_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.horses RESTART IDENTITY CASCADE;

-- Insert Mock Horses
INSERT INTO public.horses (id, trainer_id, name, age, breed, default_weight_kg)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Legacy Outlier Alpha', 5, 'Thoroughbred', 500),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Target Gold Beta', 4, 'Thoroughbred', 480);

-- INJECT: Legacy Outlier Alpha (Out of Target Ranges - Simulating Biological Stress)
INSERT INTO public.bio_logs (horse_id, trainer_id, urine_brix, default_conductivity_ms, urine_ph, saliva_ph, notes)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 
   7.5,     -- High Sugar (Target is 3-4%)
   22.0,    -- Conductivity conversion: 22.0 * 1.43 = 31.46C (Way above 15-20C target)
   5.5,     -- Acidic pH (Target is 6.4-7.0)
   5.8, 
   'Legacy Scraping Note: Horse showing structural fatigue. High sugar and extreme salt conductivity entirely off target.');

-- INJECT: Target Gold Beta (Exactly mapped to the 'Triple Healing' requirements)
INSERT INTO public.bio_logs (horse_id, trainer_id, urine_brix, default_conductivity_ms, urine_ph, saliva_ph, notes)
VALUES 
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 
   3.5,     -- PERFECT Sugar Baseline (Target: 3-4%)
   12.5,    -- Conductivity conversion: 12.5 * 1.43 = 17.87C (DEAD CENTER of 15-20C Target)
   6.8,     -- PERFECT pH (Target: 6.4-7.0)
   6.6, 
   'TRIPLE HEALING STATUS CONFIRMED. Optimal biological output. All three metric benchmarks achieved without guessing.');
