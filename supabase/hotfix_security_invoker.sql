-- ============================================================
-- HOTFIX: Resolve Supabase Security Advisory
-- Entity : public.vw_daily_metrics_summary
-- Issue  : View defined with implicit SECURITY DEFINER
-- Fix    : Recreate with SECURITY INVOKER (respects RLS)
-- Also   : Switch get_clinical_history() to SECURITY INVOKER
-- ============================================================

-- Step 1: Drop and recreate the view with SECURITY INVOKER
DROP VIEW IF EXISTS public.vw_daily_metrics_summary;

CREATE VIEW public.vw_daily_metrics_summary
WITH (security_invoker = true)
AS
SELECT
    horse_id,
    DATE(created_at)                     AS log_date,
    ROUND(AVG(urine_brix), 2)            AS avg_brix,
    ROUND(AVG(urine_salts_c), 2)         AS avg_salts_c,
    ROUND(AVG(urine_ph), 2)              AS avg_urine_ph,
    ROUND(AVG(saliva_ph), 2)             AS avg_saliva_ph,
    bool_and(is_healing_brix)            AS all_healing_brix,
    bool_and(is_healing_salts)           AS all_healing_salts,
    bool_and(is_healing_ph_urine)        AS all_healing_ph
FROM
    public.bio_logs
GROUP BY
    horse_id, DATE(created_at);

-- Step 2: Replace get_clinical_history with SECURITY INVOKER
CREATE OR REPLACE FUNCTION get_clinical_history(p_horse_id UUID, p_days INT)
RETURNS TABLE (
    log_date       DATE,
    avg_brix       NUMERIC,
    avg_salts_c    NUMERIC,
    avg_urine_ph   NUMERIC,
    avg_saliva_ph  NUMERIC,
    is_healing_brix  BOOLEAN,
    is_healing_salts BOOLEAN,
    is_healing_ph    BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        v.log_date,
        v.avg_brix,
        v.avg_salts_c,
        v.avg_urine_ph,
        v.avg_saliva_ph,
        v.all_healing_brix,
        v.all_healing_salts,
        v.all_healing_ph
    FROM
        public.vw_daily_metrics_summary v
    WHERE
        v.horse_id = p_horse_id
        AND v.log_date >= (CURRENT_DATE - p_days)
    ORDER BY
        v.log_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER
   SET search_path = public;
