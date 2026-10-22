import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Verdict } from '@/types/analysis';

interface VerdictBannerProps {
  verdict: Verdict;
  confidenceNote: string;
  scamCategory?: string;
}

const VERDICT_CONFIG = {
  high_risk: {
    label: 'High Risk',
    icon: AlertOctagon,
    containerClass: 'border-[#F6C8C3] bg-[#FEF2F1] text-[#9A3423]',
    iconBoxClass: 'bg-[#FCE3E0] border border-[#F6C8C3] text-[#9A3423]',
    titleColor: 'text-[#9A3423]',
    categoryBadgeClass: 'bg-[#FDE7E5] text-[#9A3423] border-[#F6C8C3]',
  },
  suspicious_verify_first: {
    label: 'Suspicious: Verify First',
    icon: AlertTriangle,
    containerClass: 'border-[#F8E2B5] bg-[#FEF9ED] text-[#8C5E14]',
    iconBoxClass: 'bg-[#FDF0D5] border border-[#F8E2B5] text-[#8C5E14]',
    titleColor: 'text-[#8C5E14]',
    categoryBadgeClass: 'bg-[#FDF0D5] text-[#8C5E14] border-[#F8E2B5]',
  },
  no_strong_warning_signs: {
    label: 'No Strong Warning Signs Found',
    icon: ShieldCheck,
    containerClass: 'border-[#C5DFD4] bg-[#F2F8F5] text-[#154D40]',
    iconBoxClass: 'bg-[#E3EFE9] border border-[#C5DFD4] text-[#154D40]',
    titleColor: 'text-[#154D40]',
    categoryBadgeClass: 'bg-[#E3EFE9] text-[#154D40] border-[#C5DFD4]',
  },
};

export function VerdictBanner({
  verdict,
  confidenceNote,
  scamCategory,
}: VerdictBannerProps) {
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.suspicious_verify_first;
  const IconComponent = config.icon;

  return (
    <div
      role="region"
      aria-label="Message Assessment"
      className={`rounded-2xl border p-6 sm:p-7 space-y-4 shadow-2xs ${config.containerClass}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.iconBoxClass}`}>
            <IconComponent className="w-7 h-7" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#737873] block">
              MESSAGE ASSESSMENT
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${config.titleColor}`}>
              {config.label}
            </h2>
          </div>
        </div>

        {scamCategory && scamCategory !== 'none' && (
          <span className={`text-xs px-3 py-1 rounded-full border font-bold capitalize self-start sm:self-auto ${config.categoryBadgeClass}`}>
            {scamCategory.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <div className="pt-3 border-t border-black/5 space-y-2">
        <p className="text-sm font-medium text-[#242A27] leading-relaxed">
          <strong className="font-bold">Confidence note:</strong> {confidenceNote}
        </p>
        <p className="text-xs text-[#555C57] leading-relaxed">
          {verdict === 'no_strong_warning_signs'
            ? 'This is a text-based assessment. This is not a guarantee of safety. Confirm real account issues through your bank’s official channels.'
            : 'This is a text-based assessment. The sender’s identity and the link destination are not independently verified.'}
        </p>
      </div>
    </div>
  );
}

export default VerdictBanner;
