'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { OFFICIAL_HELPLINES } from '@/data/helplines';

interface IncidentSummaryProps {
  situationLabel: string;
  claimedOrg?: string | null;
  amounts?: string[];
  upiIds?: string[];
}

export function IncidentSummary({
  situationLabel,
  claimedOrg,
  amounts,
  upiIds,
}: IncidentSummaryProps) {
  const [copied, setCopied] = useState(false);

  const incidentSummary = `[SCAMSATHI ANONYMIZED INCIDENT SUMMARY]
Situation: ${situationLabel}
Timestamp: ${new Date().toLocaleString('en-IN')}
Claimed Organization: ${claimedOrg || 'Unspecified'}
Detected Amounts: ${amounts && amounts.length > 0 ? amounts.join(', ') : 'None stated'}
Detected UPI IDs: ${upiIds && upiIds.length > 0 ? upiIds.join(', ') : 'None stated'}
Emergency Actions Advised: Contact 1930 & Bank Freeze Requested
Official Reporting Portal: ${OFFICIAL_HELPLINES.portalUrl} (Toll-Free: ${OFFICIAL_HELPLINES.number})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(incidentSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5DF] p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#737873] block">
            FOR YOUR OWN REPORT
          </span>
          <h4 className="text-base font-bold text-[#1C201E]">
            Incident Summary Card
          </h4>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FAF9F6] text-[#737873] border border-[#E5E5DF]">
          No personal details
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-[#555C57] pt-1">
        <div className="flex items-center justify-between">
          <span>Category:</span>
          <strong className="text-[#1C201E]">{claimedOrg ? `${claimedOrg} Impersonation` : 'Financial Impersonation'}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Situation selected:</span>
          <strong className="text-[#1C201E]">{situationLabel}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Message assessment:</span>
          <strong className="text-[#9A3423] font-bold">High Risk</strong>
        </div>
      </div>

      <p className="text-xs text-[#555C57] leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E5DF]">
        Suspected impersonation message. User selected &ldquo;{situationLabel}&rdquo;. Suggested next step: contact 1930 and the bank, then file an official report.
      </p>

      <button
        type="button"
        onClick={handleCopy}
        className="w-full py-2.5 px-4 rounded-xl border border-[#D5D4CC] bg-white hover:bg-[#FAF9F6] text-[#1C201E] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-[#154D40]" aria-hidden="true" />
            <span className="text-[#154D40]">Copied anonymized summary!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-[#555C57]" aria-hidden="true" />
            <span>Copy anonymized summary</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-[#737873] leading-snug">
        No names, phone numbers, account details, message text or screenshots. This does not submit a report.
      </p>
    </div>
  );
}

export default IncidentSummary;
