-- Migration: Consolidate multiple permissive SELECT policies on public.horses
-- Advisory : Table public.horses has multiple permissive policies for role anon
--            for action SELECT.
--            Policies: "Clients view own horses", "Trainers manage own horses", "Trainers view own horses"
--
-- Fix       : Replace overlapping policies with one optimized SELECT policy
--             and explicit write policies for trainers/admins.
--             Uses (select auth.*) subqueries for performance.

-- Step 1: Drop all existing conflicting policies
DROP POLICY IF EXISTS "Trainers view own horses"   ON public.horses;
DROP POLICY IF EXISTS "Trainers manage own horses" ON public.horses;
DROP POLICY IF EXISTS "Clients view own horses"    ON public.horses;
DROP POLICY IF EXISTS "Horses are viewable by owner or trainer" ON public.horses;

-- Step 2: Single unified SELECT policy
-- Covers Trainers, Clients, and Admins
CREATE POLICY "Horses are viewable by owner, trainer or admin"
    ON public.horses
    FOR SELECT
    USING (
        (select auth.uid()) = trainer_id 
        OR 
        (select auth.uid()) = client_id
        OR
        (select auth.jwt() ->> 'user_role') = 'admin'
    );

-- Step 3: Explicit write policies (Trainers and Admins)
CREATE POLICY "Trainers and admins can insert horses"
    ON public.horses
    FOR INSERT
    WITH CHECK (
        (select auth.uid()) = trainer_id
        OR
        (select auth.jwt() ->> 'user_role') = 'admin'
    );

CREATE POLICY "Trainers and admins can update horses"
    ON public.horses
    FOR UPDATE
    USING (
        (select auth.uid()) = trainer_id
        OR
        (select auth.jwt() ->> 'user_role') = 'admin'
    )
    WITH CHECK (
        (select auth.uid()) = trainer_id
        OR
        (select auth.jwt() ->> 'user_role') = 'admin'
    );

CREATE POLICY "Trainers and admins can delete horses"
    ON public.horses
    FOR DELETE
    USING (
        (select auth.uid()) = trainer_id
        OR
        (select auth.jwt() ->> 'user_role') = 'admin'
    );
