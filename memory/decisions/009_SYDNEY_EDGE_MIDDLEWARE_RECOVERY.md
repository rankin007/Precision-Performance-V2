created: 30/03/2026
status: RESOLVED

# Decision 009: Sydney Edge Middleware Recovery

## Problem
Error 500: MIDDLEWARE_INVOCATION_FAILED at syd1.

## Root Cause
Missing Edge-level environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
in the Vercel Production environment. Middleware called supabase.auth.getUser() with null credentials.

## Rationale
The site was physically reachable (DNS working), but the internal middleware was crashing on the
Supabase handshake due to missing environment variables.

## Fix Applied
1. Added NEXT_PUBLIC_SUPABASE_URL=https://ukqncqjhnokxlvfifeyn.supabase.co to Vercel production env vars.
2. Added NEXT_PUBLIC_SUPABASE_ANON_KEY (live key from Supabase API settings).
3. Triggered a Vercel redeploy.

## Verified
precision-performance-v2.vercel.app → 200 OK. "Precision Performance / GO BY THE NUMBERS" displayed.
Middleware no longer crashing on syd1 edge.
