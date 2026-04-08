---
name: Vercel Deployment
description: Operational workflow for Vercel project management, domains, and edge deployments.
tags: [deployment, vercel, frontend, edge]
---

# Vercel Deployment Skill

## Objective
To ensure stable, performant, and correctly routed delivery of the Precision Performance frontend across all environments.

## Scope
- Managing project settings and environment variables.
- Domain stability and DNS configuration (Edge network).
- Deploying preview and production builds.
- Routing stability and Middleware configuration.

## Standard Workflows

### 1. Domain Stabilisation
- Ensure DNS A-Records point to `76.76.21.21`.
- CNAME records point to `cname.vercel-dns.com`.
- Verify domain ownership and SSL certificate status in the Vercel Dashboard.

### 2. Environment Management
- Synchronize `.env.local` with Vercel Project Settings → Environment Variables.
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct for the target environment.

### 3. Monitoring & Deploys
- Builds are triggered automatically by Git pushes to the `main` branch (Production) or other branches (Preview).
- If a build fails, check the "Build Logs" in Vercel for the specific error ID.
- Common issues: Missing environment variables or Next.js type-check errors.

## Troubleshooting
- **404: DEPLOYMENT_NOT_FOUND**: This indicates the domain is pointed to Vercel but not yet added/claimed in the Vercel Dashboard project settings.
- **Redirection Loops**: Check `middleware.ts` for conflicting redirect logic.

## References
- `next.config.ts`
- `middleware.ts`
- [Vercel Docs](https://vercel.com/docs)
