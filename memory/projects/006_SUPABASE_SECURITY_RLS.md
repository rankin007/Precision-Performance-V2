created: 27/03/2026
last_updated: 27/03/2026
status: active

# Project 006: Row Level Security (RLS) & Multi-tenancy

## Objective
Implement strict Row Level Security (RLS) policies within Supabase to ensure complete data isolation between different stables, trainers, and clients.

## Requirements
- **Trainer Isolation:** Trainers can only `SELECT`, `INSERT`, `UPDATE`, or `DELETE` horses and bio-logs associated with their `trainer_id`.
- **Client Access:** Clients are granted read-only (`SELECT`) access to specific horses they own, verified via a `horse_ownership` junction table.
- **Admin Oversight:** Internal PrecisionPerformance.com accounts must have overarching 'Service Role' access for support and analysis.
- **Audit Logs:** Every change to a bio-log (Brix, pH, etc.) must be timestamped and attributed to a specific user ID.

## Status
- [ ] RLS Policy Drafting
- [ ] Junction Table for Client-Horse Mapping
- [ ] Policy Testing in SQL Editor
