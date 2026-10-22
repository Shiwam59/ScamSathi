'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, FolderLock, MessageSquare, Check } from 'lucide-react';
import { AnonymizedReport } from '@/lib/db/reports';
import { HistoryList } from '@/components/HistoryList';

export default function HistoryPage() {
  const [reports, setReports] = useState<AnonymizedReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reports)) {
          setReports(data.reports);
        }
      })
      .catch((err) => console.error('Error fetching history:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleClear = () => {
    setReports([]);
  };

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#154D40] block">
          YOUR CURRENT SESSION
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C201E]">
          Session History
        </h1>
        <p className="text-sm sm:text-base text-[#555C57] leading-relaxed">
          A little context for your next step. No personal trail.
        </p>
      </div>

      {/* History Opt-in Notice Banner */}
      <div className="bg-[#E8F3EE] border border-[#C5DFD4] rounded-2xl p-5 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#154D40]">
          <Eye className="w-4 h-4 text-[#154D40]" />
          <h4 className="text-xs sm:text-sm font-bold text-[#154D40]">
            History opt-in is on for this session.
          </h4>
        </div>
        <p className="text-xs text-[#2A4B40] leading-relaxed">
          The &ldquo;Save anonymized report to session history&rdquo; toggle on Home & Input keeps only category, verdict and timestamp. No original messages, screenshots or personal data are saved. Turn it off to stop adding entries.
        </p>
      </div>

      {/* Subheader with Link to Investigate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <span className="text-xs text-[#737873] font-medium">
          Metadata from this session only
        </span>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#154D40] hover:bg-[#0F3B31] text-white font-bold text-xs tracking-wide shadow-xs transition"
        >
          <span>Investigate a message</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Session Reports): 7 cols */}
        <div className="lg:col-span-7">
          <HistoryList
            reports={reports}
            loading={loading}
            onClear={handleClear}
          />
        </div>

        {/* Right Column (Privacy & Rescue Sidebar): 5 cols */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: A short memory, by design */}
          <div className="bg-white border border-[#E5E5DF] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E5E5DF] flex items-center justify-center text-[#154D40] mb-2">
                <FolderLock className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-base font-bold text-[#1C201E]">
                A short memory, by design.
              </h3>
              <p className="text-xs text-[#555C57] leading-relaxed">
                These entries are metadata, not saved reports or message copies.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#E5E5DF] text-xs">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#737873] block mb-1">
                  KEPT ONLY FOR THIS SESSION
                </span>
                <ul className="space-y-1 text-[#1C201E] font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#154D40]" />
                    <span>Category</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#154D40]" />
                    <span>Verdict</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#154D40]" />
                    <span>Timestamp</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-[#F2F1EC]">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#737873] block mb-1">
                  NOT SAVED
                </span>
                <p className="text-[#555C57] leading-relaxed">
                  Original messages, screenshots, names, phone numbers, account details or any other personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: A verdict is a starting point */}
          <div className="bg-[#FAF9F6] border border-[#E5E5DF] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#154D40]">
              <MessageSquare className="w-4.5 h-4.5" />
              <h4 className="text-sm font-bold text-[#1C201E]">
                A verdict is a starting point.
              </h4>
            </div>
            <p className="text-xs text-[#555C57] leading-relaxed">
              Context can change. Use official channels to verify a request. If you have already acted, go straight to Emergency Rescue Mode.
            </p>
            <div className="pt-2">
              <Link
                href="/#rescue"
                className="w-full py-2.5 px-4 rounded-xl border border-[#D5D4CC] bg-white hover:bg-slate-50 text-xs font-bold text-[#1C201E] shadow-2xs transition block text-center"
              >
                Open Action Plan →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
