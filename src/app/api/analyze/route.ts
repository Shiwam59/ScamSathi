import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { analyzeWithGemini } from '@/lib/gemini/analyze';
import { checkUrlsSafety } from '@/lib/security/safeBrowsing';
import { verifyQuotes } from '@/lib/verify/quoteCheck';
import { applyRiskRules } from '@/lib/verify/riskRules';
import { handleAppError, errorResponse } from '@/lib/errors';
import { AnalysisResult } from '@/types/analysis';
import { getAnonymousSessionId } from '@/lib/security/session';
import { saveReport } from '@/lib/db/reports';

const MAX_CHARS = 5000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return errorResponse(
        'RATE_LIMITED',
        'Too many requests. Please wait a moment before analyzing another message.',
        429
      );
    }

    // 2. Input extraction and validation
    const contentType = req.headers.get('content-type') || '';
    let text = '';
    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    let shouldSave = true;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const textField = formData.get('text');
      const imageField = formData.get('image');
      const saveField = formData.get('save');
      if (saveField === 'false') shouldSave = false;

      if (typeof textField === 'string') {
        text = textField.trim();
      }

      if (imageField && typeof imageField === 'object' && 'size' in imageField) {
        const file = imageField as File;
        if (file.size > MAX_FILE_SIZE) {
          return errorResponse(
            'FILE_TOO_LARGE',
            'The uploaded image exceeds the 5 MB limit. Please upload a smaller screenshot.',
            413
          );
        }
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return errorResponse(
            'UNSUPPORTED_TYPE',
            'Unsupported file type. Please upload a PNG, JPG, or WebP screenshot.',
            415
          );
        }

        // Process image strictly in-memory
        const arrayBuffer = await file.arrayBuffer();
        imageBase64 = Buffer.from(arrayBuffer).toString('base64');
        imageMimeType = file.type;
      }
    } else {
      const body = await req.json().catch(() => ({}));
      if (typeof body.text === 'string') {
        text = body.text.trim();
      }
      if (body.save === false) {
        shouldSave = false;
      }
    }

    if (!text && !imageBase64) {
      return errorResponse('INVALID_INPUT', 'Please paste some text or upload a screenshot to investigate.', 400);
    }

    if (text.length > MAX_CHARS) {
      return errorResponse(
        'TEXT_TOO_LONG',
        `Text is too long (${text.length} characters). Please keep it under ${MAX_CHARS} characters.`,
        400
      );
    }

    // 3. Call AI Analysis Engine
    const rawResult = await analyzeWithGemini({
      text: text || undefined,
      imageBase64,
      imageMimeType,
    });

    // 4. Handle edge case: Image had no readable text
    if (!rawResult.extracted_text || rawResult.extracted_text.trim().length === 0) {
      return NextResponse.json({
        no_text_found: true,
        message: 'We could not detect readable text in this image. Please upload a clearer screenshot.',
      });
    }

    // 5. Live Google Safe Browsing URL Check
    const urlsToCheck = rawResult.entities?.urls || [];
    const threatMatches = await checkUrlsSafety(urlsToCheck);
    const hasThreat = threatMatches.length > 0;

    if (hasThreat) {
      rawResult.verdict = 'high_risk';
      const normalizedInput = rawResult.extracted_text.toLowerCase().replace(/\s+/g, ' ');

      for (const match of threatMatches) {
        const maliciousUrl = match.threat.url;
        let matchingQuote = maliciousUrl;

        // Ensure quote matches input text so quote-verification passes
        if (!normalizedInput.includes(matchingQuote.toLowerCase())) {
          const stripped = matchingQuote.replace(/^https?:\/\//i, '');
          if (normalizedInput.includes(stripped.toLowerCase())) {
            matchingQuote = stripped;
          } else {
            const candidate = urlsToCheck.find((u) => normalizedInput.includes(u.toLowerCase()));
            if (candidate) matchingQuote = candidate;
          }
        }

        rawResult.observations.push({
          text: `Google Safe Browsing confirmed malicious link (${match.threatType.replace(/_/g, ' ')}).`,
          quote_from_input: matchingQuote,
        });

        const threatIndicator = `Verified malicious link: ${matchingQuote} (${match.threatType.replace(/_/g, ' ')})`;
        if (!rawResult.indicators.includes(threatIndicator)) {
          rawResult.indicators.push(threatIndicator);
        }
      }
    }

    // 6. Quote Verification (Anti-Hallucination check)
    const quoteCheck = verifyQuotes(
      rawResult.extracted_text,
      rawResult.observations,
      rawResult.interpretations
    );

    // 7. Risk Rules (Two-indicator requirement for High Risk & Caution rule)
    const riskRuleResult = applyRiskRules({
      verdict: rawResult.verdict,
      indicators: rawResult.indicators,
      observations: quoteCheck.observations,
      confidence_note: rawResult.confidence_note,
    });

    // 8. Assemble Verified Output (elevate to high_risk if Safe Browsing confirmed threat)
    const verifiedResult: AnalysisResult = {
      ...rawResult,
      observations: quoteCheck.observations,
      interpretations: quoteCheck.interpretations,
      verdict: hasThreat ? 'high_risk' : riskRuleResult.verdict,
      confidence_note: hasThreat
        ? `High Risk: Google Safe Browsing detected confirmed malicious threat (${threatMatches.map((m) => m.threatType).join(', ')}). Immediate danger.`
        : riskRuleResult.confidence_note,
      matched_pattern: null,
      threat_matches: hasThreat ? threatMatches : undefined,
    };

    // 8. Silently save metadata-only report (if user did not opt out)
    if (shouldSave) {
      try {
        const sessionId = getAnonymousSessionId(req);
        await saveReport({
          session_id: sessionId,
          verdict: verifiedResult.verdict,
          scam_category: verifiedResult.scam_category,
          indicators: verifiedResult.indicators,
          language: verifiedResult.language,
          input_type: imageBase64 ? 'image' : 'text',
        });
      } catch (saveErr) {
        // Never fail the user request due to logging/history issues
        console.warn('[saveReport] Silently failed:', (saveErr as Error).message);
      }
    }

    return NextResponse.json(verifiedResult);
  } catch (err) {
    return handleAppError(err);
  }
}
