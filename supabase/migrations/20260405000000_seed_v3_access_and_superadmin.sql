-- V3 SEED & SUPER ADMIN ELEVATION
-- Purpose: Ensure membership levels exist and support 'Super Admin' role.

BEGIN;

-- 1. Ensure Membership Levels exist (if not already seeded)
INSERT INTO public.membership_levels (name, description)
VALUES 
('Bronze', 'Standard data entry and physiological tracking.'),
('Silver', 'Enhanced trend reporting and diet history.'),
('Gold', 'Full stable analytics and team management.'),
('Platinum', 'Elite dashboard, track-weather correlation, and priority support.'),
('Admin', 'System-level access and permission management.')
ON CONFLICT (name) DO NOTHING;

-- 2. Update Profiles Role Check to include 'Super Admin'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('Trainer', 'Owner', 'Staff', 'Admin', 'Super Admin'));

-- 3. Ensure 'Super Admin' level exists in membership_levels
INSERT INTO public.membership_levels (name, description)
VALUES ('Super Admin', 'Total system oversight and forensic biological access.')
ON CONFLICT (name) DO NOTHING;

COMMIT;
