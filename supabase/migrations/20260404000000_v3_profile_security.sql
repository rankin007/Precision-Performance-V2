-- V3 PROFILE SECURITY: ESSENTIAL RLS POLICIES
-- Target: Fix signup/login profile instantiation

-- 1. SELECT: Users can view their own profile, Admins see all
DROP POLICY IF EXISTS "Profiles are viewable by owner or admin" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner or admin"
    ON public.profiles
    FOR SELECT
    USING (
        auth.uid() = id
        OR
        (auth.jwt() ->> 'user_role') = 'admin'
    );

-- 2. INSERT: Users can create their own profile during signup
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() = id
    );

-- 3. UPDATE: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (
        auth.uid() = id
    )
    WITH CHECK (
        auth.uid() = id
    );
