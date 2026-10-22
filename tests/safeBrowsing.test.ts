import assert from 'node:assert/strict';
import { checkUrlsSafety } from '../src/lib/security/safeBrowsing';
import { AnalysisResultSchema, ThreatMatch } from '../src/types/analysis';

async function runTests() {
  console.log('--- Running Google Safe Browsing Unit Tests ---');

  // Test 1: Empty or missing API key returns empty array
  const originalKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  delete process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  const resNoKey = await checkUrlsSafety(['https://malicious-test.com']);
  assert.deepEqual(resNoKey, [], 'Should return empty array when API key is missing');
  console.log('✔ Test 1 passed: Fails safely without API key');

  // Test 2: Empty URL list returns empty array
  process.env.GOOGLE_SAFE_BROWSING_API_KEY = 'dummy-key';
  const resEmptyUrls = await checkUrlsSafety([]);
  assert.deepEqual(resEmptyUrls, [], 'Should return empty array for empty URL list');

  const resWhitespaceUrls = await checkUrlsSafety(['  ', '']);
  assert.deepEqual(resWhitespaceUrls, [], 'Should return empty array for whitespace URLs');
  console.log('✔ Test 2 passed: Handles empty/whitespace URL lists');

  // Test 3: Invalid endpoint or network error fails safely
  const resFailedFetch = await checkUrlsSafety(['https://malicious-test.com']);
  assert.deepEqual(resFailedFetch, [], 'Should catch fetch errors and return empty array');
  console.log('✔ Test 3 passed: Network/API failures fail gracefully without crashing');

  // Test 4: Zod schema handles optional threat_matches and full threat match object
  const validThreat: ThreatMatch = {
    threatType: 'MALWARE',
    platformType: 'ANY_PLATFORM',
    threat: {
      url: 'https://malware-sample.com',
    },
  };

  const parsedWithThreat = AnalysisResultSchema.safeParse({
    extracted_text: 'Sample text',
    language: 'en',
    verdict: 'high_risk',
    confidence_note: 'High risk verified',
    scam_category: 'Malware URL',
    threat_matches: [validThreat],
  });
  assert.equal(parsedWithThreat.success, true, 'Schema should parse valid threat match');

  const parsedWithoutThreat = AnalysisResultSchema.safeParse({
    extracted_text: 'Sample text',
    language: 'en',
    verdict: 'no_strong_warning_signs',
    confidence_note: 'Note',
    scam_category: 'None',
  });
  assert.equal(parsedWithoutThreat.success, true, 'Schema should parse without threat_matches');
  console.log('✔ Test 4 passed: AnalysisResultSchema correctly validates threat_matches');

  // Restore environment
  if (originalKey) {
    process.env.GOOGLE_SAFE_BROWSING_API_KEY = originalKey;
  } else {
    delete process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  }

  console.log('\nAll Safe Browsing unit tests passed successfully!\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
