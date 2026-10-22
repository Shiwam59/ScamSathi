import { Observation, Interpretation } from '@/types/analysis';

export interface QuoteVerificationResult {
  observations: Observation[];
  interpretations: Interpretation[];
  droppedQuotesCount: number;
}

/**
 * Normalizes text for comparison (collapsing whitespace).
 */
function normalizeForComparison(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Drops any observation whose quote_from_input does not appear in the extracted text.
 * Re-indexes interpretations based_on to maintain proof integrity.
 */
export function verifyQuotes(
  extractedText: string,
  observations: Observation[],
  interpretations: Interpretation[]
): QuoteVerificationResult {
  const normalizedInput = normalizeForComparison(extractedText);
  const survivingObservations: Observation[] = [];
  const oldToNewIndexMap = new Map<number, number>();
  let droppedCount = 0;

  observations.forEach((obs, oldIdx) => {
    const normalizedQuote = normalizeForComparison(obs.quote_from_input);

    // Verify quote appears in input
    if (normalizedQuote.length > 0 && normalizedInput.includes(normalizedQuote)) {
      const newIdx = survivingObservations.length;
      survivingObservations.push(obs);
      oldToNewIndexMap.set(oldIdx, newIdx);
    } else {
      droppedCount++;
    }
  });

  // Re-map interpretations based_on indices
  const survivingInterpretations = interpretations
    .map((interp) => {
      const newBasedOn = interp.based_on
        .filter((oldIdx) => oldToNewIndexMap.has(oldIdx))
        .map((oldIdx) => oldToNewIndexMap.get(oldIdx)!);

      return {
        ...interp,
        based_on: newBasedOn,
      };
    })
    .filter((interp) => interp.based_on.length > 0 || survivingObservations.length === 0);

  return {
    observations: survivingObservations,
    interpretations: survivingInterpretations,
    droppedQuotesCount: droppedCount,
  };
}
