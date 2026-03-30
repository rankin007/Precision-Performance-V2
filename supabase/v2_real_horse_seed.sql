-- PRECISION PERFORMANCE V2: REAL TEST HORSE SEED (LEGACY SYNC)
-- Target Project: ukqncqjhnokxlvfifeyn.supabase.com
-- Data Source: Equine Precision Real Data Collected V4.docx

-- 0. PREPARATION (Assumes Schema is already successful)
-- Replace '00000000-0000-0000-0000-000000000001' with your real Trainer ID from the 'trainers' table if needed.
-- For this seed, we will use a generated UUID for the Trainer to establish the link.

-- 1. INSERT REAL TRAINER & CLIENT (For Testing)
-- Note: Replace with actual Auth IDs if you want to test with your login.
INSERT INTO public.trainers (id, full_name, stable_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Phillip Rankin', 'Precision Performance Stables')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.clients (id, full_name)
VALUES ('00000000-0000-0000-0000-000000000002', 'Elite Ownership Group')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERT 10 REAL HORSES
INSERT INTO public.horses (id, name, trainer_id, client_id, default_weight_kg)
VALUES 
  (uuid_generate_v4(), 'Autum', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 490),
  (uuid_generate_v4(), 'Deloviere', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 510),
  (uuid_generate_v4(), 'Lunar Lover', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 485),
  (uuid_generate_v4(), 'Idle Flyer', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 505),
  (uuid_generate_v4(), 'Inn Count', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 520),
  (uuid_generate_v4(), 'Midiaro', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 495),
  (uuid_generate_v4(), 'Mountain Queen', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 500),
  (uuid_generate_v4(), 'Golden Standard', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 515),
  (uuid_generate_v4(), 'Febright', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 480),
  (uuid_generate_v4(), 'Blue Squares', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 500);

-- 3. INJECT BIO LOGS (Example Data points from Legacy Archive)
-- Feb 5th entry mentioned in docs
INSERT INTO public.bio_logs (horse_id, trainer_id, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT id, trainer_id, 4.5, 7.96, 15.0, 'Legacy Entry: Feb 5th Race Prep. Target pH and Carbs nearly achieved.' 
FROM public.horses WHERE name = 'Golden Standard';

-- High Energy Waste entries (Attempt 1 standard)
INSERT INTO public.bio_logs (horse_id, trainer_id, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT id, trainer_id, 9.0, 8.2, 25.0, 'Legacy Entry: Pre-V2. High turbidity/wasted energy detected.' 
FROM public.horses WHERE name IN ('Autum', 'Deloviere', 'Lunar Lover');

-- Triple Healing Target entries (V2 Goal)
INSERT INTO public.bio_logs (horse_id, trainer_id, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT id, trainer_id, 3.5, 6.8, 12.5, 'V2 Validation: Triple Healing Gold achieved. No Guessing.' 
FROM public.horses WHERE name IN ('Febright', 'Mountain Queen');
