created: 27/03/2026
status: active (expires in 30m)

# Decision 004: Emergency UI Audit Bypass

## Context
User (Phillip Rankin) unable to bypass initial login to view visual assets.

## Action
Disabled Supabase Auth middleware for the `/dev/components` route temporarily. 

## Rationale
To facilitate immediate visual approval of the "Go by the Numbers" interface components and typography without executing clinical database authentication.
