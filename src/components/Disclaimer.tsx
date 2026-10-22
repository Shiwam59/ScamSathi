import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

export function Disclaimer({ className = '', compact = false }: DisclaimerProps) {
  if (compact) {
    return (
      <aside
        aria-label="Safety Disclaimer"
        className={`flex items-center gap-2 text-xs text-slate-600 bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 ${className}`}
      >
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
        <p>
          <strong className="text-slate-800 font-semibold">Important:</strong> ScamSathi is an educational and investigative aid, not a legal authority. Analysis does not constitute a guarantee of safety.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Safety Disclaimer"
      className={`rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 text-sm text-slate-700 shadow-2xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1.5">
          <p className="font-bold text-slate-900 text-sm">
            ScamSathi is an Investigative Aid
          </p>
          <p className="leading-relaxed text-xs sm:text-sm text-slate-700">
            ScamSathi analyzes digital communications and provides emergency damage-control guidance. It is not a financial, legal, or police authority. An analysis finding no immediate warning signs is <strong className="text-slate-900 underline font-semibold">never a guarantee of safety</strong>. In financial emergencies, immediately dial the National Cybercrime Helpline at <strong className="text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded font-bold">1930</strong> and contact your bank.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Disclaimer;
