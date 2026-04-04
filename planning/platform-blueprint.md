# Platform Blueprint: PrecisionPerformance.com.au

## Current Status: PHASE 8 INSTANTIATED (Production Ready)
- **Architecture**: V3 Modular Core (Header + Log + Audit Tracker).
- **Core Modules**: Tactical Mobile Entry, Trainer Dashboard, Owner Command Center, Clinical Dispensary.
- **Security**: Full RLS Isolation across all roles.

## 1. Technical Stack (Master)
- **Primary Orchestration**: Antigravity.
- **Frontend / Website**: Next.js (App Router), deployed via **Vercel**.
- **Backend / Database / Auth**: **Supabase**.
- **Background Jobs / Services**: **Railway**.
- **Version Control**: GitHub.
- **DNS / Domain**: GoDaddy.

## 2. Environment Mapping
| Environment | URL | Purpose |
| :--- | :--- | :--- |
| **Development** | `localhost:3000` | Local coding and rapid iteration. |
| **Staging** | `precision-performance-stage.vercel.app` | Integration testing and user validation. |
| **Production** | `precisionperformance.com.au` | Live public and member operations. |

## 3. Integration Architecture
- **Supabase Realtime**: Used for live dashboard updates and record synchronization.
- **Supabase Edge Functions**: For payment webhooks (Stripe) and complex server-side logic.
- **Railway Jobs**: For scheduled reporting, weekly horse performance summaries, and email notifications.

## 4. Deployment Pipeline
- **Branch Strategy**:
    - `main` -> Production (Manual deploy).
    - `develop` -> Staging (Auto-deploy on push).
- **CI/CD**: GitHub Actions runs automated tests and triggers Vercel/Supabase deployments.

## 5. Security & Containment
- **Containment**: All application logic and database interactions must stay within the workspace hierarchy.
- **Zero Exposure**: No API keys or connection strings are stored in source code. All secrets are managed in the Vercel/Supabase dashboard.
- **Row-Level Security (RLS)**: Mandatory for all tables to ensure strict member isolation.

---
**Status**: ACTIVE
**Created**: 03/04/2026
**Owner**: Principal Orchestrator
