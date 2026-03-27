created: 27/03/2026
last_updated: 27/03/2026
status: active

# Project 013: Beta Staging Deployment

## Objective
Deploy a fully functional "Beta" version of PrecisionPerformance.com to Vercel and Railway, connected to the live Supabase production database.

## Requirements
- **Staging URL:** A private, password-protected Vercel deployment for internal testing.
- **Formula Verification:** Live testing of the $C = ms \times 1.43$ conversion logic within the UI.
- **Report Validation:** Ensuring the "Healing Report" correctly flags horses in the 3-4% (Sugars) and 15-20C (Salts) ranges.
- **Note Persistence:** Verifying that Hydration and Feeding notes are correctly saved and retrieved.

## Status
- [ ] Production Environment Variable Sync
- [ ] Vercel Deployment Trigger
- [ ] Smoke Test: Login -> Input Data -> View Report
