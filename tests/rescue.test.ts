import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET } from '../src/app/api/rescue/route';
import { RESCUE_CHECKLISTS } from '../src/data/rescue-checklists';
import { OFFICIAL_HELPLINES, SANCHAR_SAATHI } from '../src/data/helplines';

async function runRescueTests() {
  console.log('--- Running Phase 4 Rescue Mode Tests ---');

  // 1. Verify Helplines Data
  assert.equal(OFFICIAL_HELPLINES.number, '1930', 'Helpline number must be 1930');
  assert.equal(OFFICIAL_HELPLINES.portalUrl, 'https://cybercrime.gov.in', 'Portal URL must be cybercrime.gov.in');
  assert.ok(OFFICIAL_HELPLINES.lastVerified, 'Last verified date must be present');
  assert.equal(SANCHAR_SAATHI.portalUrl, 'https://sancharsaathi.gov.in', 'Sanchar Saathi portal URL must match');
  console.log('✔ Test 1 passed: Official helplines verified');

  // 2. Verify all six situations exist with required structure
  const expectedSituations = [
    'received',
    'clicked',
    'entered_credentials',
    'installed_app',
    'sent_money',
    'shared_documents',
  ];

  for (const sitId of expectedSituations) {
    const checklist = RESCUE_CHECKLISTS[sitId];
    assert.ok(checklist, `Checklist for "${sitId}" must exist`);
    assert.ok(checklist.label.length > 0, `Checklist "${sitId}" must have a label`);
    assert.ok(checklist.shortDescription.length > 0, `Checklist "${sitId}" must have a short description`);
    assert.ok(Array.isArray(checklist.steps) && checklist.steps.length > 0, `Checklist "${sitId}" must have steps`);

    const doNow = checklist.steps.filter((s) => s.urgency === 'do_now');
    const doToday = checklist.steps.filter((s) => s.urgency === 'do_today');

    assert.ok(doNow.length > 0, `Checklist "${sitId}" must have at least one "do_now" step`);
    assert.ok(doToday.length > 0, `Checklist "${sitId}" must have at least one "do_today" step`);

    // Verify non-blaming language: ensure no shaming keywords like "stupid", "your fault", "foolish"
    const allText = (checklist.label + ' ' + checklist.shortDescription + ' ' + checklist.steps.map(s => s.title + ' ' + s.detail).join(' ')).toLowerCase();
    assert.ok(!allText.includes('your fault'), `Checklist "${sitId}" must not blame the user`);
    assert.ok(!allText.includes('foolish'), `Checklist "${sitId}" must use respectful tone`);
  }
  console.log('✔ Test 2 passed: All 6 situations present with do_now/do_today and respectful wording');

  // 3. Test /api/rescue endpoint (all checklists)
  const reqAll = new NextRequest('http://localhost:3000/api/rescue');
  const resAll = await GET(reqAll);
  assert.equal(resAll.status, 200, 'GET /api/rescue should return 200');
  const dataAll = await resAll.json();
  assert.equal(dataAll.checklists.length, 6, 'Should return all 6 checklists');
  assert.equal(dataAll.helplines.number, '1930', 'Should return helplines metadata');
  console.log('✔ Test 3 passed: GET /api/rescue returns full list');

  // 4. Test /api/rescue endpoint with situation parameter
  const reqSentMoney = new NextRequest('http://localhost:3000/api/rescue?situation=sent_money');
  const resSentMoney = await GET(reqSentMoney);
  assert.equal(resSentMoney.status, 200, 'GET /api/rescue?situation=sent_money should return 200');
  const dataSentMoney = await resSentMoney.json();
  assert.equal(dataSentMoney.checklist.id, 'sent_money');
  assert.ok(dataSentMoney.do_now.length > 0, 'Should return do_now steps');
  assert.ok(dataSentMoney.do_today.length > 0, 'Should return do_today steps');
  assert.equal(dataSentMoney.helplines.number, '1930');
  console.log('✔ Test 4 passed: GET /api/rescue?situation=sent_money returns filtered checklist');

  // 5. Test /api/rescue with invalid situation
  const reqInvalid = new NextRequest('http://localhost:3000/api/rescue?situation=invalid_test');
  const resInvalid = await GET(reqInvalid);
  assert.equal(resInvalid.status, 400, 'Invalid situation should return 400');
  console.log('✔ Test 5 passed: GET /api/rescue rejects invalid situation with 400');

  console.log('\nAll Phase 4 Rescue Mode tests passed successfully!\n');
}

runRescueTests().catch((err) => {
  console.error('Rescue test failed:', err);
  process.exit(1);
});
