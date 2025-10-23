import 'dotenv/config';
import fetch from 'node-fetch';

const key = process.env.GOOGLE_API_KEY;
const model = 'models/gemini-2.5-flash';

async function main() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: 'Generate 5 short exercises for a 30-minute upper-body workout. Return only exercise names as a bullet list.' }] },
          ],
        }),
      }
    );

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error testing Gemini API:', err);
  }
}

main();
