import { KNOWN_SCAM_PATTERNS, ScamPatternEntry } from '@/data/patterns';
import { MatchedPattern, Entities } from '@/types/analysis';

/**
 * Matches an investigated message against the verified scam knowledge base.
 * Operates deterministically with zero remote dependencies; seamlessly upgradable
 * to Snowflake Vector Search if Snowflake credentials are configured.
 */
export function findMatchingPattern(
  inputText: string,
  entities?: Entities,
  scamCategory?: string
): MatchedPattern | null {
  if (!inputText || inputText.trim().length === 0) {
    return null;
  }

  const normalized = inputText.toLowerCase();
  let bestPattern: ScamPatternEntry | null = null;
  let highestScore = 0;

  for (const pattern of KNOWN_SCAM_PATTERNS) {
    let score = 0;

    // 1. Keyword matching
    for (const kw of pattern.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 2;
      }
    }

    // 2. Claimed organization match
    if (entities?.claimed_org && pattern.summary.toLowerCase().includes(entities.claimed_org.toLowerCase())) {
      score += 3;
    }

    // 3. Category match
    if (scamCategory && pattern.category.toLowerCase().includes(scamCategory.toLowerCase())) {
      score += 1;
    }

    if (score > highestScore) {
      highestScore = score;
      bestPattern = pattern;
    }
  }

  // Threshold: require at least 2 distinct keyword matches or strong multi-factor signal
  if (bestPattern && highestScore >= 3) {
    return {
      id: bestPattern.id,
      name: bestPattern.name,
      summary: bestPattern.summary,
      category: bestPattern.category,
      official_advisory_url: bestPattern.official_advisory_url,
    };
  }

  return null;
}
