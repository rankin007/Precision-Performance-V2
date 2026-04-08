---
name: Supabase Management
description: Operational workflow for Supabase database, migrations, and auth.
tags: [database, auth, backend, migration]
---

# Supabase Management Skill

## Objective
To maintain the integrity and security of the Precision Performance backend by governing database migrations, RLS policies, and authentication hooks.

## Scope
- Managing the `supabase/` directory.
- Authoring and validating migrations.
- Implementing Row Level Security (RLS) policies.
- Configuring Auth hooks and metadata.

## Standard Workflows

### 1. Authoring Migrations
- Create a new migration file in `supabase/migrations/` using the date-prefixed format `YYYYMMDDHHMMSS_description.sql`.
- Ensure migrations are idempotent (using `IF NOT EXISTS` or dropping existing policies/tables safely).

### 2. Pushing to Production
- Use the Supabase CLI: `supabase db push`.
- Always verify migrations against a local instance or staging environment first.

### 3. Row Level Security (RLS)
- Every table MUST have RLS enabled.
- Distinct policies should exist for `Anon`, `Client`, `Trainer`, `Staff`, and `Admin`.
- Audit logs should be kept for material administrative changes.

## Troubleshooting
- If a migration fails, inspect the `supabase start` logs to identify conflict points.
- Use `supabase db lint` to check for security vulnerabilities or performance issues.

## References
- `supabase/migrations/`
- [Supabase Docs](https://supabase.com/docs)
