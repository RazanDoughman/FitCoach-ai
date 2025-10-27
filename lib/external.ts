import { GoogleGenerativeAI } from "@google/generative-ai";

interface ExerciseAPIItem {
  id?: number;
  name: string;
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  instructions?: string | string[];
}

export async function fetchExercisesFromAPI(): Promise<ExerciseAPIItem[]> {
  const base = "https://exercisedb.p.rapidapi.com/exercises";
  const fallbackBase = "https://exercisedb.dev/api/exercises";
  const headers = {
    "x-rapidapi-key": process.env.EXERCISEDB_API_KEY ?? "",
    "x-rapidapi-host": process.env.EXERCISEDB_API_HOST ?? "",
  };

  const allExercises: ExerciseAPIItem[] = [];
  let offset = 0;
  const batchSize = 200; // RapidAPI supports up to 200 per page

  try {
    while (true) {
      const url = `${base}?limit=${batchSize}&offset=${offset}`;
      const response = await fetch(url, { headers });

      // ⚠️ Handle rate limit (429)
      if (response.status === 429) {
        console.warn(`⚠️ Rate limit hit at offset ${offset}. Waiting 5 seconds...`);
        await new Promise(r => setTimeout(r, 5000)); // wait before retry
        continue; // retry same offset
      }

      // ⚠️ Handle API failure — try fallback endpoint once
      if (!response.ok) {
        console.error(`❌ RapidAPI failed at offset ${offset}: ${response.statusText}`);
        console.warn("➡️ Switching to fallback public endpoint exercisedb.dev...");
        const fbRes = await fetch(`${fallbackBase}?limit=${batchSize}&offset=${offset}`);
        if (!fbRes.ok) {
          console.error(`❌ Fallback also failed: ${fbRes.statusText}`);
          break;
        }
        const fbData: ExerciseAPIItem[] = await fbRes.json();
        if (!Array.isArray(fbData) || fbData.length === 0) break;
        allExercises.push(...fbData);
        offset += batchSize;
        if (offset > 1500) break;
        continue;
      }

      // ✅ Normal response
      const data: ExerciseAPIItem[] = await response.json();
      if (!Array.isArray(data) || data.length === 0) break;

      allExercises.push(...data);
      offset += batchSize;

      // Safety stop
      if (offset > 1500) break;
    }

    console.log(`✅ Successfully fetched ${allExercises.length} exercises`);
    return allExercises;
  } catch (error) {
    console.error("❌ Error fetching paginated exercises:", error);
    return [];
  }
}

export async function nutritionSearchInstant(query: string) {
  const base = process.env.NUTRITIONIX_BASE_URL!;
  const headers = {
    "x-app-id": process.env.NUTRITIONIX_APP_ID!,
    "x-app-key": process.env.NUTRITIONIX_API_KEY!,
  };

  const url = `${base}/search/instant?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`❌ Nutritionix instant search failed: ${res.statusText}`);
      return { error: `Request failed: ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    console.error("❌ Error calling Nutritionix instant search:", err);
    return { error: "Network or server error" };
  }
}


export async function nutritionNatural(text: string) {
  const base = process.env.NUTRITIONIX_BASE_URL!;
  const headers = {
    "x-app-id": process.env.NUTRITIONIX_APP_ID!,
    "x-app-key": process.env.NUTRITIONIX_API_KEY!,
    "Content-Type":"application/json",
  };
  return fetch(`${base}/natural/nutrients`, { method:"POST", headers, body: JSON.stringify({ query: text }) }).then(r=>r.json());
}

export async function aiGenerateWorkout(payload: {
  goal: string;
  level: string;
  daysPerWeek: number;
  sessionMinutes: number;
  equipment: string[];
  targetMuscles: string[];
}) {
  const apiKey = process.env.GOOGLE_API_KEY!;
  const model = "models/gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${apiKey}`;

  console.log("AI key exists:", !!apiKey);

  const prompt = `
You are a certified personal trainer and strength coach.

Create a personalized, **structured JSON workout plan** for this user:

🏋️‍♀️ User Info:
- Goal: ${payload.goal}
- Fitness Level: ${payload.level}
- Duration per session: ${payload.sessionMinutes} minutes
- Days per week: ${payload.daysPerWeek}
- Equipment available: ${payload.equipment.join(", ") || "none"}
- Target muscles: ${payload.targetMuscles.join(", ") || "full body"}

💪 Output Requirements:
Generate 5–7 exercises. Each exercise object must include:

{
  "exercise": "string (exercise name)",
  "sets": number (recommended number of sets),
  "reps": number (recommended repetitions per set),
  "rest": number (rest time in seconds between sets),
  "weight": string | number (recommended starting weight in kilograms, or "Bodyweight" if applicable)
}

⚖️ Weight Guidelines:
- Base recommendations on the user's **fitness level and equipment**.
- For **beginners**, choose lighter weights (5–10 kg).
- For **intermediate**, moderate weights (10–20 kg).
- For **advanced**, heavier loads (20–40 kg or more).
- For **bodyweight** or non-weighted movements, use "Bodyweight".
- Ensure the weight is realistic for the specific exercise.

Return ONLY valid JSON.
Do NOT include explanations, markdown, or extra text — just the JSON array.
`;

  const body = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("AI raw data:", JSON.stringify(data, null, 2));

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    console.log("AI raw text:", text);

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      // Try normal JSON parse first
      parsed = JSON.parse(cleanText);
    } catch (err) {
      // Attempt to recover malformed Gemini JSON
      console.warn("⚠️ Invalid JSON detected. Attempting cleanup...");
      let fixed = cleanText
        .replace(/```json|```/g, "")
        .replace(/\,(?=\s*[\}\]])/g, "") // remove trailing commas before } or ]
        .replace(/[\u0000-\u001F]+/g, "") // remove control chars
        .trim();

      // Try to auto-close unbalanced braces/brackets
      const openBraces = (fixed.match(/\{/g) || []).length;
      const closeBraces = (fixed.match(/\}/g) || []).length;
      const openBrackets = (fixed.match(/\[/g) || []).length;
      const closeBrackets = (fixed.match(/\]/g) || []).length;
      if (openBraces > closeBraces) fixed += "}".repeat(openBraces - closeBraces);
      if (openBrackets > closeBrackets) fixed += "]".repeat(openBrackets - closeBrackets);

      // Find first full JSON array or object
      const match = fixed.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (match) fixed = match[0];

      try {
        parsed = JSON.parse(fixed);
      } catch (err2) {
        console.error("❌ Still invalid after cleanup:", fixed);
        throw new Error("Failed to parse AI JSON output after cleanup");
      }
    }

    return parsed;
  } catch (err) {
    console.error("AI generation error:", err); 
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Unknown AI generation error" };
  }
}


export async function aiFormTips(exerciseName: string, question: string) {
  const apiKey = process.env.GOOGLE_API_KEY!;
  const model = "models/gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${apiKey}`;

  console.log("AI key exists (Form Tips):", !!apiKey);

  const prompt = `
You are FitCoachAI, a certified personal trainer and strength coach.

The user is asking a question about exercise form, technique, or performance.

Exercise: "${exerciseName}"
Question: "${question}"

🎯 Instructions:
- Provide **3–5 short, practical, and safe** tips for this exercise.
- Focus on correct form, breathing, posture, and avoiding injury.
- Use bullet points.
- Keep the tone professional, simple, and encouraging.
- ⚠️ If the question is **not related to exercise, training, or workouts**, reply ONLY with:
  "Irrelevant topic. Please ask a question related to exercise or workout form."
`;

  const body = { contents: [{ parts: [{ text: prompt }]}] };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("AI (Form Tips) raw response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("Gemini API Error (Form Tips):", data.error.message);
      return `❌ Gemini API Error: ${data.error.message}`;
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 
      "Sorry, I couldn’t generate a response.";

    return text.trim();
  } catch (error) {
    console.error("AI Form Tips Error:", error);
    return "Sorry, I couldn’t generate a response.";
  }
}