# Membership Model: PrecisionPerformance.com.au

## 1. Modular Membership Logic
As defined in the project plan, the membership system must be **data-driven**, not hard-coded. Access is determined by a combination of levels, permissions, and entity associations.

## 2. Core Entities
- **Users**: Authentication layer (linked to Supabase Auth).
- **Profiles**: Extended user metadata (Full name, Role, Stable Association).
- **Levels**: Named membership tiers (e.g., Bronze, Silver, Gold). These are entries in the `membership_levels` table.
- **Permissions**: Granular actions or content access (e.g., `view_reports`, `edit_horse`, `access_shop`).
- **Associations**: Row-level relationships (e.g., a Trainer is associated with a Stable, and an Owner is associated with a Horse).

## 3. The Permission Join Table
The relationship between Levels and Permissions is **Many-to-Many**.
- `membership_levels` table stores tier names and IDs.
- `permissions` table stores action capability strings.
- `level_permissions` (join table) maps which permissions are granted to each level.

## 4. Role-Based Overlays
While permissions are granular, roles (Trainer, Owner, Staff) provide default navigation and UI contexts:
- **Trainer**: Full operational view, stable management, and physiology reporting.
- **Owner**: Personal horse dashboard, billing, and progress certificates.
- **Staff**: Mobile-first data-entry interface and task validation.

## 5. Security Architecture (RLS)
The platform uses **Supabase Row Level Security (RLS)** to enforce access boundaries:
- **Private Data Isolation**: A user can only see data they are explicitly associated with via the `user_assignments` table.
- **Inherited Access**: Permission to view a Stable automatically grants permission to view all Horses within that Stable.

---
**Status**: ACTIVE
**Created**: 03/04/2026
**Owner**: Principal Orchestrator
