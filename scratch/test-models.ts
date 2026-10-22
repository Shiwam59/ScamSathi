import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const candidateModels = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
];

async function main() {
  for (const model of candidateModels) {
    try {
      process.stdout.write(`Testing model ${model}... `);
      const res = await ai.models.generateContent({
        model,
        contents: 'Say hi in one word',
      });
      console.log(`SUCCESS! Response: ${res.text?.trim()}`);
    } catch (e: any) {
      console.log(`FAILED: ${e.message?.slice(0, 100)}`);
    }
  }
}

main();
