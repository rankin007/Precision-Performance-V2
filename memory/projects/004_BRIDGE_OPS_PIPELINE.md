created: 27/03/2026
last_updated: 27/03/2026
status: active

# Project 004: CI/CD Pipeline & Environment Architecture

## Objective
Establish the automated deployment pipelines and environment connective tissue using GitHub, Vercel, Railway, and Supabase.

## Requirements
- **Version Control:** Formalise the GitHub branch strategy (main, staging, feature/*).
- **Frontend Hosting:** Vercel deployment architecture for the Next.js multi-tenant portals, including Edge Middleware routing.
- **Backend/Cron:** Railway deployment for any scheduled background tasks (e.g., daily database backups or metric summaries).
- **Environment Variables:** Secure mapping of Supabase API keys, Stripe Webhook Secrets, and Vercel Tokens.

## Status
- [x] Create Environment Variable Template
- [x] Define GitHub Actions Workflow
- [x] Detail Vercel Production Build Configuration
