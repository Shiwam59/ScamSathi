import { createHash, randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

/**
 * Derives an anonymous, non-reversible session identifier.
 * Uses x-session-id header if provided, otherwise hashes client IP + salt.
 * No raw IP or user-agent is ever persisted.
 */
export function getAnonymousSessionId(request: NextRequest): string {
  const customSession = request.headers.get('x-session-id');
  if (customSession && /^[a-zA-Z0-9_-]{8,64}$/.test(customSession)) {
    return customSession;
  }

  const forwarded = request.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0].trim() || '127.0.0.1';
  const ua = request.headers.get('user-agent') || 'unknown';

  // One-way SHA-256 hash with date salt so sessions naturally cycle daily
  const salt = new Date().toISOString().slice(0, 10);
  return createHash('sha256')
    .update(`${ip}:${ua}:${salt}`)
    .digest('hex')
    .slice(0, 24);
}

export function generateClientSessionId(): string {
  return randomUUID();
}
