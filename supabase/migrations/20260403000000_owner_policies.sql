-- PRECISION PERFORMANCE V3: OWNER SECURITY POLICIES
-- Target: Phase 5.2 - Client/Owner Access

-- 1. HORSES: Owners can only see horses they have an ownership stake in
DROP POLICY IF EXISTS "Owners can view owned horses" ON public.horses;
CREATE POLICY "Owners can view owned horses" ON public.horses
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.horse_ownership 
        WHERE horse_id = public.horses.id 
        AND owner_id = auth.uid()
    )
);

-- 2. DAILY RECORDS: Owners can see clinical record headers for their horses
DROP POLICY IF EXISTS "Owners can view logs for owned horses" ON public.daily_records;
CREATE POLICY "Owners can view logs for owned horses" ON public.daily_records
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.horse_ownership 
        WHERE horse_id = public.daily_records.horse_id 
        AND owner_id = auth.uid()
    )
);

-- 3. BIOCHEMISTRY LOGS: Owners can see the actual RBTI telemetry
DROP POLICY IF EXISTS "Owners can view biochemistry for owned horses" ON public.biochemistry_logs;
CREATE POLICY "Owners can view biochemistry for owned horses" ON public.biochemistry_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.daily_records dr
        JOIN public.horse_ownership ho ON dr.horse_id = ho.horse_id
        WHERE dr.id = public.biochemistry_logs.record_id
        AND ho.owner_id = auth.uid()
    )
);

-- 4. PHYSICAL LOGS: Owners can see weight/temp/water
DROP POLICY IF EXISTS "Owners can view physical logs for owned horses" ON public.physical_logs;
CREATE POLICY "Owners can view physical logs for owned horses" ON public.physical_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.daily_records dr
        JOIN public.horse_ownership ho ON dr.horse_id = ho.horse_id
        WHERE dr.id = public.physical_logs.record_id
        AND ho.owner_id = auth.uid()
    )
);

-- 5. STABLES: Owners can view the stable branding for their horses
DROP POLICY IF EXISTS "Owners can view associated stables" ON public.stables;
CREATE POLICY "Owners can view associated stables" ON public.stables
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.horses h
        JOIN public.horse_ownership ho ON h.id = ho.horse_id
        WHERE h.stable_id = public.stables.id
        AND ho.owner_id = auth.uid()
    )
);
