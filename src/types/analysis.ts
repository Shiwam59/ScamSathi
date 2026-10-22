import { z } from 'zod';

export const VerdictEnum = z.enum([
  'high_risk',
  'suspicious_verify_first',
  'no_strong_warning_signs',
]);
export type Verdict = z.infer<typeof VerdictEnum>;

export const EntitiesSchema = z.object({
  urls: z.array(z.string()).default([]),
  phones: z.array(z.string()).default([]),
  upi_ids: z.array(z.string()).default([]),
  emails: z.array(z.string()).default([]),
  amounts: z.array(z.string()).default([]),
  claimed_org: z.string().nullable().default(null),
});
export type Entities = z.infer<typeof EntitiesSchema>;

export const ObservationSchema = z.object({
  text: z.string().min(1),
  quote_from_input: z.string().min(1),
});
export type Observation = z.infer<typeof ObservationSchema>;

export const InterpretationSchema = z.object({
  text: z.string().min(1),
  based_on: z.array(z.number().int().nonnegative()).default([]),
});
export type Interpretation = z.infer<typeof InterpretationSchema>;

export const MatchedPatternSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  category: z.string().optional(),
  official_advisory_url: z.string().optional().nullable(),
});
export type MatchedPattern = z.infer<typeof MatchedPatternSchema>;

export const ThreatMatchSchema = z.object({
  threatType: z.string(),
  platformType: z.string().optional(),
  threatEntryType: z.string().optional(),
  threat: z.object({
    url: z.string(),
  }),
  threatEntryMetadata: z
    .object({
      entries: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
  cacheDuration: z.string().optional(),
});
export type ThreatMatch = z.infer<typeof ThreatMatchSchema>;

export const AnalysisResultSchema = z.object({
  extracted_text: z.string().default(''),
  language: z.enum(['en', 'hi', 'other']).default('en'),
  entities: EntitiesSchema.default({
    urls: [],
    phones: [],
    upi_ids: [],
    emails: [],
    amounts: [],
    claimed_org: null,
  }),
  observations: z.array(ObservationSchema).default([]),
  interpretations: z.array(InterpretationSchema).default([]),
  indicators: z.array(z.string()).default([]),
  verdict: VerdictEnum,
  confidence_note: z.string(),
  scam_category: z.string(),
  could_not_verify: z.array(z.string()).default([]),
  verify_yourself: z.array(z.string()).default([]),
  matched_pattern: MatchedPatternSchema.nullable().default(null),
  threat_matches: z.array(ThreatMatchSchema).optional(),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

