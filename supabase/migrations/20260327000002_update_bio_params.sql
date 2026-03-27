-- Migration: Update Bio Logs for RBTI Constraints & Computed Salts
-- Philosophy: "Go by the Numbers, No Guessing"

ALTER TABLE public.bio_logs
  DROP CONSTRAINT IF EXISTS bio_logs_urine_brix_check,
  DROP CONSTRAINT IF EXISTS bio_logs_urine_ph_check,
  DROP CONSTRAINT IF EXISTS bio_logs_saliva_ph_check,
  DROP CONSTRAINT IF EXISTS bio_logs_urine_conductivity_check;

ALTER TABLE public.bio_logs
  -- Add new column for ms input
  ADD COLUMN IF NOT EXISTS urine_salts_ms NUMERIC(6,2) CHECK (urine_salts_ms >= 0),
  -- Add generated column for Conductivity (C) using the 1.43 formula
  ADD COLUMN IF NOT EXISTS urine_salts_c NUMERIC(6,2) GENERATED ALWAYS AS (urine_salts_ms * 1.43) STORED,
  
  -- Add target healing range booleans for rapid query execution
  ADD COLUMN IF NOT EXISTS is_healing_brix BOOLEAN GENERATED ALWAYS AS (urine_brix >= 3.0 AND urine_brix <= 4.0) STORED,
  ADD COLUMN IF NOT EXISTS is_healing_ph_urine BOOLEAN GENERATED ALWAYS AS (urine_ph >= 6.4 AND urine_ph <= 7.0) STORED,
  ADD COLUMN IF NOT EXISTS is_healing_ph_saliva BOOLEAN GENERATED ALWAYS AS (saliva_ph >= 6.4 AND saliva_ph <= 7.0) STORED,
  ADD COLUMN IF NOT EXISTS is_healing_salts BOOLEAN GENERATED ALWAYS AS ((urine_salts_ms * 1.43) >= 15.0 AND (urine_salts_ms * 1.43) <= 20.0) STORED;

-- Enforce strict operational range constraints preventing bad data ingestion
ALTER TABLE public.bio_logs
  ADD CONSTRAINT bio_logs_urine_brix_check CHECK (urine_brix >= 0 AND urine_brix <= 13),
  ADD CONSTRAINT bio_logs_salts_c_check CHECK (urine_salts_ms * 1.43 >= 0 AND urine_salts_ms * 1.43 <= 70),
  ADD CONSTRAINT bio_logs_urine_ph_check CHECK (urine_ph >= 0 AND urine_ph <= 10),
  ADD CONSTRAINT bio_logs_saliva_ph_check CHECK (saliva_ph >= 0 AND saliva_ph <= 10);
