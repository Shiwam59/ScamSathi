'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, PauseCircle, Search, ShieldCheck, LifeBuoy } from 'lucide-react';
import { InputForm, SubmitPayload } from '@/components/InputForm';
import { LoadingSteps } from '@/components/LoadingSteps';
import { VerdictBanner } from '@/components/VerdictBanner';
import { EvidenceList } from '@/components/EvidenceList';
import { CouldNotVerify } from '@/components/CouldNotVerify';
import { VerifyYourself } from '@/components/VerifyYourself';
import { RescuePicker } from '@/components/RescuePicker';
import { MatchedPattern } from '@/components/MatchedPattern';
import { AnalysisResult } from '@/types/analysis';

export default function HomePage() {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [viewMode, setViewMode] = useState<'result' | 'rescue'>('result');
  const [hasImage, setHasImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const checkHash = () => {
      if (typeof window !== 'undefined') {
        if (window.location.hash === '#rescue' || window.location.search.includes('rescue')) {
          setViewMode('rescue');
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleSubmit = async (payload: SubmitPayload) => {
    setState('loading');
    setErrorMessage(null);
    setHasImage(Boolean(payload.image));

    try {
      let res: Response;

      if (payload.image) {
        const formData = new FormData();
        if (payload.text) formData.append('text', payload.text);
        formData.append('image', payload.image);
        formData.append('save', String(payload.save));

        res = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: payload.text,
            save: payload.save,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error?.message || 'Failed to analyze content. Please try again.';
        setErrorMessage(message);
        setState('idle');
        return;
      }

      if (data.no_text_found) {
        setErrorMessage(data.message || 'No readable text was found in this screenshot. Please try a clearer image.');
        setState('idle');
        return;
      }

      setResult(data);
      setViewMode('result');
      setState('success');
    } catch {
      setErrorMessage('Network connection error. Please check your connection and retry.');
      setState('idle');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setErrorMessage(null);
    setViewMode('result');
  };

  return (
    <div className="space-y-8 sm:space-y-10 py-2 sm:py-4">
      {/* SCREEN 1: HOME & INPUT VIEW */}
      {state === 'idle' && viewMode !== 'rescue' && (
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="space-y-2.5 max-w-3xl">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#154D40] block">
              AI-ASSISTED SCAM INVESTIGATION • INDIA
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C201E] leading-[1.15]">
              Don’t just detect the scam. Understand it.{' '}
              <span className="text-[#154D40]">Stop it.</span>
            </h1>
            <p className="text-[#555C57] text-sm sm:text-base leading-relaxed">
              A suspicious message can leave you unsure. Look closely at its warning signs, understand the tactics, and decide what to do next.
            </p>
          </section>

          {/* 2-Column Desktop Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Form (7 cols) */}
            <div className="lg:col-span-7">
              <InputForm
                onSubmit={handleSubmit}
                isLoading={false}
                errorMessage={errorMessage}
              />
            </div>

            {/* Right Column: Guidance & Direct Rescue (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Top Amber Card: "ALREADY TOOK ACTION?" */}
              <div className="bg-[#FEF5E7] border border-[#F6D8A8] rounded-2xl p-6 space-y-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#8C5E14]">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">
                      ALREADY TOOK ACTION?
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C201E]">
                    Start with what you can do now.
                  </h3>
                  <p className="text-xs text-[#555C57] leading-relaxed">
                    Clicked, shared details or sent money? You don’t need an investigation result to get help.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('rescue')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#D5D4CC] text-[#1C201E] font-bold text-xs shadow-2xs transition cursor-pointer text-center block"
                >
                  Open Emergency Rescue Mode Now →
                </button>

                <p className="text-[11px] text-[#8C5E14] font-medium">
                  For financial cyber fraud, contact 1930 promptly.
                </p>
              </div>

              {/* Bottom White Card: "A CALMER WAY TO CHECK" */}
              <div className="bg-white border border-[#E5E5DF] rounded-2xl p-6 space-y-4 shadow-xs">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#737873] block">
                  A CALMER WAY TO CHECK
                </span>

                <div className="space-y-4 text-xs">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#E5E5DF] flex items-center justify-center text-[#154D40] shrink-0 mt-0.5">
                      <PauseCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1C201E]">
                        Pause the conversation
                      </h4>
                      <p className="text-[#555C57] leading-relaxed">
                        Don’t reply, open links or share an OTP while you check.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#E5E5DF] flex items-center justify-center text-[#154D40] shrink-0 mt-0.5">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1C201E]">
                        Look at the evidence
                      </h4>
                      <p className="text-[#555C57] leading-relaxed">
                        We separate what the message says from what it may mean.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#E5E5DF] flex items-center justify-center text-[#154D40] shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1C201E]">
                        Verify independently
                      </h4>
                      <p className="text-[#555C57] leading-relaxed">
                        Use your bank’s official app or a contact you already trust—not the message.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {state === 'loading' && <LoadingSteps hasImage={hasImage} />}

      {/* SCREEN 2: INVESTIGATION RESULTS VIEW */}
      {state === 'success' && result && viewMode === 'result' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#555C57] hover:text-[#1C201E] transition px-3 py-1.5 rounded-xl border border-[#D5D4CC] bg-white shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Investigate Another</span>
            </button>

            <span className="text-xs text-[#737873] font-medium">
              Fictional Demo / Message Assessment
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#154D40] block">
              UNDERSTAND THE WARNING SIGNS
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1C201E]">
              A closer look at your message.
            </h1>
            <p className="text-xs sm:text-sm text-[#555C57]">
              You can pause. You don’t need to follow the message’s instructions.
            </p>
          </div>

          {/* Verdict Banner */}
          <VerdictBanner
            verdict={result.verdict}
            confidenceNote={result.confidence_note}
            scamCategory={result.scam_category}
          />

          {/* Rescue Mode Callout Bar */}
          <div className="rounded-xl border border-[#F6D8A8] bg-[#FEF5E7] p-4 flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#8C5E14]">
              <LifeBuoy className="w-4 h-4 shrink-0 text-[#8C5E14]" aria-hidden="true" />
              <span>Already clicked or sent money?</span>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('rescue')}
              className="text-xs font-bold text-[#8C5E14] hover:underline cursor-pointer shrink-0"
            >
              Open Action Plan →
            </button>
          </div>

          {/* Evidence List: Observed Facts vs Inferred Meaning */}
          <EvidenceList
            observations={result.observations}
            interpretations={result.interpretations}
          />

          {/* Matched Pattern if present */}
          {result.matched_pattern && <MatchedPattern pattern={result.matched_pattern} />}

          {/* Bottom Split Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VerifyYourself steps={result.verify_yourself} />
            <CouldNotVerify items={result.could_not_verify} />
          </div>
        </div>
      )}

      {/* SCREEN 3: RESCUE MODE */}
      {viewMode === 'rescue' && (
        <RescuePicker
          onBack={() => {
            if (result) {
              setViewMode('result');
            } else {
              setState('idle');
              setViewMode('result');
            }
          }}
          initialSituation={
            result?.verdict === 'high_risk' && result.scam_category.includes('credential')
              ? 'entered_credentials'
              : 'sent_money'
          }
          extractedEntities={result?.entities}
        />
      )}
    </div>
  );
}
