created: 27/03/2026
last_updated: 27/03/2026
status: active

# Bio-Log Entry Logic Map for PrecisionPerformance.com

This document acts as the Logic Map defining the workflow triggered when a Trainer enters bio-data for an equine athlete, culminating in safe and restricted Client viewing.

## Workflow Execution

1. **Authentication:** 
   - Trainer logs into the Antigravity/Supabase environment.
   - Supabase assigns an `auth.uid()` JWT.

2. **Data Ingestion (The Action):**
   - Trainer submits a new `bio_logs` entry.
   - Trainer attaches `trainer_comments`.
   
3. **Database Validation (Data Alchemist Check):**
   - PostgreSQL engine validates `CHECK` constraints:
     - Temperature (`>= 35.0 AND <= 42.0`).
     - pH constraints (`>= 0 AND <= 14`).
     - Numeric values correctly typed.
   - If invalid, strict rejection occurs. "Home – Breathe – Smile – Breathe." Clean data only.
   - Supabase executes `INSERT` into `public.bio_logs`.

4. **Security Enforcement (RLS Barrier):**
   - Row Level Security ensures the `horse_id` logically belongs to the `trainer_id`. 
   
5. **Client Notification & Real-Time Sync:**
   - Supabase Realtime (WebSockets) detects new row in `public.bio_logs`.
   - Client portal (listening to `bio_logs` changes where `auth.uid() = client_id` via RLS) receives the payload securely.
   
6. **Client Display:**
   - Client views the graphical display updated with the new RBTI figures and reads the `trainer_comments`. Data isolation is mathematically guaranteed.
