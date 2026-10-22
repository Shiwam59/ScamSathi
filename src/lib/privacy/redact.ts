/**
 * Redacts personal identifiers (phones, emails, UPI IDs, ID numbers) from strings.
 * Used before saving any metadata or display items.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const UPI_REGEX = /[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z]{2,32}/gi;
const INDIAN_PHONE_REGEX = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g;
const AADHAAR_REGEX = /\b\d{4}\s\d{4}\s\d{4}\b/g;
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;

export function redactPII(text: string): string {
  if (!text) return text;

  return text
    .replace(EMAIL_REGEX, '[EMAIL_REDACTED]')
    .replace(UPI_REGEX, '[UPI_REDACTED]')
    .replace(INDIAN_PHONE_REGEX, '[PHONE_REDACTED]')
    .replace(AADHAAR_REGEX, '[AADHAAR_REDACTED]')
    .replace(PAN_REGEX, '[PAN_REDACTED]');
}

export function redactList(items: string[]): string[] {
  return items.map((item) => redactPII(item));
}
