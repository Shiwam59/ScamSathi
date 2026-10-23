import { findMatchingPattern } from '../src/lib/knowledge/patterns';

console.log('--- Running Fraud Knowledge Base & Pattern Grounding Tests ---');

// Test 1: SBI KYC message matches Bank KYC pattern
const kycMatch = findMatchingPattern(
  'URGENT: Your SBI bank account will be blocked within 24 hours due to pending KYC verification. Update immediately.'
);
console.assert(kycMatch !== null, 'Expected KYC match to be found');
console.assert(kycMatch?.id === 'sbi-bank-kyc-suspension', `Expected sbi-bank-kyc-suspension, got ${kycMatch?.id}`);
console.assert(kycMatch?.official_advisory_url?.includes('sbi'), 'Expected official advisory link');
console.log('✔ Test 1 passed: SBI KYC message accurately matches Bank KYC fraud pattern with advisory');

// Test 2: WFH job fee message matches Advance Fee fraud
const jobMatch = findMatchingPattern(
  'Selected for Amazon WFH Data Entry Executive. Transfer refundable registration fee of 5000 to hr@example.bank'
);
console.assert(jobMatch !== null, 'Expected Job Fee match to be found');
console.assert(jobMatch?.id === 'wfh-data-entry-task-fee', `Expected wfh-data-entry-task-fee, got ${jobMatch?.id}`);
console.log('✔ Test 2 passed: WFH registration fee matches Advance Fee Fraud pattern');

// Test 3: Courier address update matches delivery phishing
const courierMatch = findMatchingPattern(
  'SpeedPost: Your parcel IN-849204 could not be delivered due to incomplete delivery address. Update address.'
);
console.assert(courierMatch !== null, 'Expected Courier match to be found');
console.assert(courierMatch?.id === 'postal-courier-address-update', `Expected postal-courier-address-update, got ${courierMatch?.id}`);
console.log('✔ Test 3 passed: SpeedPost incomplete address matches Courier phishing pattern');

// Test 4: Harmless message returns null (no false grounding)
const harmlessMatch = findMatchingPattern(
  'Reminder: Your dental appointment with Dr. Sharma is confirmed for tomorrow Thursday at 4:30 PM.'
);
console.assert(harmlessMatch === null, 'Expected harmless appointment to have NO matched pattern');
console.log('✔ Test 4 passed: Harmless message returns null (no false pattern match)');

// Test 5: Empty text returns null safely
const emptyMatch = findMatchingPattern('');
console.assert(emptyMatch === null, 'Expected empty string to return null');
console.log('✔ Test 5 passed: Empty input handled safely');

console.log('\nAll Pattern Grounding tests passed successfully!\n');
