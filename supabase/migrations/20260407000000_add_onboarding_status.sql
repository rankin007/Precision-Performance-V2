-- Migration: Add onboarding status to profiles and link be_kit_applications
-- Created: 07/04/2026

-- 1. Add onboarding_completed flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

-- 2. Link be_kit_applications to profiles (Optionally)
ALTER TABLE public.be_kit_applications
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Update RLS for be_kit_applications to allow authenticated users to see their own application
CREATE POLICY "Allow users to view their own BE Kit application"
ON public.be_kit_applications
FOR SELECT
USING (auth.uid() = user_id);
