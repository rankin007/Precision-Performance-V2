-- Migration: Consolidate multiple permissive SELECT policies on public.profiles
-- Advisory : Table public.profiles has multiple permissive policies for role
--            dashboard_user for action SELECT.
--            Policies: "Admins can view all profiles", "Users can view own profile"
--
-- Fix      : Drop both policies and replace with a single unified policy using OR.
--            PostgreSQL evaluates all permissive policies with OR anyway — merging
--            them into one prevents redundant evaluation on every query.
--
-- Logic    : A user may SELECT a profile row if:
--              (a) the row belongs to them (auth.uid() = id), OR
--              (b) they have the 'admin' role in their JWT claims

-- Step 1: Drop the two conflicting policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;

-- Step 2: Single unified SELECT policy
CREATE POLICY "Profiles are viewable by owner or admin"
    ON public.profiles
    FOR SELECT
    USING (
        auth.uid() = id
        OR
        (auth.jwt() ->> 'user_role') = 'admin'
    );
