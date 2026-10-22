import { getDatabase } from './mongo';

export interface AnonymizedReport {
  id?: string;
  session_id: string;
  verdict: string;
  scam_category: string;
  indicators: string[];
  language: string;
  input_type: 'text' | 'image';
  created_at: string;
}

// In-memory fallback if MongoDB Atlas is not configured
const memoryReports: AnonymizedReport[] = [];

/**
 * Saves an anonymized report.
 * Silently succeeds even if the database is offline or unreachable.
 */
export async function saveReport(report: Omit<AnonymizedReport, 'id' | 'created_at'>): Promise<void> {
  const newReport: AnonymizedReport = {
    ...report,
    created_at: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('reports').insertOne(newReport);
      return;
    }
  } catch (err) {
    console.warn('[saveReport] DB insert failed, falling back to memory store:', (err as Error).message);
  }

  // Memory fallback
  memoryReports.unshift(newReport);
  if (memoryReports.length > 50) {
    memoryReports.pop();
  }
}

/**
 * Retrieves anonymized reports for the given session ID.
 */
export async function getReportsBySession(sessionId: string): Promise<AnonymizedReport[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const docs = await db
        .collection('reports')
        .find({ session_id: sessionId })
        .sort({ created_at: -1 })
        .limit(20)
        .toArray();

      return docs.map((doc) => ({
        id: doc._id.toString(),
        session_id: doc.session_id,
        verdict: doc.verdict,
        scam_category: doc.scam_category,
        indicators: doc.indicators || [],
        language: doc.language,
        input_type: doc.input_type,
        created_at: doc.created_at || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('[getReportsBySession] DB query failed, using memory store:', (err as Error).message);
  }

  return memoryReports.filter((r) => r.session_id === sessionId);
}
