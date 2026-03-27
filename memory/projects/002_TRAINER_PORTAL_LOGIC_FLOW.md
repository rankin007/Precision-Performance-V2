created: 27/03/2026
last_updated: 27/03/2026
status: active

# Trainer Portal Data Flow Logic

This describes the exact lifecycle of a data entry event—from the moment the trainer inputs a metric, to the moment it renders on the analytical charts.

## 1. The Input Action
1. The Trainer stands in the stable and opens the mobile `<BioDataStepper>`.
2. They select a horse from the `<StableDashboard>` list.
3. They input today's Urine pH (e.g., 7.2) using the numeric keypad.
4. They tap "Save Record".

## 2. Optimistic UI Updates
1. The Antigravity frontend acts immediately to reduce perceived latency ("Breathe").
2. The `<DualPhChart>` optimistically plots `7.2` on the line chart before the server confirms.

## 3. The Supabase Transaction
1. The payload is fired to the Supabase backend.
2. The **RBTI Logic (Data Alchemist schema)** applies its `CHECK (urine_ph >= 0 AND urine_ph <= 14)`.
3. The row is successfully inserted into `public.bio_logs`.

## 4. Real-time Subscription (The Loop)
1. Supabase Realtime emits an `INSERT` event targeting `public.bio_logs`.
2. The `<ClientPortal>` (if a client is actively watching) and the `<TrainerPortal>` listen to this channel.
3. The state manager seamlessly reconciles the optimistic UI entry with the confirmed database entry.

## 5. View Re-render
1. The `<DualPhChart>` re-calculates the moving average.
2. The sparklines on the `<StableDashboard>` update instantly.
3. The newly added "Trainer Comment" appears in the threaded `<CommentFeed>`.
