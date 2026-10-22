import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/analyze/route';

async function runChecks() {
  // 1. Valid request
  const validReq = new NextRequest('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'URGENT: SBI bank KYC blocked. Update at https://sbi-kyc.example.com' }),
  });
  const validRes = await POST(validReq);
  assert.strictEqual(validRes.status, 200);
  const validJson = await validRes.json();
  assert.strictEqual(validJson.verdict, 'high_risk');
  assert.ok(validJson.observations.length > 0);

  // 2. Empty input
  const emptyReq = new NextRequest('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '   ' }),
  });
  const emptyRes = await POST(emptyReq);
  assert.strictEqual(emptyRes.status, 400);
  const emptyJson = await emptyRes.json();
  assert.strictEqual(emptyJson.error.code, 'INVALID_INPUT');

  // 3. Text too long (> 5,000 chars)
  const longReq = new NextRequest('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'A'.repeat(5001) }),
  });
  const longRes = await POST(longReq);
  assert.strictEqual(longRes.status, 400);
  const longJson = await longRes.json();
  assert.strictEqual(longJson.error.code, 'TEXT_TOO_LONG');

  console.log('✔ Phase 2 boundary checks passed successfully!');
}

runChecks().catch((err) => {
  console.error('❌ Check failed:', err);
  process.exit(1);
});
