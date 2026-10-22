'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface LoadingStepsProps {
  hasImage?: boolean;
}

const STEPS_TEXT = [
  'Reading message content...',
  'Extracting phone numbers, URLs, and claimed entities...',
  'Cross-checking against warning-sign taxonomy...',
  'Verifying evidence quotes and applying risk rules...',
];

const STEPS_IMAGE = [
  'Reading text from screenshot (OCR)...',
  'Extracting entities and sender patterns...',
  'Cross-checking against warning-sign taxonomy...',
  'Verifying evidence quotes and applying risk rules...',
];

export function LoadingSteps({ hasImage = false }: LoadingStepsProps) {
  const steps = hasImage ? STEPS_IMAGE : STEPS_TEXT;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-[#E5E5DF] bg-white p-6 sm:p-7 space-y-5 max-w-xl mx-auto shadow-xs"
    >
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-[#154D40] animate-spin shrink-0" aria-hidden="true" />
        <h3 className="text-base font-bold text-[#1C201E]">Investigating Content...</h3>
      </div>

      <ol className="space-y-3.5 pt-1">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-colors ${
                isDone
                  ? 'text-[#737873]'
                  : isCurrent
                  ? 'text-[#154D40] font-bold'
                  : 'text-[#8C918C]'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-[#154D40] shrink-0" aria-hidden="true" />
              ) : isCurrent ? (
                <div className="w-4.5 h-4.5 rounded-full border-2 border-[#154D40] border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full border-2 border-[#D5D4CC] shrink-0" />
              )}
              <span>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default LoadingSteps;
