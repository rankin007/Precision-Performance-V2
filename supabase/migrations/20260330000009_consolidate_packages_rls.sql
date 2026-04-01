-- Migration: Consolidate multiple permissive SELECT policies on public.packages
-- Advisory : Table public.packages has multiple permissive policies for role anon
--            for action SELECT.
--            Policies: "Admins can manage packages", "Everyone can view packages"
--
-- Root cause: FOR ALL implicitly includes SELECT. Combined with a separate public
--             SELECT policy this creates two permissive SELECT evaluations per row.
--
-- Fix       : One public SELECT policy + three explicit admin write policies
--             (INSERT / UPDATE / DELETE). No FOR ALL — SELECT overlap eliminated.

-- Step 1: Drop all existing conflicting policies
DROP POLICY IF EXISTS "Everyone can view packages"      ON public.packages;
DROP POLICY IF EXISTS "Admins can manage packages"      ON public.packages;
DROP POLICY IF EXISTS "Packages are publicly viewable"  ON public.packages;

-- Step 2: Single SELECT policy — public read (anon + authenticated)
CREATE POLICY "Packages are publicly viewable"
    ON public.packages
    FOR SELECT
    USING (true);

-- Step 3: Explicit admin write policies — no SELECT, no overlap
CREATE POLICY "Admins can insert packages"
    ON public.packages
    FOR INSERT
    WITH CHECK ((auth.jwt() ->> 'user_role') = 'admin');

CREATE POLICY "Admins can update packages"
    ON public.packages
    FOR UPDATE
    USING  ((auth.jwt() ->> 'user_role') = 'admin')
    WITH CHECK ((auth.jwt() ->> 'user_role') = 'admin');

CREATE POLICY "Admins can delete packages"
    ON public.packages
    FOR DELETE
    USING ((auth.jwt() ->> 'user_role') = 'admin');
