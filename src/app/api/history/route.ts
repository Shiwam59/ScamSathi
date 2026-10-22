import { NextRequest, NextResponse } from 'next/server';
import { getAnonymousSessionId } from '@/lib/security/session';
import { getReportsBySession } from '@/lib/db/reports';

export async function GET(request: NextRequest) {
  try {
    const sessionId = getAnonymousSessionId(request);
    const reports = await getReportsBySession(sessionId);

    return NextResponse.json({
      sessionId,
      count: reports.length,
      reports,
    });
  } catch (err) {
    console.error('History API error:', err);
    return NextResponse.json(
      { error: 'Could not fetch history at this time', reports: [] },
      { status: 500 }
    );
  }
}
