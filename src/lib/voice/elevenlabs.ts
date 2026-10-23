/**
 * ElevenLabs Text-to-Speech client using native fetch.
 * Returns an ArrayBuffer containing audio/mpeg data, or null if key is missing/fails.
 */

const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah: Mature, reassuring, free premade voice

async function requestTTS(apiKey: string, voiceId: string, text: string): Promise<ArrayBuffer | null> {
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
        model_id: 'eleven_flash_v2_5',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          speaking_rate: 0.9,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[ElevenLabs] Voice ${voiceId} responded with ${response.status}: ${response.statusText}`);
      return null;
    }

    return await response.arrayBuffer();
  } catch (err) {
    console.warn('[ElevenLabs] Request failed:', (err as Error).message);
    return null;
  }
}

export async function generateSpeechAudio(text: string): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return null;
  }

  const configuredVoiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  // Try configured voice first
  let audio = await requestTTS(apiKey, configuredVoiceId, text);

  // If configured voice failed (e.g. paid library voice) and was not the default, retry with free premade voice
  if (!audio && configuredVoiceId !== DEFAULT_VOICE_ID) {
    console.info(`[ElevenLabs] Retrying with default free premade voice: ${DEFAULT_VOICE_ID}`);
    audio = await requestTTS(apiKey, DEFAULT_VOICE_ID, text);
  }

  return audio;
}
