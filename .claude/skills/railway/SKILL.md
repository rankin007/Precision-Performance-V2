---
name: Railway Management
description: Operational workflow for background jobs, services, and auxiliary APIs.
tags: [backend, services, workers, railway]
---

# Railway Management Skill

## Objective
To govern the execution of background processing and auxiliary services for the Precision Performance ecosystem.

## Scope
- Managing background service deployments.
- Configuring environment variables for service connectivity.
- Monitoring service logs and uptime.
- Managing auxiliary APIs or scheduled jobs.

## Standard Workflows

### 1. Service Deployment
- Services are automatically built and deployed via the GitHub integration on the `main` branch.
- Ensure the presence of a `Dockerfile` or `Procfile` for the service to be correctly identified by Railway.

### 2. Connectivity & Env Vars
- Synchronize secret variables between Supabase (for API access) and Railway.
- Use Railway's internal service networking (e.g., `${{service_name.RAILWAY_TCP_PROXY_PORT}}`) for intra-project communication where required.

### 3. Monitoring
- View live logs in the Railway Dashboard to monitor the health of recurring jobs or background workers.
- Set up alerts within the Railway Dashboard for deployment failures or service crashes.

## Troubleshooting
- **Build Failure**: Often caused by incompatible Node.js versions or missing build scripts. Ensure equality between `package.json` in the root and the service requirements.
- **Port Conflicts**: Ensure your service listens on `0.0.0.0` and uses the `$PORT` environment variable provided by Railway.

## References
- `package.json`
- [Railway Docs](https://docs.railway.app)
