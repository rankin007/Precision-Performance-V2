created: 27/03/2026
last_updated: 27/03/2026
status: active

# Project 025: GoDaddy DNS Migration & Production Launch

## Objective
Finalise the "Staging to Production" pipeline by routing `precisionperformance.com.au` through GoDaddy's DNS to the Vercel edge network.

## Requirements
- **Zone configuration:** Map the Apex domain (A Record) and `www` subdomain (CNAME) strictly to Vercel's global IP targets.
- **SSL Provisioning:** Automatically provision Let's Encrypt certificates post-propagation.
- **Root Redirect:** Force `www` traffic to resolve to the absolute root domain.

## Status
- [ ] Vercel Apex A-Record `76.76.21.21` alignment
- [ ] Vercel `www` CNAME targeting
- [ ] Production Build Link Crawl
