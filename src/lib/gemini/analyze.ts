import { getGeminiClient } from './client';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt';
import { AnalysisResult, AnalysisResultSchema } from '@/types/analysis';
import { AppError } from '@/lib/errors';

export interface AnalyzeInput {
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
}

const MODELS_TO_TRY = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];

/**
 * Calls Gemini with low temperature and structured JSON output.
 * Retries once if the response is invalid JSON or fails schema validation.
 */
export async function analyzeWithGemini(input: AnalyzeInput): Promise<AnalysisResult> {
  const ai = getGeminiClient();

  const contents: Array<string | { inlineData: { data: string; mimeType: string } }> = [];

  // Multimodal image part (processed in memory)
  if (input.imageBase64 && input.imageMimeType) {
    contents.push({
      inlineData: {
        data: input.imageBase64,
        mimeType: input.imageMimeType,
      },
    });
  }

  // Text prompt part
  const userText = input.text || (input.imageBase64 ? 'Please extract and analyze the text from this screenshot.' : '');
  contents.push(buildUserPrompt(userText));

  let lastError: Error | null = null;

  // Try candidate models in order (primary -> fallback)
  for (const modelToUse of MODELS_TO_TRY) {
    try {
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error('Empty response received from AI model');
      }

      let cleanText = responseText;
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
      }

      // Parse JSON
      let rawJson: unknown;
      try {
        rawJson = JSON.parse(cleanText);
      } catch (parseErr) {
        throw new Error(`Invalid JSON output: ${(parseErr as Error).message}. Raw: ${responseText.slice(0, 150)}`);
      }

      // Validate with Zod
      const parseResult = AnalysisResultSchema.safeParse(rawJson);
      if (!parseResult.success) {
        throw new Error(`Schema validation failed: ${parseResult.error.message}`);
      }

      return parseResult.data;
    } catch (err) {
      lastError = err as Error;
      // 500ms delay before retry
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  console.error('[AI_UNAVAILABLE Root Cause]:', lastError?.message || lastError);


  // Both attempts failed
  throw new AppError(
    'AI_UNAVAILABLE',
    'We could not analyze this content safely at this time. Please try again or verify through official channels.',
    502
  );
}
