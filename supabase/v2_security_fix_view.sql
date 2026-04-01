-- SECURITY FIX: vw_daily_metrics_summary
-- Issue: View was implicitly using SECURITY DEFINER (creator's permissions),
--        which can bypass Row Level Security policies.
-- Fix:   Recreate the view with SECURITY INVOKER so it respects the
--        calling user's RLS permissions at all times.
-- Philosophy: "No Guessing" Zero Trust — every query runs as the authenticated user.

DROP VIEW IF EXISTS public.vw_daily_metrics_summary;

CREATE VIEW public.vw_daily_metrics_summary
WITH (security_invoker = true)
AS
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
