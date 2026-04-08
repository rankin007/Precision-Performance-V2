-- Migration: Create be_kit_applications table
-- Created: 05/04/2026

CREATE TABLE IF NOT EXISTS public.be_kit_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    notes TEXT
);

-- Allow public insertion (Initial Application)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public submission of BE Kit applications" ON public.be_kit_applications;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;
CREATE POLICY "Allow public submission of BE Kit applications"
ON public.be_kit_applications
FOR INSERT
WITH CHECK (true);

-- Allow admins to view/manage applications
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated admins to manage BE Kit applications" ON public.be_kit_applications;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;
CREATE POLICY "Allow authenticated admins to manage BE Kit applications"
ON public.be_kit_applications
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Super Admin')
  )
);

-- Trigger for notification (Conceptual)
-- In a real system, this could trigger an Edge Function or Database Hook
COMMENT ON TABLE public.be_kit_applications IS 'Onboarding applications for the Professional BE Kit.';
