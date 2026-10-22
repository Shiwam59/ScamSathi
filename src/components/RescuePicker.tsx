'use client';

import React, { useState } from 'react';
import { RESCUE_CHECKLISTS, SituationChecklist } from '@/data/rescue-checklists';
import { OFFICIAL_HELPLINES } from '@/data/helplines';
import { RescueChecklist } from './RescueChecklist';
import { IncidentSummary } from './IncidentSummary';
import { AudioPlayer } from './AudioPlayer';
import { Clock, PhoneCall, HeartHandshake, Check } from 'lucide-react';

interface RescuePickerProps {
  onBack?: () => void;
  initialSituation?: string;
  extractedEntities?: {
    amounts?: string[];
    upi_ids?: string[];
    claimed_org?: string | null;
  };
}

const SITUATION_ORDER = [
  'received',
  'clicked',
  'entered_credentials',
  'installed_app',
  'sent_money',
  'shared_documents',
];

export function RescuePicker({
  onBack,
  initialSituation = 'sent_money',
  extractedEntities,
}: RescuePickerProps) {
  const [selectedId, setSelectedId] = useState(initialSituation);

  const currentChecklist: SituationChecklist =
    RESCUE_CHECKLISTS[selectedId] || RESCUE_CHECKLISTS.sent_money;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#555C57] hover:text-[#1C201E] transition px-3 py-1.5 rounded-xl border border-[#D5D4CC] bg-white shadow-2xs cursor-pointer"
        >
          <span>← Back to Results</span>
        </button>
      )}

      {/* Header */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#154D40] block">
          EMERGENCY RESCUE MODE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C201E]">
          Immediate Action Plan
        </h1>
        <p className="text-sm sm:text-base text-[#555C57] leading-relaxed">
          You are not at fault. Scams are designed to pressure people. Take the next step, not the blame.
        </p>
      </div>

      {/* What happened? Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#555C57]">
          <span className="font-bold text-[#1C201E]">What happened?</span>
          <span className="text-[11px] text-[#737873]">
            Choose the situation that applies best.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SITUATION_ORDER.map((id) => {
            const item = RESCUE_CHECKLISTS[id];
            if (!item) return null;
            const isSelected = item.id === selectedId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`py-3 px-3 rounded-xl border text-xs font-semibold text-center transition cursor-pointer flex items-center justify-center gap-1.5 select-none ${
                  isSelected
                    ? 'border-[#154D40] bg-[#154D40] text-white shadow-2xs'
                    : 'border-[#E5E5DF] bg-white hover:bg-[#FAF9F6] text-[#333835]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Golden Hour Warning Banner */}
      <div className="rounded-2xl border border-[#F6D8A8] bg-[#FEF5E7] p-6 sm:p-7 space-y-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#F6D8A8] flex items-center justify-center text-[#8C5E14] shrink-0">
              <Clock className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8C5E14] block">
                SUSPECTED FINANCIAL CYBER FRAUD
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1C201E]">
                The Golden Hour
              </h3>
              <p className="text-xs sm:text-sm text-[#555C57] leading-relaxed max-w-xl">
                Acting in the first 2 hours may help efforts to freeze funds. Call 1930 and your bank promptly to request action. Recovery is not guaranteed.
              </p>
              <p className="text-xs text-[#8C5E14] font-semibold pt-1">
                This is not a deadline. If more time has passed, still report.
              </p>
            </div>
          </div>

          <div className="shrink-0 space-y-1.5 lg:text-right">
            <a
              href={`tel:${OFFICIAL_HELPLINES.number}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#9A3423] hover:bg-[#7F2819] text-white font-bold text-sm shadow-xs transition active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>Dial 1930 Now</span>
            </a>
            <p className="text-[11px] text-[#737873] block">
              Also contact your bank through its official app, card number or branch.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left Checklists, Right Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Checklists): 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <RescueChecklist
            steps={currentChecklist.steps}
            situationLabel={currentChecklist.label}
          />
        </div>

        {/* Right Column (Sidebar Tools): 5 cols */}
        <div className="lg:col-span-5 space-y-5">
          {/* Audio Player Card */}
          <AudioPlayer checklistId={currentChecklist.id} />

          {/* Incident Summary Card */}
          <IncidentSummary
            situationLabel={currentChecklist.label}
            claimedOrg={extractedEntities?.claimed_org}
            amounts={extractedEntities?.amounts}
            upiIds={extractedEntities?.upi_ids}
          />

          {/* Support Reassurance Card */}
          <div className="bg-[#EBF5F3] border border-[#CDE3DE] rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#154D40]">
              <HeartHandshake className="w-5 h-5 text-[#154D40]" aria-hidden="true" />
              <h5 className="text-sm font-bold text-[#154D40]">
                You don’t have to do this alone.
              </h5>
            </div>
            <p className="text-xs text-[#334D46] leading-relaxed">
              Ask someone you trust to sit with you while you contact your bank or report. Be wary of anyone promising recovery for a fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RescuePicker;
