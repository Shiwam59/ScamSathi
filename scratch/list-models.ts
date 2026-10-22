import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    const list = await ai.models.list();
    console.log('Available models:');
    for await (const m of list) {
      if (m.name?.includes('gemini')) {
        console.log(m.name, m.displayName);
      }
    }
  } catch (e: any) {
    console.error('List error:', e);
  }
}

main();
