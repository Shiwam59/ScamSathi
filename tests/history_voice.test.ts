import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { redactPII, redactList } from '../src/lib/privacy/redact';
import { saveReport, getReportsBySession } from '../src/lib/db/reports';
import { buildSpokenScript } from '../src/lib/voice/scripts';
import { POST as speakPOST } from '../src/app/api/speak/route';
import { GET as historyGET } from '../src/app/api/history/route';

async function runTests() {
  console.log('--- Running Phase 5 (History & Privacy) and Phase 6 (Voice Guidance) Tests ---');

  // 1. Test PII Redaction
  const rawText = 'Contact 9876543210 or email test.user@example.com or UPI scammer123@okhdfcbank, Aadhaar 1234 5678 9012, PAN ABCDE1234F';
  const redacted = redactPII(rawText);

  assert.ok(!redacted.includes('9876543210'), 'Phone number must be redacted');
  assert.ok(!redacted.includes('test.user@example.com'), 'Email must be redacted');
  assert.ok(!redacted.includes('scammer123@okhdfcbank'), 'UPI ID must be redacted');
  assert.ok(!redacted.includes('1234 5678 9012'), 'Aadhaar must be redacted');
  assert.ok(!redacted.includes('ABCDE1234F'), 'PAN must be redacted');
  assert.ok(redacted.includes('[PHONE_REDACTED]'), 'Must contain [PHONE_REDACTED]');
  assert.ok(redacted.includes('[EMAIL_REDACTED]'), 'Must contain [EMAIL_REDACTED]');
  assert.ok(redacted.includes('[UPI_REDACTED]'), 'Must contain [UPI_REDACTED]');
  console.log('✔ Test 1 passed: PII redaction handles phones, emails, UPI, Aadhaar, PAN');

  // 2. Test Reports DB & Redaction Integration
  const testSession = 'test-session-' + Date.now();
  await saveReport({
    session_id: testSession,
    verdict: 'high_risk',
    scam_category: 'Impersonation',
    indicators: ['Detected UPI scammer@paytm and mobile +91 98765 43210'],
    language: 'en',
    input_type: 'text',
  });

  const sessionReports = await getReportsBySession(testSession);
  assert.equal(sessionReports.length, 1, 'Should return saved report');
  assert.equal(sessionReports[0].verdict, 'high_risk');
  assert.ok(!sessionReports[0].indicators[0].includes('scammer@paytm'), 'Saved indicators must have PII redacted');
  console.log('✔ Test 2 passed: Report saved silently with indicators redacted');

  // 3. Test /api/history route
  const reqHistory = new NextRequest('http://localhost:3000/api/history', {
    headers: { 'x-session-id': testSession },
  });
  const resHistory = await historyGET(reqHistory);
  assert.equal(resHistory.status, 200, '/api/history should return 200');
  const historyData = await resHistory.json();
  assert.ok(Array.isArray(historyData.reports), 'Reports should be an array');
  console.log('✔ Test 3 passed: /api/history endpoint returns valid session payload');

  // 4. Test Voice Script Generation
  const scriptResult = buildSpokenScript('sent_money');
  assert.ok(scriptResult.scriptText.length > 50, 'Spoken script must be generated');
  assert.ok(scriptResult.scriptText.includes('1930'), 'Script for sent_money must mention 1930');
  assert.ok(!scriptResult.scriptText.includes('your fault'), 'Script must be non-blaming');
  console.log('✔ Test 4 passed: Spoken script is calm, concise, and mentions 1930');

  // 5. Test /api/speak route validation (rejects free text or invalid checklist)
  const reqInvalidSpeak = new NextRequest('http://localhost:3000/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checklistId: 'non_existent_situation' }),
  });
  const resInvalidSpeak = await speakPOST(reqInvalidSpeak);
  assert.equal(resInvalidSpeak.status, 400, '/api/speak should reject invalid checklistId');

  // 6. Test /api/speak fallback behavior (returns transcript for browser synthesis)
  const reqValidSpeak = new NextRequest('http://localhost:3000/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checklistId: 'sent_money' }),
  });
  const resValidSpeak = await speakPOST(reqValidSpeak);
  assert.equal(resValidSpeak.status, 200, '/api/speak should return 200');

  const contentType = resValidSpeak.headers.get('content-type') || '';
  if (contentType.includes('audio/mpeg')) {
    assert.ok(resValidSpeak.headers.get('x-transcript'), 'Audio response must contain X-Transcript header');
    console.log('✔ Test 5 passed: /api/speak returned ElevenLabs audio with X-Transcript');
  } else {
    const speakData = await resValidSpeak.json();
    assert.equal(speakData.fallback, true, 'Should fall back to browser synthesis');
    assert.ok(speakData.transcript.length > 0, 'Should return transcript for browser synthesis');
    console.log('✔ Test 5 passed: /api/speak safely fell back to transcript for browser speech synthesis');
  }

  console.log('\nAll Phase 5 and Phase 6 tests passed successfully!\n');
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
