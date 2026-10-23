import type { Metadata } from 'next';
import './globals.css';
import { ShieldAlert, PhoneCall, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ScamSathi — Citizen AI Scam Investigation & Rescue',
  description:
    'Don’t just detect the scam. Understand it. Stop it. Open-source, evidence-backed scam investigation and emergency response assistance for India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F7F6F2] text-[#1C201E] antialiased flex flex-col min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
        {/* Top Header */}
        <header className="border-b border-[#E5E5DF] bg-[#F7F6F2]/95 backdrop-blur sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 focus-visible:rounded-lg">
              <div className="w-9 h-9 rounded-xl bg-[#154D40] flex items-center justify-center text-white shadow-xs">
                <ShieldAlert className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-[#154D40]">ScamSathi</span>
                <span className="text-[10px] text-[#555C57] font-semibold -mt-1">Citizen Aid</span>
              </div>
            </Link>

            {/* Middle Nav Items (visible on md+) */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#555C57]" aria-label="Main Navigation">
              <Link href="/" className="text-[#154D40] font-bold border-b-2 border-[#154D40] pb-1">
                Home & Input
              </Link>
              <Link href="/#results" className="hover:text-[#154D40] transition pb-1">
                Results
              </Link>
              <Link href="/#rescue" className="hover:text-[#154D40] transition pb-1">
                Emergency Rescue
              </Link>
            </nav>

            {/* Right Helpline, Accuracy & History */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/accuracy"
                className="text-xs font-semibold text-[#555C57] hover:text-[#154D40] px-2 py-1 transition"
              >
                Accuracy
              </Link>
              <Link
                href="/history"
                className="text-xs font-semibold text-[#555C57] hover:text-[#154D40] px-2 py-1 transition"
              >
                History
              </Link>
              <a
                href="tel:1930"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#154D40] bg-white hover:bg-slate-50 border border-[#D5D4CC] px-3.5 py-1.5 rounded-full shadow-2xs transition active:scale-[0.98]"
                aria-label="Call National Cyber Helpline 1930"
              >
                <PhoneCall className="w-3.5 h-3.5 shrink-0 text-[#154D40]" aria-hidden="true" />
                <span>Helpline: <strong>1930</strong></span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>

        {/* Deep Forest Green Footer */}
        <footer className="bg-[#0F3D33] text-white mt-auto py-10 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left Notice */}
            <div className="space-y-1.5 max-w-xl">
              <div className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>ScamSathi • Citizen Aid</span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed font-normal">
                Educational guidance only. AI can be wrong; verify through official channels. ScamSathi is an independent citizen-aid tool, not a government service. No personal data is stored.
              </p>
            </div>

            {/* Right Official Helpline Links */}
            <div className="space-y-2 shrink-0 text-xs">
              <div className="text-[11px] font-bold tracking-wider uppercase text-emerald-300">
                OFFICIAL REPORTING CHANNELS
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 font-semibold">
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white hover:text-emerald-200 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>cybercrime.gov.in</span>
                </a>
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-1.5 text-white hover:text-emerald-200 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Helpline 1930</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
