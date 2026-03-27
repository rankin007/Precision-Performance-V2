created: 27/03/2026
last_updated: 27/03/2026
status: active

# Commerce Logic Flow & Purchase Journey

This document details the elegant, low-friction purchasing process within the Trainer and Client portals.

## 1. Product Categorisation
- **Testing Kits:** High-precision bio-collection tools (Urine refractometers, pH precision strips).
- **Performance Essentials:** RBTI-aligned mineral and carbohydrate supplements designed to correct specific metabolic deficiencies.

## 2. In-Portal Integration
- The "Catalogue" is natively embedded in the Portal Side Nav.
- When traversing a `HorseProfile`, if historical data indicates a recurring calcium imbalance, a subtle "Performance Suggestion" card appears below the trend chart, linking to the specific "Calcium Isotope Supplement".
- **Philosophy Active:** There are no pop-ups, modals, or countdown timers. Only calm logic.

## 3. The Re-order Flow
1. **Trigger:** Trainer opens the portal to find they have 2 Urine Test Kits remaining.
2. **Action:** Trainer navigates to "Stable Assets" -> "Restock".
3. **Execution:** Due to Supabase Auth storing past invoices and shipping data securely, restocking is a "One-Tap Reorder".
4. **Resolution:** Stripe processes the payment on the backend, bypassing frontend redirects. The inventory is atomically decremented in the Database.

## 4. Payment Architecture
- **Gateway:** Stripe API via Supabase Edge Functions.
- **Authorisation:** Client-side invokes `createPaymentIntent` via an Edge Function.
- **Webhook Reconciliation:** Stripe fires a webhook back to Supabase to verify `payment_intent.succeeded` before updating the `orders` status to 'Fulfilling'.
