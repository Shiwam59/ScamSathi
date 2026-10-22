# ScamSathi Design System: "The Reassuring Sathi"

> **Audience:** Everyday citizens in India—including elderly parents, students, and first-time smartphone users who are anxious, stressed, or actively being scammed.  
> **North Star:** Calm, human, warm, and protective. Moves away from gloomy cybersecurity dark-mode into a clear, trustworthy, daylight-accessible experience.

---

## 1. Principles

1. **Calm Over Panic:** Stressed victims need breathing room. No aggressive flashing red screens or alarmist jargon. Clean, daylight-legible surfaces reassure the user that help is structured and within reach.
2. **High-Legibility Typography:** Large font sizes (minimum 16px body text), generous line-height (`1.6`), and high contrast text (charcoal `#0F172A` on off-white `#F8FAFC`).
3. **Multi-Sensory Verdicts:** Never communicate risk with color alone. Always combine bold, unambiguous text, distinct iconography, and explanatory guidance.
4. **Accessible Touch Targets:** Minimum `48px` tap targets for mobile thumb usability, high-contrast focus rings for keyboard navigation, and zero motion-sickness animations.
5. **Clear Separation of Truth:** Verifiable observations (facts) are styled in distinct quotation blocks, visually separated from AI interpretations.

---

## 2. Color Palette & Semantic Tokens

### Surfaces & Backgrounds (Warm Light Architecture)
- **App Background:** `#F8FAFC` (Slate 50 — warm, daylight neutral)
- **Card Surface (Primary):** `#FFFFFF` (Pure White with subtle warm ambient shadow)
- **Card Surface (Secondary / Inset):** `#F1F5F9` (Slate 100 — soft grouping container)
- **Card Surface (Hover):** `#E2E8F0` (Slate 200)
- **Subtle Borders:** `#CBD5E1` (Slate 300)

### Typography & Ink
- **Heading Text (High Contrast):** `#0F172A` (Slate 900 — crisp, sharp, non-fatiguing)
- **Body Text:** `#334155` (Slate 700 — minimum 16px, relaxed line height)
- **Muted / Metadata Text:** `#64748B` (Slate 500 — accessible contrast ratio > 4.5:1)
- **Quote Text:** `#1E293B` (Slate 800 with monospace accent)

### Semantic Risk Indicators
- 🔴 **High Risk:**
  - Border / Accent: `#DC2626` (Red 600)
  - Background Tint: `#FEF2F2` (Red 50)
  - Text: `#991B1B` (Red 800)
- 🟠 **Suspicious — Verify First:**
  - Border / Accent: `#D97706` (Amber 600)
  - Background Tint: `#FFFBEB` (Amber 50)
  - Text: `#92400E` (Amber 800)
- 🟢 **No Strong Warning Signs Found:**
  - Border / Accent: `#059669` (Emerald 600)
  - Background Tint: `#ECFDF5` (Emerald 50)
  - Text: `#065F46` (Emerald 800)
- 🚨 **Emergency Helpline (1930 / cybercrime.gov.in):**
  - Brand Accent: `#1D4ED8` (Blue 700) with `#EFF6FF` (Blue 50) banner

---

## 3. Typography Scale

- **Display Hero:** `2.25rem` (36px) / `line-height: 1.25` / `font-bold`
- **Section Heading:** `1.5rem` (24px) / `line-height: 1.35` / `font-semibold`
- **Card Title:** `1.125rem` (18px) / `line-height: 1.4` / `font-semibold`
- **Body Regular:** `1rem` (16px) / `line-height: 1.6` / `font-normal`
- **Body Small:** `0.875rem` (14px) / `line-height: 1.5` / `font-normal`
- **Verbatim Quote:** `0.875rem` (14px) / `font-mono` / `italic` / background container

---

## 4. Component Patterns

### A. Emergency Quick Bar (Header)
Sticky top header with high-contrast helpline link: **National Cybercrime Helpline: 1930 (India)** in prominent pill badge.

### B. Input Area
- Large textarea with clean focus outline (`2px solid #2563EB`, offset `2px`).
- Generous dropzone with clear upload icon and direct file preview badge.
- 3 one-tap sample chips with descriptive labels to assist first-time users.
- Prominent primary action button: `48px` height, `#2563EB` solid fill, white text.

### C. Verdict Banner
- Multi-column on desktop, stacked on mobile.
- Bold visual icon (AlertOctagon / AlertTriangle / ShieldCheck).
- Clear verdict heading + Plain-language explanation + Confidence note.
- Mandatory safety disclaimer: *"This is not a guarantee of safety."*

### D. Evidence Breakdown
- **Observed Facts Card:** Shows verbatim quotes from the submitted message highlighted in distinct containers.
- **AI Interpretation Card:** Plain-language deduction referencing observed facts.
- **What We Could Not Verify Card:** Transparent boundaries of technology.
- **How to Verify Yourself Card:** Step-by-step checklist with phone numbers to call on the back of cards or official portals.

### E. Scam Rescue Mode
- Situation selection pills with descriptive everyday terms (e.g., *"I clicked a link"*, *"I sent money"*).
- Grouped checklists:
  1. **Do Now (Next 15 Minutes)** in high-priority container.
  2. **Do Today** for follow-up steps.
- One-click copy incident summary.
- Read Aloud voice button with live transcript.
