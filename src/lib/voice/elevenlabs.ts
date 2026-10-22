/**
 * ElevenLabs Text-to-Speech client using native fetch.
 * Returns an ArrayBuffer containing audio/mpeg data, or null if key is missing/fails.
 */

const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Calm, reassuring voice

export async function generateSpeechAudio(text: string): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return null;
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          speaking_rate: 0.9,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[ElevenLabs] API responded with ${response.status}: ${response.statusText}`);
      return null;
    }

    return await response.arrayBuffer();
  } catch (err) {
    console.warn('[ElevenLabs] Request failed:', (err as Error).message);
    return null;
  }
}
