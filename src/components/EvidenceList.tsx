import React from 'react';
import { Observation, Interpretation } from '@/types/analysis';
import { AlignLeft } from 'lucide-react';

interface EvidenceListProps {
  observations: Observation[];
  interpretations: Interpretation[];
}

export function EvidenceList({ observations, interpretations }: EvidenceListProps) {
  if (observations.length === 0 && interpretations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 sm:p-7 space-y-6 shadow-xs">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-[#154D40]" aria-hidden="true" />
          <h3 className="text-xl font-bold text-[#1C201E]">
            Why this was flagged
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#555C57]">
          Exact words on one side. What those words may be doing on the other.
        </p>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-[#E5E5DF] text-xs font-bold text-[#1C201E]">
        <div>
          <span>Observed Facts</span>
          <span className="block text-[11px] font-normal text-[#737873]">
            Quoted verbatim from your input
          </span>
        </div>
        <div className="hidden md:block">
          <span>Inferred Meaning</span>
          <span className="block text-[11px] font-normal text-[#737873]">
            Interpretation—not verified claims about the sender
          </span>
        </div>
      </div>

      {/* Row Items */}
      <div className="space-y-4">
        {observations.map((obs, idx) => {
          // Find matching interpretation based on index
          const matchingInterp =
            interpretations.find((i) => i.based_on.includes(idx)) ||
            interpretations[idx] || {
              text: obs.text,
            };

          return (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2 first:pt-0"
            >
              {/* Left Column: Quote Capsule */}
              <div className="bg-[#FAF9F6] border border-[#E5E5DF] rounded-xl p-4 text-xs sm:text-sm text-[#1C201E] font-medium leading-relaxed italic">
                &ldquo;{obs.quote_from_input}&rdquo;
              </div>

              {/* Right Column: Inferred Meaning */}
              <div className="space-y-1.5 md:pt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#8C5E14] text-[11px] font-bold">
                  {obs.text.length > 28 ? obs.text.slice(0, 28) + '...' : obs.text}
                </span>
                <h4 className="text-sm font-bold text-[#1C201E]">
                  {matchingInterp.text.split('.')[0] || 'Deceptive tactic detected'}
                </h4>
                <p className="text-xs text-[#555C57] leading-relaxed">
                  {matchingInterp.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EvidenceList;
