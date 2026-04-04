# Data Dictionary: PrecisionPerformance.com.au

## 1. Physiological Biochemistry (RBTI Analysis)

| Field Name | Type | Unit | Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `urine_brix` | `NUMERIC(4,2)` | % (Brix) | 0.0 - 13.0 | Total Sugars/Carbohydrates in urine. Target: 3.0 - 4.0. |
| `urine_ph` | `NUMERIC(3,1)` | pH | 0.0 - 10.0 | Urine acidity/alkalinity. Target: 6.4 - 7.0. |
| `urine_salts_ms` | `NUMERIC(6,2)` | ms | 0.0 - 100.0 | Raw conductivity measurement from the meter. |
| `urine_salts_c` | `NUMERIC(6,2)` | C | Computed | Calculated conductivity ($C = ms \times 1.43$). Target: 15 - 20. |
| `saliva_ph` | `NUMERIC(3,1)` | pH | 0.0 - 10.0 | Saliva acidity/alkalinity. Target: 6.4 - 7.0. |

## 2. Physical Metrics

| Field Name | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `body_weight` | `NUMERIC(5,1)` | kg | Live weight of the horse. |
| `body_temp` | `NUMERIC(3,1)` | °C | Internal temperature (Rectal). |
| `water_intake` | `NUMERIC(3,1)` | L | Daily water consumption. |
| `feed_menu_id` | `UUID` | ID | Reference to the current structured diet/menu. |

## 3. Track and Training Information

| Field Name | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `track_time` | `INTERVAL` | HH:MM:SS | Duration of the session. |
| `track_distance` | `NUMERIC(6,2)` | m | Distance covered in meters. |
| `track_condition` | `TEXT` | ID | Reference to condition (e.g., Heavy 8, Good 4). |
| `session_type` | `TEXT` | ID | Category (e.g., Gallop, Trot, Jump-out). |

## 4. Environmental and Weather Logs

| Field Name | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `ambient_temp` | `NUMERIC(3,1)` | °C | Outside air temperature. |
| `humidity` | `INTEGER` | % | Relative humidity at the time of recording. |
| `weather_status` | `TEXT` | ID | Category (e.g., Sunny, Overcast, Rain). |

## 5. Audit Metadata
All records MUST include:
- `id`: `UUID` (Primary Key).
- `horse_id`: `UUID` (Foreign Key).
- `recorded_at`: `TIMESTAMP WITH TIME ZONE`.
- `user_id`: `UUID` (The staff member who entered the record).
- `created_at`: `TIMESTAMP WITH TIME ZONE` (System-generated).

---
**Status**: ACTIVE
**Created**: 03/04/2026
**Owner**: Principal Orchestrator
