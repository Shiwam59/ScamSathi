import { NextRequest, NextResponse } from 'next/server';
import { RESCUE_CHECKLISTS } from '@/data/rescue-checklists';
import { buildSpokenScript } from '@/lib/voice/scripts';
import { generateSpeechAudio } from '@/lib/voice/elevenlabs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const checklistId = typeof body.checklistId === 'string' ? body.checklistId : '';

    if (!checklistId || !RESCUE_CHECKLISTS[checklistId]) {
      return NextResponse.json(
        {
          error: 'Invalid or missing checklistId',
          allowed: Object.keys(RESCUE_CHECKLISTS),
        },
        { status: 400 }
      );
    }

    const { scriptText } = buildSpokenScript(checklistId);

    // Call ElevenLabs TTS proxy
    const audioBuffer = await generateSpeechAudio(scriptText);

    if (audioBuffer) {
      return new Response(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // ElevenLabs unavailable or unconfigured: return script transcript for browser speechSynthesis fallback
    return NextResponse.json({
      fallback: true,
      transcript: scriptText,
      message: 'ElevenLabs unavailable, use browser speechSynthesis fallback',
    });
  } catch (err) {
    console.error('TTS error:', err);
    return NextResponse.json(
      { error: 'TTS conversion failed' },
      { status: 500 }
    );
  }
}
