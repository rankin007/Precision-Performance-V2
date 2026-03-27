created: 27/03/2026
last_updated: 27/03/2026
status: active

# Trainer Portal UI Component Map

## Overview
The UI architecture follows the "Home – Breathe – Smile – Breathe" philosophy. Surfaces use significant whitespace, restrained typographic hierarchy, and a calm, "Elite" colour palette (e.g. slate, muted sage, soft ivory).

## 1. Navigation Shell (`<TrainerLayout>`)
- **Top Bar:** Trainer Name, Stable Logo, Status Indicator (Online/Offline).
- **Side Nav:**
  - Stable Overview (Home)
  - Biometric Input
  - Asset Library (Media)
  - Settings

## 2. Stable Overview (`<StableDashboard>`)
- **Status Matrix:** A grid or list showing all horses in the stable.
- **Micro-Charts:** Sparklines indicating the 7-day trend for each horse.
- **Alert Flags:** Gentle visual nudges for horses requiring immediate attention (e.g. pH imbalance).

## 3. Individual Analysis (`<HorseProfile>`)
- **Header:** Horse Name, Pedigree, Current Weight, Core Temperature.
- **Performance Trend Component (`<DualPhChart>` & `<BioMetricsChart>`):**
  - Interactive time-series line chart.
  - X-axis: 30-day timeframe.
  - Y-axis: Metrics relative to component (pH: 0-10, Brix: 0-13, Salts: 0-70C).
  - **Visual Logic:** Soft green "Healing Range" band overlay (e.g. 6.4 to 7.0 for pH, 3% to 4% for Brix, 15C to 20C for Salts) to provide immediate visual targets.
  - Handles null data points smoothly without line breakage.
- **Gallery View Component (`<HorseGallery>`):**
  - Grid of timestamped photos visualising physical condition.

## 4. Multi-Step Input Flow (`<BioDataStepper>`)
- Designed for mobile, one-thumb data entry in the stable.
- **Alerting UI:** Immediate "Data Out of Bounds" validation blocker if an input falls outside operational ranges.
- **Step 1: Core Vitals:** Temperature (slider or large numeric keypad) and Weight.
- **Step 2: Urine Analysis:** Brix (0-13%), pH (0-10), **Conductivity Input**: Explicitly requests `ms (microsiemens)` and dynamically renders the computed `C` value ($ms \times 1.43$) next to the input.
- **Step 3: Saliva Analysis:** pH (0-10).
- **Step 4: Logistics & Notes:** Distance Travelled, Times.
- **Global Action:** "Add Trainer Comment" modal accessible from every step.
