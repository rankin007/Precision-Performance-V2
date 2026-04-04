# Precision Performance V3: System Registry

This registry provides the "As-Built" technical documentation for the Precision Performance V3 platform.

## 1. Database Architecture (Modular V3)

The platform is built on a **Header-Detail (Atomic Handshake)** model to ensure clinical auditability and data integrity.

### 🏢 Entity Layer
| Table | Description | Scope |
| :--- | :--- | :--- |
| `public.profiles` | User identity, role (Trainer, Owner, Staff), and membership level. | Global |
| `public.stables` | Stable branding, name, and location. Linked to Head Trainer. | Multi-Tenant |
| `public.horses` | Central Thoroughbred identity, photo gallery, and stable assignment. | Managed Asset |
| `public.horse_ownership` | Many-to-many relationship linking Owners to specific horses. | Permission Root |

### 🧬 Clinical Log Layer
| Table | Description | Parent |
| :--- | :--- | :--- |
| `public.daily_records` | **Master Header**: Timestamp, Horse ID, Staff ID, and Trainer Notes. | `horses` |
| `public.biochemistry_logs` | **Bio Detail**: Brix, pH (Urine/Saliva), Salts (ms & C). | `daily_records` |
| `public.physical_logs` | **Physical Detail**: Weight, Temperature, Water Intake. | `daily_records` |

### 🛒 Commerce Layer
| Table | Description | Status |
| :--- | :--- | :--- |
| `public.products` | BE Test Kits, Monthly Subscriptions, and Professional Services. | Linked to RLS |
| `public.orders` | Procurement requests (Pending, Complete). | Transactional |

---

## 2. Security & RLS Matrix

Row-Level Security is strictly enforced across all clinical tables.

| Role | `horses` | `daily_records` | `biochemistry_logs` | `stables` |
| :--- | :--- | :--- | :--- | :--- |
| **Trainer** | `ALL` (Stable scope) | `ALL` (Stable scope) | `ALL` (Stable scope) | `ALL` (Owned) |
| **Owner** | `SELECT` (Owned) | `SELECT` (Owned) | `SELECT` (Owned) | `SELECT` (Associated) |
| **Staff** | `SELECT` (Stable scope) | `INSERT` (Stable scope) | `INSERT` (Stable scope) | `SELECT` (Assigned) |

---

## 3. The Clinical Law (6.4 - 7.0 pH)

The platform's "Healing Gold" status is calculated based on the following synchronized thresholds:

| Metric | Target (Healing Range) | Logic Mapping |
| :--- | :--- | :--- |
| **Urine Brix** | `3.0 - 4.0 %` | Nutrient Absorption Stability |
| **Urine pH** | `6.4 - 7.0` | **The Clinical Law** (Central Marker) |
| **Salts (C)** | `15.0 - 20.0 C` | Fluid/Oxygen Exchange Stability |

> [!NOTE]
> **Triple Healing State**: Achieved only when all three metrics are within the target range for a single log entry.

---

## 4. Environment Handover

- **Supabase ProjectID**: `ukqncqjhnokxlvfifeyn`
- **Vercel Project**: `precision-performance-v3`
- **Clinical Utility**: `utils/clinical.ts` (Universal source of truth)

**Status**: AS-BUILT (PHASE 8)
**Certified**: 04/04/2026
**Architecture**: Principal Orchestrator V3
