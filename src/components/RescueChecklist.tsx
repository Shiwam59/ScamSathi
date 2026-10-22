'use client';

import React, { useState } from 'react';
import { ChecklistStep } from '@/data/rescue-checklists';
import { Check } from 'lucide-react';

interface RescueChecklistProps {
  steps: ChecklistStep[];
  situationLabel?: string;
}

export function RescueChecklist({ steps, situationLabel = 'Sent money' }: RescueChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const doNowSteps = steps.filter((s) => s.urgency === 'do_now');
  const doTodaySteps = steps.filter((s) => s.urgency === 'do_today');

  return (
    <div className="space-y-6">
      {/* Do Now (Next 15 Mins) */}
      <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#1C201E] flex items-center gap-1.5">
              <span>⚡</span>
              <span>Do Now (Next 15 Mins)</span>
            </span>
          </div>
          <p className="text-xs text-[#555C57]">
            For the selected situation: {situationLabel}. Start here; take one step at a time.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {doNowSteps.map((step) => {
            const isDone = Boolean(completedSteps[step.id]);
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border transition cursor-pointer select-none flex items-start gap-3.5 ${
                  isDone
                    ? 'border-[#C5DFD4] bg-[#F2F8F5]'
                    : 'border-[#E5E5DF] bg-[#FAF9F6] hover:bg-[#F2F1EC]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isDone
                      ? 'border-[#154D40] bg-[#154D40] text-white'
                      : 'border-[#C5C5BD] bg-white'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-1">
                  <h5 className={`text-sm font-bold ${isDone ? 'text-[#154D40] line-through' : 'text-[#1C201E]'}`}>
                    {step.title}
                  </h5>
                  <p className="text-xs text-[#555C57] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Do Today */}
      {doTodaySteps.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#1C201E] flex items-center gap-1.5">
                <span>📋</span>
                <span>Do Today</span>
              </span>
            </div>
            <p className="text-xs text-[#555C57]">
              Continue reporting and reduce the chance of further misuse.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {doTodaySteps.map((step) => {
              const isDone = Boolean(completedSteps[step.id]);
              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer select-none flex items-start gap-3.5 ${
                    isDone
                      ? 'border-[#C5DFD4] bg-[#F2F8F5]'
                      : 'border-[#E5E5DF] bg-[#FAF9F6] hover:bg-[#F2F1EC]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isDone
                        ? 'border-[#154D40] bg-[#154D40] text-white'
                        : 'border-[#C5C5BD] bg-white'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <h5 className={`text-sm font-bold ${isDone ? 'text-[#154D40] line-through' : 'text-[#1C201E]'}`}>
                      {step.title}
                    </h5>
                    <p className="text-xs text-[#555C57] leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RescueChecklist;
