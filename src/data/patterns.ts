export interface ScamPatternEntry {
  id: string;
  name: string;
  category: string;
  summary: string;
  keywords: string[];
  common_indicators: string[];
  official_advisory_url?: string;
}

export const KNOWN_SCAM_PATTERNS: ScamPatternEntry[] = [
  {
    id: 'sbi-bank-kyc-suspension',
    name: 'Bank KYC Account Suspension Scam',
    category: 'credential_harvesting',
    summary: 'Fraudsters impersonate public or private banks (e.g., SBI, HDFC, PNB) via SMS, claiming your account/PAN is blocked or expiring within 24 hours. The link leads to a credential-harvesting phishing portal.',
    keywords: ['kyc', 'blocked', 'suspended', 'sbi', 'pan card', 'deactivated', 'update immediately', 'netbanking'],
    common_indicators: ['urgency deadline', 'phishing link', 'bank impersonation', 'credential theft'],
    official_advisory_url: 'https://sbi.bank.in/web/customer-care/cyber-security-awareness',
  },
  {
    id: 'wfh-data-entry-task-fee',
    name: 'Work-from-Home & Advance Registration Fee Fraud',
    category: 'advance_fee_fraud',
    summary: 'Unsolicited messages on WhatsApp/Telegram offering high salaries (e.g., ₹45,000/mo) for data entry or simple tasks. Victims are pressured to transfer an upfront "refundable registration fee" or laptop deposit.',
    keywords: ['wfh', 'data entry', 'shortlisted', 'registration fee', 'joining kit', 'refundable', 'daily salary'],
    common_indicators: ['too good to be true pay', 'advance fee demand', 'telegram/whatsapp redirection'],
    official_advisory_url: 'https://cybercrime.gov.in',
  },
  {
    id: 'postal-courier-address-update',
    name: 'Postal & Courier Address Update Phishing',
    category: 'delivery_phishing',
    summary: 'SMS falsely claiming a parcel (India Post, SpeedPost, FedEx, BlueDart) could not be delivered due to an incomplete address. Contains an unverified link asking to enter delivery details and nominal re-delivery fees.',
    keywords: ['speedpost', 'indiapost', 'parcel', 'undelivered', 'incomplete address', 'return to sender', 'track package'],
    common_indicators: ['courier impersonation', 'unverified link', 'delivery pressure'],
    official_advisory_url: 'https://www.indiapost.gov.in',
  },
  {
    id: 'electricity-bill-disconnection',
    name: 'Urgent Electricity Bill Disconnection Extortion',
    category: 'extortion',
    summary: 'Threatening SMS claiming your electricity power connection will be cut off tonight by 9:30 PM due to unpaid bills. Urges calling a fake helpline officer or downloading a malicious APK.',
    keywords: ['electricity', 'power bill', 'disconnected tonight', 'power supply', 'cut off', 'officer mobile'],
    common_indicators: ['severe urgency deadline', 'disconnection threat', 'fake helpline number'],
    official_advisory_url: 'https://cybercrime.gov.in',
  },
  {
    id: 'digital-arrest-law-enforcement',
    name: 'Digital Arrest & Law Enforcement Impersonation',
    category: 'impersonation_extortion',
    summary: 'Video call or notice claiming to be from CBI, Mumbai Police, Customs, or ED. Victims are threatened with arrest warrants for parcels containing illegal narcotics or money laundering unless they wire money to "verification accounts".',
    keywords: ['cbi', 'customs', 'narcotics', 'digital arrest', 'money laundering', 'police officer', 'warrant', 'rbi verification account'],
    common_indicators: ['government impersonation', 'arrest threat', 'secrecy demand', 'large fund transfer demand'],
    official_advisory_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2012891',
  },
  {
    id: 'whatsapp-distressed-relative',
    name: 'Distressed Relative Urgent Money Scam',
    category: 'impersonation',
    summary: 'Scammer poses as a family member or friend from a new number or hacked account, claiming an emergency (medical bill, arrested, lost luggage abroad) and requesting immediate UPI payment.',
    keywords: ['relative', 'hospital', 'urgent money', 'new number', 'please transfer', 'friend in need', 'urgent emergency'],
    common_indicators: ['relative impersonation', 'emotional pressure', 'immediate UPI transfer demand'],
    official_advisory_url: 'https://cybercrime.gov.in',
  },
  {
    id: 'remote-access-support-app',
    name: 'Technical Support Remote Access Fraud',
    category: 'remote_access_trojan',
    summary: 'Callers impersonating bank or e-wallet support urge users to install screen-sharing apps like AnyDesk, TeamViewer, or RustDesk to resolve a failed transaction, allowing them to steal OTPs and access bank apps.',
    keywords: ['anydesk', 'teamviewer', 'rustdesk', 'quicksupport', 'remote access', 'customer support agent', 'refund helpline'],
    common_indicators: ['remote software installation demand', 'OTP observation', 'fake support'],
    official_advisory_url: 'https://www.rbi.org.in',
  },
  {
    id: 'lottery-kbc-rewards',
    name: 'Unsolicited Lottery / KBC Lucky Draw Fraud',
    category: 'lottery_scam',
    summary: 'Letters or WhatsApp audio messages stating you have won ₹25 Lakh in a Kaun Banega Crorepati (KBC) or car lucky draw, requiring payment of government taxes or processing fees to release funds.',
    keywords: ['kbc', 'lottery', 'winner', '25 lakh', 'lucky draw', 'processing charges', 'tax fee'],
    common_indicators: ['unsolicited windfall', 'too good to be true', 'advance processing fee'],
    official_advisory_url: 'https://cybercrime.gov.in',
  },
  {
    id: 'upi-collect-request-reversal',
    name: 'UPI Collect Request & "Receive Money" Scam',
    category: 'payment_fraud',
    summary: 'When selling items on OLX or Marketplace, the buyer sends a UPI "Collect Request" and instructs the seller to enter their UPI PIN to "receive" the money. Entering the PIN debits the account instead.',
    keywords: ['upi pin to receive', 'enter pin', 'collect request', 'scan qr to get money', 'olx buyer'],
    common_indicators: ['PIN entry deception', 'UPI collect request', 'marketplace buyer trick'],
    official_advisory_url: 'https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism',
  },
  {
    id: 'fake-stock-trading-ipo',
    name: 'Institutional Stock Trading & Guaranteed IPO Group',
    category: 'investment_scam',
    summary: 'Victims are invited to VIP WhatsApp or Telegram stock groups with fake screenshots of guaranteed 500% trading returns and exclusive institutional IPO allotments, only to have all deposited funds stolen.',
    keywords: ['institutional trading', 'guaranteed returns', 'vip stock group', 'ipo allocation', 'upper circuit', 'crypto trading'],
    common_indicators: ['guaranteed investment returns', 'unregulated group', 'telegram trading advisor'],
    official_advisory_url: 'https://www.sebi.gov.in',
  },
  {
    id: 'pm-kisan-subsidy-phishing',
    name: 'Government Subsidy / PM Kisan Phishing Scheme',
    category: 'phishing',
    summary: 'Phishing SMS impersonating government welfare initiatives (e.g. PM Kisan, Free Laptop, Mudra Loan approval) requiring the victim to verify Aadhaar and bank details on an unverified lookalike website.',
    keywords: ['pm kisan', 'subsidy', 'approved loan', 'government scheme', 'free laptop', 'aadhaar verification'],
    common_indicators: ['government impersonation', 'credential harvesting', 'lookalike portal'],
    official_advisory_url: 'https://pmkisan.gov.in',
  },
  {
    id: 'sextortion-video-call-blackmail',
    name: 'Video Call Blackmail & Sextortion Racket',
    category: 'blackmail_extortion',
    summary: 'Victims receive an unsolicited video call on WhatsApp displaying compromising footage, followed by immediate extortion messages threatening to distribute recorded clips to family and social contacts unless money is paid.',
    keywords: ['video call', 'compromising clip', 'send money or viral', 'police complaint youtube', 'blackmail'],
    common_indicators: ['reputation threat', 'immediate extortion demand', 'secrecy pressure'],
    official_advisory_url: 'https://cybercrime.gov.in',
  },
];
