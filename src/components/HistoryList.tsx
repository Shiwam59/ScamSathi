'use client';

import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { AnonymizedReport } from '@/lib/db/reports';

interface HistoryListProps {
  reports: AnonymizedReport[];
  loading?: boolean;
  onClear?: () => void;
}

export function HistoryList({ reports, loading, onClear }: HistoryListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E5DF] p-12 text-center text-xs text-[#737873] font-medium">
        Loading session entries...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-[#D5D4CC] p-12 text-center space-y-3">
        <h4 className="text-sm font-bold text-[#1C201E]">No session history yet</h4>
        <p className="text-xs text-[#555C57] max-w-sm mx-auto">
          When you investigate a message with session saving enabled, anonymized metadata will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Session Title Header */}
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-base font-bold text-[#1C201E]">This session</h3>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#154D40] border border-[#C5DFD4]">
          Anonymized
        </span>
      </div>

      {/* Cards Feed */}
      <div className="space-y-3">
        {reports.map((report, idx) => {
          const isHighRisk = report.verdict === 'high_risk';
          const isSuspicious = report.verdict === 'suspicious_verify_first';
          const isNoStrong = report.verdict === 'no_strong_warning_signs';

          return (
            <div
              key={report.id || idx}
              className="bg-white rounded-2xl border border-[#E5E5DF] p-5 space-y-3 shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isHighRisk
                      ? 'bg-[#FCE3E0] text-[#9A3423] border border-[#F6C8C3]'
                      : isSuspicious
                      ? 'bg-[#FDF0D5] text-[#8C5E14] border border-[#F8E2B5]'
                      : 'bg-[#E3EFE9] text-[#154D40] border border-[#C5DFD4]'
                  }`}
                >
                  {isHighRisk && <AlertOctagon className="w-5 h-5" />}
                  {isSuspicious && <AlertTriangle className="w-5 h-5" />}
                  {isNoStrong && <CheckCircle2 className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#737873] capitalize block">
                    {report.scam_category.replace(/_/g, ' ')}
                  </span>
                  <h4
                    className={`text-base font-bold tracking-tight ${
                      isHighRisk
                        ? 'text-[#9A3423]'
                        : isSuspicious
                        ? 'text-[#8C5E14]'
                        : 'text-[#154D40]'
                    }`}
                  >
                    {isHighRisk && 'High Risk'}
                    {isSuspicious && 'Suspicious: Verify First'}
                    {isNoStrong && 'No Strong Warning Signs Found'}
                  </h4>

                  {isNoStrong && (
                    <p className="text-[11px] text-[#737873] italic">
                      This is not a guarantee of safety.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F2F1EC] flex items-center justify-between text-[11px] text-[#737873]">
                <span>
                  {new Date(report.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                <span>Session metadata only</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear Session Button */}
      {onClear && (
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D5D4CC] bg-white hover:bg-[#FAF9F6] text-xs font-bold text-[#555C57] shadow-2xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#737873]" />
            <span>Clear session history</span>
          </button>
          <p className="text-[11px] text-[#737873] leading-relaxed">
            Clearing removes all entries. History stays empty until you opt in to another investigation. Closing this session also clears these entries.
          </p>
        </div>
      )}
    </div>
  );
}

export default HistoryList;
