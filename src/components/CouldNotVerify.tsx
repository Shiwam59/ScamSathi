import React from 'react';
import { Info } from 'lucide-react';

interface CouldNotVerifyProps {
  items: string[];
}

export function CouldNotVerify({ items }: CouldNotVerifyProps) {
  return (
    <div className="bg-[#FAF9F6] rounded-2xl border border-[#E5E5DF] p-6 space-y-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#555C57]">
          <Info className="w-4 h-4 text-[#154D40]" aria-hidden="true" />
          <h4 className="text-base font-bold text-[#1C201E]">
            An explanation, not a final authority.
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-[#555C57] leading-relaxed">
          AI analysis evaluates deception patterns, but can misunderstand context. Always confirm real account issues directly through your bank’s official channels.
        </p>

        {items.length > 0 && (
          <ul className="pt-2 space-y-1.5 text-xs text-[#555C57]">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#8C5E14] font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-3 border-t border-[#E5E5DF] text-xs text-[#737873]">
        <span>No original message or screenshot is saved to session history.</span>
      </div>
    </div>
  );
}

export default CouldNotVerify;
