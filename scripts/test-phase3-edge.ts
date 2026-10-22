import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/analyze/route';

async function testEdgeCases() {
  // 1. Empty input
  const emptyReq = new NextRequest('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '    ' }),
  });
  const emptyRes = await POST(emptyReq);
  assert.strictEqual(emptyRes.status, 400);
  const emptyData = await emptyRes.json();
  assert.strictEqual(emptyData.error.code, 'INVALID_INPUT');

  // 2. Text too long (> 5,000 chars)
  const longReq = new NextRequest('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'x'.repeat(5001) }),
  });
  const longRes = await POST(longReq);
  assert.strictEqual(longRes.status, 400);
  const longData = await longRes.json();
  assert.strictEqual(longData.error.code, 'TEXT_TOO_LONG');

  console.log('✔ All Phase 3 boundary & error edge cases passed!');
}

testEdgeCases().catch((err) => {
  console.error('❌ Edge case check failed:', err);
  process.exit(1);
});
