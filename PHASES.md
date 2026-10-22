# ScamSathi: Project Phases

This document breaks the build into phases, each with a goal, tasks, deliverables and an exit check. It matches PRD v3.0, ARCHITECTURE.md and RULES.md.

**Timeline:** 8-hour solo hackathon MVP, plus optional stretch phases and a post-hackathon roadmap.

**Golden rule:** each phase ends with something that works. Do not start the next phase until the exit check passes.

---

## Overview

| Phase | Name | Time | Priority | Outcome |
|---|---|---|---|---|
| 0 | Prep and decisions | Before the clock starts | Required | Accounts, keys and test data ready |
| 1 | Foundation and early deploy | Hour 1 | P0 | Live URL, project skeleton |
| 2 | Input UI | Hour 2 | P0 | Users can submit text or a screenshot |
| 3 | AI analysis engine | Hours 3-4 | P0 | Verdict with evidence |
| 4 | Scam Rescue Mode | Hour 5 | P0 | Situation-specific checklist with 1930 |
| 5 | Database and history | Hour 6 | P1 | Anonymized report history |
| 6 | Voice guidance | Hour 7 | P1 | Read-aloud with fallback |
| 7 | Testing, polish and demo | Hour 8 | P0 | Verified live demo |
| 8 | Snowflake grounding and accuracy | Stretch, 2 hours | P1 stretch | Pattern matching and accuracy page |
| 9 | Post-hackathon | After the event | P2 | Roadmap features |

```
Phase 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 ──→ DEMO
                                  ↑
                      Phase 8 (stretch) fits before 7 only if
                      Phases 1-6 are done and working
```

---

## Phase 0: Prep and Decisions

**Goal:** remove blockers before the clock starts.

**Do before hour 1:**

- [ ] Create accounts and API keys: Google Gemini, ElevenLabs, MongoDB Atlas, DigitalOcean or Vultr (and Snowflake if attempting the stretch)
- [ ] Pick the ElevenLabs voice and note its voice ID
- [ ] Create a MongoDB Atlas free cluster and allow network access
- [ ] Create the GitHub repository (MIT license)
- [ ] Write 8-10 realistic test messages with expected verdicts (use placeholder domains)
- [ ] Take 2-3 test screenshots (a scam chat, a clean message, an image with no text)
- [ ] Verify helpline details: 1930 and cybercrime.gov.in
- [ ] Skim the docs for current SDK names and auth methods

**Deliverable:** keys in a private notes file (never in the repo), test samples ready.

**Exit check:** you can call Gemini once from a scratch script and get a reply.

---

## Phase 1: Foundation and Early Deploy (Hour 1)

**Goal:** a running project that is already live on the internet.

**Tasks:**

1. Create the Next.js project with TypeScript and Tailwind
2. Add the folder structure from ARCHITECTURE.md (empty files are fine)
3. Add `.env.example`, `.gitignore`, `README.md` and `LICENSE`
4. Add environment variable validation with Zod
5. Create a hello-world page
6. Deploy it to DigitalOcean or Vultr and set the environment variables there

**Deliverable:** a public URL showing the hello-world page.

**Exit check:**

- [ ] The live URL loads on a phone
- [ ] `npm run build` succeeds
- [ ] No secrets in the repo

**Why deploy now:** most hackathon failures happen in the last hour of deployment. Redeploy after every phase from here on.

---

## Phase 2: Input UI (Hour 2)

**Goal:** a clean form where users submit what they received.

**Tasks:**

1. Build `InputForm`: text area (5,000 character limit), image upload (PNG, JPG, WebP, 5 MB), Investigate button
2. Add three tappable sample messages for instant demos
3. Add client-side validation and friendly error messages
4. Build `LoadingSteps` ("Reading text... Checking signs...")
5. Add the `Disclaimer` component and root layout
6. Make it mobile-first and keyboard accessible

**Deliverable:** form submits to a stub `/api/analyze` that returns fake data.

**Exit check:**

- [ ] Text and image can both be submitted
- [ ] Oversized or wrong-type files show a clear message
- [ ] Layout works at phone width

---

## Phase 3: AI Analysis Engine (Hours 3-4)

**Goal:** a trustworthy structured verdict. This is the heart of the product.

**Tasks:**

1. Define the output schema in `src/types/analysis.ts` (Zod)
2. Write the Gemini prompt in `src/lib/gemini/prompt.ts`:
   - warning-sign taxonomy
   - observations versus interpretations
   - untrusted-input delimiters and injection defense
   - three allowed verdicts
3. Implement `analyze.ts` for text and image input, low temperature, structured JSON
4. Implement `quoteCheck.ts`: drop observations whose quote is not in the input
5. Implement `riskRules.ts`: High Risk needs at least two independent indicators
6. Add rate limiting and one retry for invalid JSON
7. Build result components: `VerdictBanner`, `EvidenceList`, `CouldNotVerify`, `VerifyYourself`
8. Handle the "no readable text" case without forcing a verdict

**Deliverable:** pasting a scam message shows a verdict with Observed and Inferred evidence.

**Exit check:**

- [ ] The fake KYC and job-fee samples return High Risk
- [ ] The courier link sample returns Suspicious
- [ ] The harmless reminder returns No Strong Warning Signs Found
- [ ] The prompt-injection sample does not change the verdict
- [ ] No observation appears without a matching quote
- [ ] A blank image shows "nothing to analyze"

**Priority note:** if time runs short, finish this phase fully before touching anything later.

---

## Phase 4: Scam Rescue Mode (Hour 5)

**Goal:** tell users exactly what to do, based on what already happened.

**Tasks:**

1. Write `src/data/helplines.ts` (1930, cybercrime.gov.in, last-verified date)
2. Write `src/data/rescue-checklists.ts` for six situations:
   - received only
   - clicked a link
   - entered credentials, OTP or card details
   - installed an app or gave remote access
   - sent money
   - shared ID documents
3. Group steps as **Do now (next 15 minutes)** and **Do today**
4. Build `/api/rescue`, `RescuePicker` and `RescueChecklist`
5. Show 1930 and cybercrime.gov.in at the top for money or credential situations
6. Add `IncidentSummary` with a copy button
7. Link Rescue Mode from the result page, especially after High Risk

**Deliverable:** choosing "I sent money" shows an ordered checklist with official channels first.

**Exit check:**

- [ ] All six situations render
- [ ] Helplines come from `helplines.ts`, not hardcoded
- [ ] The incident summary copies correctly
- [ ] Wording is calm and non-blaming

---

## Phase 5: Database and History (Hour 6)

**Goal:** save anonymized reports and show session history.

**Tasks:**

1. Connect MongoDB Atlas with a cached connection (`mongo.ts`)
2. Implement `redact.ts` for phones, emails, UPI IDs and names
3. Save metadata only: verdict, category, indicators, language, input type, timestamp, anonymous session ID
4. Add the "Don't save this report" toggle
5. Build `/api/history` and the history page
6. Make saving failures silent: the analysis result must still return

**Deliverable:** a history list showing past verdicts for the session.

**Exit check:**

- [ ] The database contains no raw text, images or personal identifiers
- [ ] Turning off MongoDB does not break analysis
- [ ] The opt-out toggle prevents saving

---

## Phase 6: Voice Guidance (Hour 7)

**Goal:** speak the urgent safety steps aloud.

**Tasks:**

1. Build `scripts.ts` to turn a checklist into a spoken script of about 90 seconds (urgent steps only)
2. Build `/api/speak` using ElevenLabs. It accepts a checklist ID, never free text
3. Build `AudioPlayer` with play, pause, stop and a visible transcript
4. Add the browser `speechSynthesis` fallback if ElevenLabs fails or times out
5. Audio starts only on click
6. Cache the audio for the demo checklist as insurance

**Deliverable:** the "Read Safety Steps Aloud" button plays natural audio.

**Exit check:**

- [ ] Audio plays on click, on phone and laptop
- [ ] With a deliberately broken API key, the browser fallback speaks instead
- [ ] No API key appears in browser network calls

---

## Phase 7: Testing, Polish and Demo (Hour 8)

**Goal:** prove it works and rehearse.

**Tasks:**

1. Write `scripts/run-tests.ts` and `tests/samples.json`; print a pass/fail table
2. Run the full test set. Check especially for false "safe" on scams
3. Run each sample 3 times to check consistency
4. Test screenshots: clean, blurry, cropped, dark mode, no text
5. Click through all six Rescue situations
6. Test failure paths: oversized file, wrong type, empty input, broken keys
7. Run `npm audit` and a final lint
8. Redeploy and test the **live link** on a phone and a laptop
9. Finish the README (setup steps, env vars, how to run tests)
10. Record and rehearse the 2-minute demo

**Demo script:**

| Time | Beat |
|---|---|
| 0:00-0:15 | The problem: a relatable scam message and why a bare score fails |
| 0:15-0:50 | Paste the fake KYC SMS: verdict, quoted observations, what could not be verified |
| 0:50-1:20 | Upload a screenshot: extracted text and High Risk verdict |
| 1:20-1:50 | Choose "I sent money": checklist with 1930, then Read Aloud |
| 1:50-2:00 | Close: open source, privacy-first, built for everyday users |

**Exit check (Definition of Done):**

- [ ] A user can paste a message or upload a screenshot
- [ ] The app returns a verdict with an Observed-versus-Inferred breakdown
- [ ] The app shows a situation-specific checklist with 1930 and cybercrime.gov.in
- [ ] A button reads the urgent steps aloud, with fallback
- [ ] The live link works on mobile and desktop
- [ ] The README is complete and the repo has no secrets

---

## Phase 8: Snowflake Grounding and Accuracy (Stretch, About 2 Hours)

**Start only if Phases 1-6 work and you have at least 2 hours.** Use time that would otherwise go to polish.

**Goal:** ground verdicts in a known-scam knowledge base and show live accuracy numbers.

**Part A: Knowledge base (about 1 hour)**

1. Write 12-20 scam-pattern entries as JSON (placeholder domains only)
2. Load and embed them in Snowflake
3. Add retrieval to `/api/analyze`: fetch the top 2-3 similar patterns
4. Pass patterns to Gemini as reference context
5. Show a **Matched known pattern** item on the result, only above a similarity threshold

**Part B: Accuracy scoreboard (about 1 hour)**

1. Load the labeled test set into `test_samples`
2. Have the test runner write rows to `test_results`
3. Build the `/accuracy` page with these metrics: overall accuracy, false-safe rate on scams, false High Risk rate on legitimate messages, quote-match rate, schema validity, median latency, confusion matrix
4. Show results with and without retrieval

**Integrity rules:**

- Test samples must be written independently from knowledge-base entries
- Always show sample sizes (for example, "34 of 35"), never a bare percentage
- Show at least one miss in the demo and what you would improve

**Cut order within this phase:** `/accuracy` page polish, then pattern count down to 12. Never cut the false-safe metric.

**Exit check:**

- [ ] A KYC message shows the matching pattern
- [ ] `/accuracy` shows live numbers with sample sizes
- [ ] Snowflake being down does not break analysis

---

## Phase 9: Post-Hackathon Roadmap

| Stage | Features |
|---|---|
| **Next** | URL reputation checks (Google Safe Browsing) and lookalike-domain detection, Hindi and regional-language support, WhatsApp share-target |
| **Later** | Browser extension, community-reported scam patterns, trend dashboard, partnerships with consumer-protection groups and NGOs |
| **Future** | Other countries' reporting channels through pluggable "regional rescue packs", on-device or self-hosted analysis for stronger privacy |

---

## Cut Lines (If You Fall Behind)

Cut in this order:

1. Phase 8 (Snowflake) entirely
2. URL reputation check (PRD F6)
3. History page polish (keep saving, simplify the list)
4. Hindi and extra polish
5. Cached-audio extras

**Never cut:** Phase 3 (analysis with evidence), Phase 4 (Rescue Mode with 1930), the live deployment, and the Phase 7 testing of your demo path.

---

## Phase Dependencies

| Phase | Needs |
|---|---|
| 1 | Phase 0 keys and accounts |
| 2 | Phase 1 project |
| 3 | Phase 2 form (or a stub), Gemini key |
| 4 | Phase 3 result page to link from |
| 5 | Phase 3 output, MongoDB cluster |
| 6 | Phase 4 checklists, ElevenLabs key |
| 7 | Phases 1-6 |
| 8 | Phase 3 and a working test runner from Phase 7 |

---

## Daily Checkpoint Template

At the end of each phase, note:

```
Phase:
Status: done / partial / blocked
What works:
What is broken:
Next step:
Time used vs planned:
Redeployed: yes / no
```

If a phase uses more than 25% extra time, move to the next cut line instead of pushing on.
