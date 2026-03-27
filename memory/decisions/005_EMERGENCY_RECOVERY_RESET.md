created: 27/03/2026
status: active

# Decision 005: Blind Reset of Auth Middleware

## Context
Production error `MIDDLEWARE_INVOCATION_FAILED` identified at the Sydney edge (syd1).

## Action
Executed a full revert of `middleware.ts` to stable boilerplate. All custom bypasses for .com.au transition have been purged to restore site access.

## Rationale
Prioritising platform stability and "No Guessing" security over temporary visual access bypasses.
