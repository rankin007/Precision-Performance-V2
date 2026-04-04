/**
 * Precision Performance V2: The Clinical Law
 * Centralised validation for equine biometric telemetry.
 */

export interface ClinicalStatus {
  isHealingBrix: boolean;
  isHealingPh: boolean;
  isHealingCond: boolean;
  isTripleHealing: boolean;
}

export const HEALING_RANGES = {
  BRIX: { min: 3.0, max: 4.0 },
  PH: { min: 6.4, max: 7.0 },
  COND: { min: 15.0, max: 20.0 } // Calibrated C value (ms * 1.43)
}

export const EXTREME_LIMITS = {
  BRIX: { min: 0, max: 9 },
  PH: { min: 0, max: 14 },
  COND: { min: 0, max: 70 }
}

/**
 * Audit biometrics against the 'Healing Gold' thresholds.
 */
export function checkHealingStatus(brix: number, ph: number, cond: number): ClinicalStatus {
  const isHealingBrix = brix >= HEALING_RANGES.BRIX.min && brix <= HEALING_RANGES.BRIX.max;
  const isHealingPh = ph >= HEALING_RANGES.PH.min && ph <= HEALING_RANGES.PH.max;
  const isHealingCond = cond >= HEALING_RANGES.COND.min && cond <= HEALING_RANGES.COND.max;

  return {
    isHealingBrix,
    isHealingPh,
    isHealingCond,
    isTripleHealing: isHealingBrix && isHealingPh && isHealingCond
  };
}

/**
 * Audit biometrics for biological extremes (Critical System Alerts).
 */
export function checkCriticalState(brix: number, ph: number, cond: number): boolean {
  // If brix hits the extreme Max (9)
  if (brix >= EXTREME_LIMITS.BRIX.max) return true;
  
  // If pH hits the extreme Min (0)
  if (ph <= EXTREME_LIMITS.PH.min) return true;

  // Additional thresholds for critical safety
  if (cond >= EXTREME_LIMITS.COND.max) return true;

  return false;
}
