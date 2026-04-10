-- Migration: Add portal_access_granted column for manual approval gate
-- This flag is the definitive access control for portal entry.
-- onboarding_completed = user submitted BE Kit form
-- portal_access_granted = Principal Orchestrator has reviewed and granted access

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS portal_access_granted boolean NOT NULL DEFAULT false;

-- Super Admin and Admin accounts are pre-approved
UPDATE profiles
  SET portal_access_granted = true
  WHERE role IN ('Super Admin', 'Admin');

COMMENT ON COLUMN profiles.portal_access_granted IS
  'Set to true by the Principal Orchestrator after manual review of the BE Kit application. Controls portal access independently of onboarding_completed.';
