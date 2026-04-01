created: 30/03/2026
status: active

# Decision 007: Domain Stabilisation

## Problem
Domain precisionperformance.com.au reverts to the legacy Manus workspace URL in the address bar.

## Root Cause (Confirmed)
Active **"Domain Forwarding"** at GoDaddy registrar level rather than DNS A-Record pointing.
GoDaddy Forwarding is a 301 redirect — it pushes the browser to the destination URL, changing the address bar.
We need DNS-level pointing, which keeps the URL static and serves content transparently.

## Fix
1. In GoDaddy: **Disable/Delete** any "Domain Forwarding" rules for precisionperformance.com.au.
2. In GoDaddy DNS: Set exactly these records and nothing else for root (@) and www:
   - A Record: `@` → `76.76.21.21` (Vercel Edge)
   - CNAME: `www` → `cname.vercel-dns.com`
3. In Vercel: Confirm the domain is added under Settings → Domains.

## Philosophy
"Clinical Authority" — The .au domain must remain static in the address bar to maintain elite branding.
