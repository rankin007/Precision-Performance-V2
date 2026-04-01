-- Migration: Fix RLS Initialisation Plan — wrap all auth.* calls in (select ...)
-- Advisory : RLS policies re-evaluate auth.uid() / auth.jwt() per row.
-- Fix      : Wrap every auth.<fn>() call in (select auth.<fn>()) so Postgres
--            evaluates it once per query plan, not once per row.
-- Scope    : All tables confirmed to exist in the live database.
-- NOTE     : public.performance_metrics does not exist in live DB — omitted.
--            Commerce tables (products/orders/order_items) are guarded.

-- ============================================================
-- 1. public.horses
-- ============================================================
DROP POLICY IF EXISTS "Trainers view own horses"    ON public.horses;
DROP POLICY IF EXISTS "Trainers manage own horses"  ON public.horses;
DROP POLICY IF EXISTS "Clients view own horses"     ON public.horses;

CREATE POLICY "Trainers view own horses" ON public.horses
    FOR SELECT USING ((select auth.uid()) = trainer_id);

CREATE POLICY "Trainers manage own horses" ON public.horses
    FOR ALL USING ((select auth.uid()) = trainer_id);

CREATE POLICY "Clients view own horses" ON public.horses
    FOR SELECT USING ((select auth.uid()) = client_id);

-- ============================================================
-- 2. public.bio_logs
-- ============================================================
DROP POLICY IF EXISTS "Trainers view bio logs for their horses"   ON public.bio_logs;
DROP POLICY IF EXISTS "Trainers insert bio logs for their horses" ON public.bio_logs;
DROP POLICY IF EXISTS "Clients view bio logs for their horses"    ON public.bio_logs;

CREATE POLICY "Trainers view bio logs for their horses" ON public.bio_logs
    FOR SELECT USING (
        horse_id IN (
            SELECT id FROM public.horses WHERE trainer_id = (select auth.uid())
        )
    );

CREATE POLICY "Trainers insert bio logs for their horses" ON public.bio_logs
    FOR INSERT WITH CHECK (
        horse_id IN (
            SELECT id FROM public.horses WHERE trainer_id = (select auth.uid())
        )
    );

CREATE POLICY "Clients view bio logs for their horses" ON public.bio_logs
    FOR SELECT USING (
        horse_id IN (
            SELECT id FROM public.horses WHERE client_id = (select auth.uid())
        )
    );

-- ============================================================
-- 3. public.products (guarded — skipped if table does not exist)
-- ============================================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'products'
    ) THEN
        DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
        DROP POLICY IF EXISTS "Products are viewable by all authenticated users." ON public.products;
        EXECUTE $p$
            CREATE POLICY "Products are viewable by all authenticated users."
                ON public.products FOR SELECT
                USING ((select auth.role()) = 'authenticated');
        $p$;
    END IF;
END;
$$;

-- ============================================================
-- 4. public.orders (guarded — skipped if table does not exist)
-- ============================================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'orders'
    ) THEN
        DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
        DROP POLICY IF EXISTS "Orders are viewable by the trainer who placed them." ON public.orders;
        EXECUTE $p$
            CREATE POLICY "Users view own orders"
                ON public.orders FOR SELECT
                USING ((select auth.uid()) = user_id);
        $p$;
        EXECUTE $p$
            CREATE POLICY "Orders are viewable by the trainer who placed them."
                ON public.orders FOR SELECT
                USING ((select auth.uid()) = trainer_id);
        $p$;
    END IF;
END;
$$;

-- ============================================================
-- 5. public.order_items (guarded — skipped if table does not exist)
-- ============================================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'order_items'
    ) THEN
        DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
        EXECUTE $p$
            CREATE POLICY "Users view own order items"
                ON public.order_items FOR SELECT
                USING (
                    order_id IN (
                        SELECT id FROM public.orders WHERE user_id = (select auth.uid())
                    )
                );
        $p$;
    END IF;
END;
$$;

-- ============================================================
-- 6. public.profiles
-- ============================================================
DROP POLICY IF EXISTS "Profiles are viewable by owner or admin" ON public.profiles;

CREATE POLICY "Profiles are viewable by owner or admin"
    ON public.profiles
    FOR SELECT
    USING (
        (select auth.uid()) = id
        OR (select auth.jwt() ->> 'user_role') = 'admin'
    );

-- ============================================================
-- 7. public.trainers
-- ============================================================
DROP POLICY IF EXISTS "Trainers can view own profile"    ON public.trainers;
DROP POLICY IF EXISTS "Trainers can insert own profile"  ON public.trainers;
DROP POLICY IF EXISTS "Trainers can update own profile"  ON public.trainers;
DROP POLICY IF EXISTS "Admins can delete trainers"       ON public.trainers;

CREATE POLICY "Trainers can view own profile" ON public.trainers
    FOR SELECT
    USING (
        (select auth.uid()) = id
        OR (select auth.jwt() ->> 'user_role') = 'admin'
    );

CREATE POLICY "Trainers can insert own profile" ON public.trainers
    FOR INSERT
    WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Trainers can update own profile" ON public.trainers
    FOR UPDATE
    USING     ((select auth.uid()) = id)
    WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Admins can delete trainers" ON public.trainers
    FOR DELETE
    USING ((select auth.jwt() ->> 'user_role') = 'admin');

-- ============================================================
-- 8. public.clients
-- ============================================================
DROP POLICY IF EXISTS "Clients can view own profile"    ON public.clients;
DROP POLICY IF EXISTS "Clients can insert own profile"  ON public.clients;
DROP POLICY IF EXISTS "Clients can update own profile"  ON public.clients;
DROP POLICY IF EXISTS "Admins can delete clients"       ON public.clients;

CREATE POLICY "Clients can view own profile" ON public.clients
    FOR SELECT
    USING (
        (select auth.uid()) = id
        OR (select auth.jwt() ->> 'user_role') = 'admin'
        OR EXISTS (
            SELECT 1 FROM public.horses
            WHERE horses.client_id = clients.id
              AND horses.trainer_id = (select auth.uid())
        )
    );

CREATE POLICY "Clients can insert own profile" ON public.clients
    FOR INSERT
    WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Clients can update own profile" ON public.clients
    FOR UPDATE
    USING     ((select auth.uid()) = id)
    WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Admins can delete clients" ON public.clients
    FOR DELETE
    USING ((select auth.jwt() ->> 'user_role') = 'admin');

-- ============================================================
-- 9. public.packages
-- ============================================================
DROP POLICY IF EXISTS "Packages are publicly viewable" ON public.packages;
DROP POLICY IF EXISTS "Admins can insert packages"     ON public.packages;
DROP POLICY IF EXISTS "Admins can update packages"     ON public.packages;
DROP POLICY IF EXISTS "Admins can delete packages"     ON public.packages;

CREATE POLICY "Packages are publicly viewable"
    ON public.packages
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert packages"
    ON public.packages
    FOR INSERT
    WITH CHECK ((select auth.jwt() ->> 'user_role') = 'admin');

CREATE POLICY "Admins can update packages"
    ON public.packages
    FOR UPDATE
    USING     ((select auth.jwt() ->> 'user_role') = 'admin')
    WITH CHECK ((select auth.jwt() ->> 'user_role') = 'admin');

CREATE POLICY "Admins can delete packages"
    ON public.packages
    FOR DELETE
    USING ((select auth.jwt() ->> 'user_role') = 'admin');
