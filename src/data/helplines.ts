export interface HelplineInfo {
  name: string;
  number: string;
  portalUrl: string;
  description: string;
  lastVerified: string;
}

export const OFFICIAL_HELPLINES: HelplineInfo = {
  name: 'National Cyber Crime Reporting Portal & Helpline',
  number: '1930',
  portalUrl: 'https://cybercrime.gov.in',
  description:
    'Dedicated toll-free national cyber fraud reporting helpline run by the Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs.',
  lastVerified: '2026-10-22',
};

export const SANCHAR_SAATHI = {
  name: 'Sanchar Saathi (Chakshu)',
  portalUrl: 'https://sancharsaathi.gov.in',
  description: 'Department of Telecommunications portal for reporting suspected fraudulent calls and SMS messages.',
  lastVerified: '2026-10-22',
};
