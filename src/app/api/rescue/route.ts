import { NextRequest, NextResponse } from 'next/server';
import { RESCUE_CHECKLISTS } from '@/data/rescue-checklists';
import { OFFICIAL_HELPLINES } from '@/data/helplines';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const situation = searchParams.get('situation');

  if (!situation) {
    // Return all checklists + helplines
    return NextResponse.json({
      helplines: OFFICIAL_HELPLINES,
      checklists: Object.values(RESCUE_CHECKLISTS),
    });
  }

  const checklist = RESCUE_CHECKLISTS[situation];
  if (!checklist) {
    return NextResponse.json(
      {
        error: 'Invalid situation',
        allowed: Object.keys(RESCUE_CHECKLISTS),
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    helplines: OFFICIAL_HELPLINES,
    checklist,
    do_now: checklist.steps.filter((s) => s.urgency === 'do_now'),
    do_today: checklist.steps.filter((s) => s.urgency === 'do_today'),
  });
}
