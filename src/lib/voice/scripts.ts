import { RESCUE_CHECKLISTS, SituationChecklist } from '@/data/rescue-checklists';
import { OFFICIAL_HELPLINES } from '@/data/helplines';

/**
 * Builds a calm, urgent-only spoken script (~90 seconds) for a given situation checklist.
 * Focuses strictly on "Do Now" steps to minimize panic and guide action.
 */
export function buildSpokenScript(checklistId: string): {
  checklist: SituationChecklist;
  scriptText: string;
} {
  const checklist = RESCUE_CHECKLISTS[checklistId] || RESCUE_CHECKLISTS.sent_money;
  const doNowSteps = checklist.steps.filter((s) => s.urgency === 'do_now');

  const stepsSpoken = doNowSteps
    .map((step, idx) => `Step ${idx + 1}: ${step.title}. ${step.detail}`)
    .join(' ');

  let ending = `Remember, you can report this incident on ${OFFICIAL_HELPLINES.portalUrl}.`;
  if (checklist.involvesFinancialLoss) {
    ending = `If money was transferred, immediately dial ${OFFICIAL_HELPLINES.number} to trigger an automated freeze. You can also file a report on ${OFFICIAL_HELPLINES.portalUrl}.`;
  }

  const scriptText = `Please stay calm and take a deep breath. You are not at fault. Here is your urgent action plan for ${checklist.label}. ${stepsSpoken} ${ending}`;

  return {
    checklist,
    scriptText,
  };
}
