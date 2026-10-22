import { z } from 'zod';

export const ChecklistStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  urgency: z.enum(['do_now', 'do_today']),
  actionType: z.enum(['call', 'browser', 'settings', 'copy']).optional(),
});

export const SituationChecklistSchema = z.object({
  id: z.string(),
  label: z.string(),
  shortDescription: z.string(),
  involvesFinancialLoss: z.boolean(),
  steps: z.array(ChecklistStepSchema),
});

export type ChecklistStep = z.infer<typeof ChecklistStepSchema>;
export type SituationChecklist = z.infer<typeof SituationChecklistSchema>;

export type SituationId =
  | 'received'
  | 'clicked'
  | 'entered_credentials'
  | 'installed_app'
  | 'sent_money'
  | 'shared_documents';
