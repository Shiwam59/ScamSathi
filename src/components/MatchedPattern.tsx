'use client';

import React from 'react';
import { Database, ShieldAlert } from 'lucide-react';
import { MatchedPattern as MatchedPatternType } from '@/types/analysis';

interface MatchedPatternProps {
  pattern: MatchedPatternType | null;
}

export function MatchedPattern({ pattern }: MatchedPatternProps) {
  if (!pattern) return null;

  return (
    <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-5 space-y-3 shadow-2xs">
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-purple-700" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
          Known Fraud Pattern Match
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-700 shrink-0" aria-hidden="true" />
          <span>{pattern.name}</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {pattern.summary}
        </p>
      </div>

      {pattern.official_advisory_url && (
        <div className="pt-2">
          <a
            href={pattern.official_advisory_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-purple-800 hover:underline"
          >
            Read Official Advisory →
          </a>
        </div>
      )}
    </div>
  );
}

export default MatchedPattern;
