import React from 'react';
import { BookmarkCheck } from 'lucide-react';

interface VerifyYourselfProps {
  steps: string[];
}

export function VerifyYourself({ steps }: VerifyYourselfProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 space-y-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-wider uppercase text-[#737873] block">
          YOUR NEXT STEP
        </span>
        <h4 className="text-base font-bold text-[#1C201E]">
          Check outside this message.
        </h4>
        <p className="text-xs sm:text-sm text-[#555C57] leading-relaxed">
          Don’t use the link or enter an OTP. Open your bank’s official app yourself, visit a branch, or call the number printed on your bank card.
        </p>

        {steps.length > 0 && (
          <ul className="pt-2 space-y-1.5 text-xs text-[#333835]">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#154D40] font-bold">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-3 border-t border-[#E5E5DF] flex items-center gap-2 text-xs text-[#737873]">
        <BookmarkCheck className="w-4 h-4 text-[#154D40] shrink-0" aria-hidden="true" />
        <span>Keep a copy privately if you need to report. Don’t forward this message.</span>
      </div>
    </div>
  );
}

export default VerifyYourself;
