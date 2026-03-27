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
- **Performance Trend Component (`<DualPhChart>`):**
  - Interactive time-series line chart.
  - X-axis: 30-day timeframe.
  - Y-axis: pH Scale (0-14).
  - Lines: Urine pH (solid primary colour) vs. Saliva pH (dashed secondary colour).
  - Handles null data points smoothly without line breakage.
- **Gallery View Component (`<HorseGallery>`):**
  - Grid of timestamped photos visualising physical condition.

## 4. Multi-Step Input Flow (`<BioDataStepper>`)
- Designed for mobile, one-thumb data entry in the stable.
- **Step 1: Core Vitals:** Temperature (slider or large numeric keypad) and Weight.
- **Step 2: Urine Analysis:** Brix, pH, Conductivity, Nitrates.
- **Step 3: Saliva Analysis:** pH.
- **Step 4: Logistics & Notes:** Distance Travelled, Times.
- **Global Action:** "Add Trainer Comment" modal accessible from every step.
