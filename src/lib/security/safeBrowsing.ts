import { ThreatMatch } from '@/types/analysis';

const SAFE_BROWSING_API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
const REQUEST_TIMEOUT_MS = 5000;

interface SafeBrowsingResponse {
  matches?: ThreatMatch[];
}

/**
 * Checks a list of URLs against Google Safe Browsing Lookup API (v4).
 * Fails safely by returning an empty array on missing key, timeout, or network error.
 */
export async function checkUrlsSafety(urls: string[]): Promise<ThreatMatch[]> {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey || !urls || urls.length === 0) {
    return [];
  }

  // Filter out empty or whitespace-only strings
  const validUrls = urls.map((u) => u.trim()).filter((u) => u.length > 0);
  if (validUrls.length === 0) {
    return [];
  }

  try {
    const response = await fetch(`${SAFE_BROWSING_API_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client: {
          clientId: 'scamsathi',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: validUrls.map((url) => ({ url })),
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(`[SafeBrowsing] API returned status ${response.status}`);
      return [];
    }

    const data = (await response.json()) as SafeBrowsingResponse;
    return Array.isArray(data.matches) ? data.matches : [];
  } catch (err) {
    // Fail safely: never block the core analysis pipeline
    console.warn('[SafeBrowsing] Verification check failed silently:', (err as Error).message);
    return [];
  }
}
