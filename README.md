# ScamSathi (स्कैम साथी)

> **Don’t just detect the scam. Understand it. Verify it. Stop it.**

ScamSathi is an open-source, AI-powered scam investigation and rescue web application designed to help people assess suspicious digital messages, job offers, links, and screenshots, and take immediate damage-control action if targeted.

---

## Features

- **Multimodal Analysis:** Submit suspicious text (SMS, WhatsApp, emails) or upload screenshots.
- **Proof Before Verdict:** Separates observed verbatim evidence quotes from AI interpretation.
- **Three-Tier Honest Verdicts:**
  - 🔴 **High Risk:** Multiple strong, independent indicators of deception.
  - 🟠 **Suspicious — Verify First:** Incomplete evidence; official verification channels provided.
  - 🟢 **No Strong Warning Signs Found:** Always marked with: *"This is not a guarantee of safety."*
- **Scam Rescue Mode:** Situation-specific action checklists (clicked a link, entered OTP/passwords, sent money) with official Indian emergency reporting lines (**National Cyber Crime Helpline 1930** and **cybercrime.gov.in**).
- **Voice Guidance:** Spoken safety instructions via ElevenLabs with seamless local browser speech synthesis fallback.
- **Privacy by Default:** Raw user messages and images are processed in-memory only and never logged or stored.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS (WCAG AA accessible, dark theme)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Validation:** Zod
- **Database:** MongoDB Atlas (Anonymized metadata only)
- **Voice:** ElevenLabs API with Web Speech API fallback

---

## Getting Started

### 1. Prerequisites
- Node.js `20.0.0` or higher (Node `24.x` tested)
- npm `10.x` or higher

### 2. Installation
```bash
git clone https://github.com/your-username/scamsathi.git
cd scamsathi
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and configure your API keys:
```bash
cp .env.example .env.local
```

Fill in the required server-side secrets:
```env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id_here
MONGODB_URI=your_mongodb_connection_string_here
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
npm start
```

### 6. Running Tests
```bash
npm run test:samples
```

---

## Safety & Ethics
- Never claims any message is 100% "safe".
- Never exposes API keys to client-side bundles.
- Never logs or persists sensitive personal identifiers or raw user inputs.
- All helpline numbers and official portals are centralized in `src/data/helplines.ts`.

---

## License
MIT License. See [LICENSE](LICENSE) for details.
