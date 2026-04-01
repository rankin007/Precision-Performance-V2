-- PRECISION PERFORMANCE V2: LEGACY DATA V4 INJECTION
-- Source: "Equine Precision Real Data Collected V4.docx"
-- Data Alchemist: Verified via ms × 1.43 multiplier. "No Guessing."
-- Target: bio_logs table in production Supabase instance ukqncqjhnokxlvfifeyn

-- NOTE: Run AFTER v2_real_horse_seed.sql so horse IDs exist.
-- Replace horse name lookups with the actual UUIDs if needed.

-- Helper to insert a log by horse name (avoids needing UUIDs manually)
WITH horse_lookup AS (
  SELECT id, name FROM public.horses
)

-- Golden Standard: Feb 5th race-prep entry (BEST SCORE from legacy doc)
-- Brix 4.5, pH urine 7.96 → CLOSE to healing zone; race won on this day
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-02-05 05:00:00+10', 4.5, 7.96, 15.0,
  'Legacy V4 Entry — Feb 5 race win. Brix 4.5, pH 7.96. Closest to Triple Healing zone. Race result: 1st place.'
FROM public.horses h WHERE h.name = 'Golden Standard';

-- Autum: Standard monitoring entries (High energy waste phase)
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-02-10 05:30:00+10', 5.5, 8.6, 22.5,
  'Legacy V4 — High carb waste. Brix 5.5 (AVG from doc: 6.1). pH 8.6 — above target. Turbidity detected.'
FROM public.horses h WHERE h.name = 'Autum';

INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-02-15 05:30:00+10', 5.4, 8.4, 21.8,
  'Legacy V4 — Slight improvement. Brix reducing toward target (4.0). pH still elevated.'
FROM public.horses h WHERE h.name = 'Autum';

INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-01 05:30:00+10', 4.8, 7.7, 19.2,
  'Legacy V4 — Continued progression. Brix tracking lower. Hydration improvement noted.'
FROM public.horses h WHERE h.name = 'Autum';

-- Deloviere: Pre-race intervention protocol
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-02-12 05:00:00+10', 7.8, 8.0, 23.3,
  'Legacy V4 — Outlier entry. Brix 7.8 (extreme). Classified as WEAKEST LINK in legacy summary.'
FROM public.horses h WHERE h.name = 'Deloviere';

INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-05 05:00:00+10', 5.4, 8.0, 20.4,
  'Legacy V4 — Intervention successful. Brix dropping toward target. pH stabilising.'
FROM public.horses h WHERE h.name = 'Deloviere';

-- Lunar Lover: Approaching Triple Healing
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-02-20 05:00:00+10', 6.9, 8.4, 27.4,
  'Legacy V4 — Category: Blue Squares (needs improvement). High salts readings.'
FROM public.horses h WHERE h.name = 'Lunar Lover';

INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-10 05:00:00+10', 5.5, 7.5, 20.2,
  'Legacy V4 — Good downward trend. Approaching Proposed Goal Area per legacy chart.'
FROM public.horses h WHERE h.name = 'Lunar Lover';

-- Febright: High performer approaching healing gold
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-15 05:00:00+10', 3.8, 6.9, 13.5,
  'Legacy V4 — Near PROPOSED GOAL AREA. Triple Healing imminent. Extreme focus by trainer.'
FROM public.horses h WHERE h.name = 'Febright';

INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-20 05:00:00+10', 3.5, 6.8, 12.5,
  'V2 Validation: Triple Healing Gold confirmed. ms 12.5 → C 17.875. All targets met simultaneously.'
FROM public.horses h WHERE h.name = 'Febright';

-- Mountain Queen: V2 era perfect status
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-25 05:00:00+10', 3.4, 6.7, 12.0,
  'V2 Verified: Triple Healing status. C = 12.0 × 1.43 = 17.16. Stable performance peak.'
FROM public.horses h WHERE h.name = 'Mountain Queen';

-- Idle Flyer: Monitoring phase
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-18 05:00:00+10', 7.1, 9.0, 28.8,
  'Legacy V4 — FIO classification. Extreme numbers. Immediate diet intervention required.'
FROM public.horses h WHERE h.name = 'Idle Flyer';

-- Inn Count: Mid-progression
INSERT INTO public.bio_logs (horse_id, recorded_at, urine_brix, urine_ph, urine_salts_ms, observation_notes)
SELECT h.id, '2026-03-22 05:30:00+10', 4.8, 7.6, 17.4,
  'Legacy V4 — Standard monitoring. On trajectory. Brix target requires further reduction.'
FROM public.horses h WHERE h.name = 'Inn Count';
