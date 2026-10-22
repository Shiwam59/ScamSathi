import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/analyze/route';

// Simple .env.local loader without adding external dependencies
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = values.join('=').trim();
        }
      }
    });
  }
}

interface TestSample {
  id: string;
  name: string;
  input_text: string;
  expected_verdict: string;
  scenario_type: string;
  notes: string;
}

async function runTestSuite() {
  loadEnvLocal();

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY is not defined in environment or .env.local');
    process.exit(1);
  }

  const samplesPath = path.join(process.cwd(), 'tests', 'samples.json');
  const samples: TestSample[] = JSON.parse(fs.readFileSync(samplesPath, 'utf8'));

  console.log(`\n🔍 ScamSathi Test Suite: Running ${samples.length} test samples against AI Engine...\n`);

  let passedCount = 0;
  const results: Array<{
    name: string;
    expected: string;
    actual: string;
    quoteMatches: boolean;
    pass: boolean;
  }> = [];

  for (const sample of samples) {
    process.stdout.write(`Testing: ${sample.name}... `);

    try {
      const req = new NextRequest('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sample.input_text }),
      });

      const res = await POST(req);
      const data = await res.json();

      if (!res.ok) {
        console.log(`FAILED (HTTP ${res.status}: ${data.error?.message || 'Error'})`);
        results.push({
          name: sample.name,
          expected: sample.expected_verdict,
          actual: `ERROR: ${data.error?.code}`,
          quoteMatches: false,
          pass: false,
        });
        continue;
      }

      // Check quote match: every observation quote must appear in input
      const normalizedInput = sample.input_text.toLowerCase().replace(/\s+/g, ' ');
      const quotesMatch = (data.observations || []).every((obs: { quote_from_input: string }) => {
        const normalizedQuote = obs.quote_from_input.toLowerCase().replace(/\s+/g, ' ');
        return normalizedInput.includes(normalizedQuote);
      });

      const verdictMatches = data.verdict === sample.expected_verdict;
      const testPassed = verdictMatches && quotesMatch;

      if (testPassed) {
        passedCount++;
        console.log(`✔ PASS [${data.verdict}]`);
      } else {
        console.log(`❌ FAIL (Expected: ${sample.expected_verdict}, Got: ${data.verdict})`);
      }

      results.push({
        name: sample.name,
        expected: sample.expected_verdict,
        actual: data.verdict,
        quoteMatches: quotesMatch,
        pass: testPassed,
      });
    } catch (err) {
      console.log(`❌ EXCEPTION: ${(err as Error).message}`);
      results.push({
        name: sample.name,
        expected: sample.expected_verdict,
        actual: 'EXCEPTION',
        quoteMatches: false,
        pass: false,
      });
    }
  }

  console.log('\n======================= TEST SUMMARY =======================');
  console.table(
    results.map((r) => ({
      Sample: r.name,
      Expected: r.expected,
      Actual: r.actual,
      'Quotes Verbatim': r.quoteMatches ? 'YES (100%)' : 'NO',
      Result: r.pass ? 'PASS' : 'FAIL',
    }))
  );

  console.log(`Overall Result: ${passedCount} / ${samples.length} tests passed.\n`);

  if (passedCount < samples.length) {
    process.exit(1);
  }
}

runTestSuite();
