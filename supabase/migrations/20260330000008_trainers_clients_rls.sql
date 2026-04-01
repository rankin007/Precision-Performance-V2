-- Migration: Add missing RLS policies for public.trainers and public.clients
-- Advisory : Table public.trainers has RLS enabled but no policies exist.
--            (public.clients has the same gap — fixed here proactively.)
--
-- Data model:
--   trainers.id = auth.users(id)  → the trainer IS the authenticated user
--   clients.id  = auth.users(id)  → the client  IS the authenticated user
--
-- Access rules:
--   SELECT : own row only, OR admin
--   INSERT : own row only (self-registration on sign-up)
--   UPDATE : own row only
--   DELETE : admin only (never self-delete; prevents orphaned horses/logs)

-- ============================================================
-- TRAINERS
-- ============================================================

-- Trainers can read their own profile row
CREATE POLICY "Trainers can view own profile"
    ON public.trainers
    FOR SELECT
    USING (
        auth.uid() = id
        OR (auth.jwt() ->> 'user_role') = 'admin'
    );

-- Trainers can insert their own row on registration
CREATE POLICY "Trainers can insert own profile"
    ON public.trainers
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Trainers can update their own profile (name, stable name, etc.)
CREATE POLICY "Trainers can update own profile"
    ON public.trainers
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only admins can delete trainer rows (cascade protects horses/logs)
CREATE POLICY "Admins can delete trainers"
    ON public.trainers
    FOR DELETE
    USING ((auth.jwt() ->> 'user_role') = 'admin');

-- ============================================================
-- CLIENTS
-- ============================================================

-- Clients can read their own profile row; trainers can also read
-- client rows for horses they manage (needed for stable portal)
CREATE POLICY "Clients can view own profile"
    ON public.clients
    FOR SELECT
    USING (
        auth.uid() = id
        OR (auth.jwt() ->> 'user_role') = 'admin'
        OR EXISTS (
            SELECT 1 FROM public.horses
            WHERE horses.client_id = clients.id
              AND horses.trainer_id = auth.uid()
        )
    );

-- Clients can insert their own row on registration
CREATE POLICY "Clients can insert own profile"
    ON public.clients
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Clients can update their own profile (name, contact number, etc.)
CREATE POLICY "Clients can update own profile"
    ON public.clients
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only admins can delete client rows
CREATE POLICY "Admins can delete clients"
    ON public.clients
    FOR DELETE
    USING ((auth.jwt() ->> 'user_role') = 'admin');
