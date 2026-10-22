export interface ChecklistStep {
  id: string;
  title: string;
  detail: string;
  urgency: 'do_now' | 'do_today';
  actionType?: 'call' | 'browser' | 'settings' | 'copy';
}

export interface SituationChecklist {
  id: string;
  label: string;
  shortDescription: string;
  involvesFinancialLoss: boolean;
  steps: ChecklistStep[];
}

export const RESCUE_CHECKLISTS: Record<string, SituationChecklist> = {
  received: {
    id: 'received',
    label: 'I only received it',
    shortDescription: 'You have not clicked links, replied, or sent money.',
    involvesFinancialLoss: false,
    steps: [
      {
        id: 'rec-1',
        title: 'Do not click any links or reply',
        detail: 'Replying confirms your phone number or email is active and will invite more spam attempts.',
        urgency: 'do_now',
      },
      {
        id: 'rec-2',
        title: 'Block and report the sender',
        detail: 'Use the in-app "Block & Report Spam" option inside WhatsApp, SMS app, or email provider.',
        urgency: 'do_now',
      },
      {
        id: 'rec-3',
        title: 'Report to Sanchar Saathi (Chakshu)',
        detail: 'Optionally report suspected scam SMS/calls at sancharsaathi.gov.in to help disconnect fraudulent telecom numbers.',
        urgency: 'do_today',
      },
    ],
  },
  clicked: {
    id: 'clicked',
    label: 'I clicked a link',
    shortDescription: 'You opened the page but did not enter passwords, OTP, or card numbers.',
    involvesFinancialLoss: false,
    steps: [
      {
        id: 'clk-1',
        title: 'Close the tab and clear session',
        detail: 'Immediately close the website tab. Clear your browser history, cache, and cookies.',
        urgency: 'do_now',
      },
      {
        id: 'clk-2',
        title: 'Do not approve any download prompts',
        detail: 'If your phone downloaded any file (.apk, .exe, or profile), delete it immediately without opening.',
        urgency: 'do_now',
      },
      {
        id: 'clk-3',
        title: 'Run a device malware scan',
        detail: 'Run Google Play Protect scan on Android or built-in security scan to verify no background services were installed.',
        urgency: 'do_today',
      },
      {
        id: 'clk-4',
        title: 'Watch out for urgent follow-up calls',
        detail: 'Scammers often call shortly after a link click pretending to be customer support or police. Do not engage.',
        urgency: 'do_today',
      },
    ],
  },
  entered_credentials: {
    id: 'entered_credentials',
    label: 'I entered card, password, or OTP',
    shortDescription: 'You submitted personal passwords, banking login, card numbers, or OTP on the fake site.',
    involvesFinancialLoss: true,
    steps: [
      {
        id: 'cred-1',
        title: 'Immediately change your password from a clean device',
        detail: 'Reset your net-banking and email passwords immediately. Ensure 2-factor authentication is active.',
        urgency: 'do_now',
      },
      {
        id: 'cred-2',
        title: 'Call your bank to block card and NetBanking',
        detail: 'Call the official number on the back of your debit/credit card or use your official banking app to freeze the card.',
        urgency: 'do_now',
      },
      {
        id: 'cred-3',
        title: 'Temporarily freeze UPI access',
        detail: 'Disable UPI transactions in your mobile banking app or reset your UPI PIN immediately.',
        urgency: 'do_now',
      },
      {
        id: 'cred-4',
        title: 'Review recent transaction statements',
        detail: 'Check mini-statement or transaction log for any unauthorized deductions, even small test debits.',
        urgency: 'do_today',
      },
    ],
  },
  installed_app: {
    id: 'installed_app',
    label: 'I installed an app or gave remote access',
    shortDescription: 'You installed an APK or remote tool like AnyDesk, TeamViewer, or QuickSupport.',
    involvesFinancialLoss: true,
    steps: [
      {
        id: 'app-1',
        title: 'Disconnect internet immediately',
        detail: 'Turn on Airplane Mode and disconnect from Wi-Fi immediately to cut the scammer’s remote screen connection.',
        urgency: 'do_now',
      },
      {
        id: 'app-2',
        title: 'Uninstall the remote-access or suspicious app',
        detail: 'Go to Settings > Apps > find the app (e.g. AnyDesk, TeamViewer, RustDesk, or unknown APK) and tap Uninstall.',
        urgency: 'do_now',
      },
      {
        id: 'app-3',
        title: 'Revoke Accessibility and Device Admin permissions',
        detail: 'Check Settings > Accessibility and Settings > Security > Device Admin Apps. Disable any unknown service.',
        urgency: 'do_now',
      },
      {
        id: 'app-4',
        title: 'Call your bank from another phone',
        detail: 'Call your bank helpline to temporarily freeze digital banking and review if transactions were initiated while connected.',
        urgency: 'do_today',
      },
    ],
  },
  sent_money: {
    id: 'sent_money',
    label: 'I sent money',
    shortDescription: 'You transferred funds via UPI, NetBanking, IMPS, or credit card to the scammer.',
    involvesFinancialLoss: true,
    steps: [
      {
        id: 'mon-1',
        title: 'Call 1930 Cyber Crime Helpline immediately',
        detail: 'Dial 1930 without delay. The Golden Hour (first 2 hours) is critical—authorities can trigger an automatic lien freeze on the receiving bank account.',
        urgency: 'do_now',
      },
      {
        id: 'mon-2',
        title: 'Call your bank’s fraud department',
        detail: 'Call your bank helpline (number on your debit card). Request an immediate transaction dispute and ask them to send a freeze request to the recipient bank.',
        urgency: 'do_now',
      },
      {
        id: 'mon-3',
        title: 'File an official complaint at cybercrime.gov.in',
        detail: 'Submit a formal Financial Fraud report with your UTR/transaction reference ID, screenshot, and recipient UPI ID or account number.',
        urgency: 'do_today',
      },
      {
        id: 'mon-4',
        title: 'Preserve all evidence',
        detail: 'Save transaction receipts, bank debit SMS, WhatsApp chat exports, and call recordings in a dedicated folder for the police.',
        urgency: 'do_today',
      },
    ],
  },
  shared_documents: {
    id: 'shared_documents',
    label: 'I shared Aadhaar / PAN / ID documents',
    shortDescription: 'You emailed or uploaded Aadhaar card, PAN card, photo, or passport.',
    involvesFinancialLoss: false,
    steps: [
      {
        id: 'doc-1',
        title: 'Lock your Aadhaar biometrics',
        detail: 'Open the official mAadhaar app or visit uidai.gov.in to lock your Aadhaar biometrics and authentication.',
        urgency: 'do_now',
      },
      {
        id: 'doc-2',
        title: 'Check your CIBIL / Experian credit report',
        detail: 'Monitor your credit report for unauthorized loan inquiries or new credit cards opened in your name.',
        urgency: 'do_today',
      },
      {
        id: 'doc-3',
        title: 'File an online general diary / cyber report',
        detail: 'Report identity document theft at cybercrime.gov.in so you have an official police acknowledgment if documents are misused.',
        urgency: 'do_today',
      },
    ],
  },
};
