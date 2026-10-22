export interface TaxonomyCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export const WARNING_SIGN_TAXONOMY: TaxonomyCategory[] = [
  {
    id: 'pressure',
    name: 'Pressure Tactics',
    description: 'Artificial urgency, threats of legal action or account suspension, demands for secrecy.',
    examples: ['blocked in 24 hours', 'immediate legal notice', 'do not inform anyone'],
  },
  {
    id: 'credential_harvesting',
    name: 'Credential Harvesting',
    description: 'Requests for OTP, password, PIN, CVV, NetBanking login, KYC update, or installing remote access apps.',
    examples: ['enter OTP', 'update KYC at link', 'install AnyDesk/TeamViewer'],
  },
  {
    id: 'payment_pressure',
    name: 'Payment Pressure',
    description: 'Requests for advance fees, registration charges, refundable deposits, gift cards, crypto, or UPI collect requests.',
    examples: ['refundable registration fee', 'processing charge ₹5000', 'approve UPI request to receive funds'],
  },
  {
    id: 'too_good_to_be_true',
    name: 'Unrealistic Promises',
    description: 'Lottery wins without entry, guaranteed investment returns, unusually high-paying simple work-from-home tasks.',
    examples: ['won ₹25,00,000 KBC lottery', 'guaranteed 20% daily return', 'earn ₹50,000/week liking videos'],
  },
  {
    id: 'impersonation',
    name: 'Impersonation of Authority',
    description: 'Pretending to be a bank, courier service, police, CBI, tax authority, telecom department, or relative in distress.',
    examples: ['SBI customer care', 'India Post delivery agent', 'Police cyber cell arrest warrant'],
  },
  {
    id: 'channel_and_link_signs',
    name: 'Suspicious Channels & Links',
    description: 'Shortened URLs, lookalike phishing domains, free webmail for corporate communication, moving from portals to private Telegram/WhatsApp.',
    examples: ['bit.ly/bank-kyc', 'sbi-update.xyz', 'amazonrecruitment@gmail.com'],
  },
];
