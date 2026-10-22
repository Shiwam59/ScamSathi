import { Verdict, Observation } from '@/types/analysis';

export interface RiskRuleInput {
  verdict: Verdict;
  indicators: string[];
  observations: Observation[];
  confidence_note: string;
}

export interface RiskRuleResult {
  verdict: Verdict;
  confidence_note: string;
  downgraded: boolean;
}

const SAFETY_DISCLAIMER_NOTE = 'This is not a guarantee of safety.';

/**
 * Enforces two-indicator rule for High Risk, guarantees caution,
 * and attaches mandatory disclaimer for non-scam verdicts.
 */
export function applyRiskRules({
  verdict,
  indicators,
  observations,
  confidence_note,
}: RiskRuleInput): RiskRuleResult {
  let finalVerdict = verdict;
  let finalNote = confidence_note;
  let downgraded = false;

  // Rule 1: High Risk requires at least two independent indicators AND at least two verified observations
  if (finalVerdict === 'high_risk') {
    const uniqueIndicators = new Set(indicators);
    if (uniqueIndicators.size < 2 || observations.length < 2) {
      finalVerdict = 'suspicious_verify_first';
      finalNote = `${confidence_note} (Note: Downgraded to Suspicious because High Risk requires at least two independent verified indicators).`;
      downgraded = true;
    }
  }

  // Rule 2: Ensure "no_strong_warning_signs" never overclaims safety
  if (finalVerdict === 'no_strong_warning_signs') {
    if (!finalNote.includes(SAFETY_DISCLAIMER_NOTE)) {
      finalNote = `${finalNote} ${SAFETY_DISCLAIMER_NOTE}`.trim();
    }
  }

  return {
    verdict: finalVerdict,
    confidence_note: finalNote,
    downgraded,
  };
}
