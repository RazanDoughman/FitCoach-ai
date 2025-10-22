export async function fetchExercisesFromAPI(params: {
  limit?: number; bodyPart?: string; equipment?: string; target?: string; name?: string;
}) {
  const base = "https://exercisedb.p.rapidapi.com";
  const headers = {
    "x-rapidapi-key": process.env.EXERCISEDB_API_KEY!,
    "x-rapidapi-host": process.env.EXERCISEDB_API_HOST!,
  };

  if (params.name) return fetch(`${base}/exercises/name/${encodeURIComponent(params.name)}`, { headers }).then(r=>r.json());
  if (params.bodyPart) return fetch(`${base}/exercises/bodyPart/${encodeURIComponent(params.bodyPart)}`, { headers }).then(r=>r.json());
  if (params.equipment) return fetch(`${base}/exercises/equipment/${encodeURIComponent(params.equipment)}`, { headers }).then(r=>r.json());
  if (params.target) return fetch(`${base}/exercises/target/${encodeURIComponent(params.target)}`, { headers }).then(r=>r.json());
  const limit = params.limit ?? 50;
  return fetch(`${base}/exercises?limit=${limit}`, { headers }).then(r=>r.json());
}

export async function nutritionSearchInstant(query: string) {
  const base = process.env.NUTRITIONIX_BASE_URL!;
  const headers = {
    "x-app-id": process.env.NUTRITIONIX_APP_ID!,
    "x-app-key": process.env.NUTRITIONIX_API_KEY!,
  };
  const url = `${base}/search/instant?query=${encodeURIComponent(query)}`;
  return fetch(url, { headers }).then(r=>r.json());
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
  goal:string; level:string; daysPerWeek:number; sessionMinutes:number; equipment:string[]; targetMuscles:string[];
}) {
  const apiKey = process.env.GOOGLE_API_KEY!;
  const model = "models/gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${apiKey}`;

  console.log("AI key exists:", !!apiKey);  
  const prompt = `
You are a certified coach. Create a ${payload.level} ${payload.goal} plan,
days/week: ${payload.daysPerWeek}, session length: ${payload.sessionMinutes} min,
equipment: ${payload.equipment.join(", ") || "bodyweight"},
targets: ${payload.targetMuscles.join(", ") || "balanced"}.
Return JSON: { days: [ { day, blocks: [ { name, exercises: [ { name, sets, reps, restSec, notes } ] } ] } ] }`;

  const body = { contents: [{ parts: [{ text: prompt }]}] };

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

  const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const jsonText = text.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonText);
    return parsed;
    } catch (err) {
  console.error("AI generation error:", err);
  if (err instanceof Error) {
    return { error: "Failed to generate workout", details: err.message };
  }
  return { error: "Failed to generate workout", details: String(err) };
}
}



export async function aiFormTips(exerciseName: string) {
  const apiKey = process.env.GOOGLE_API_KEY!;
  const model = "models/gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${apiKey}`;

  const prompt = `Give bulletproof form cues for "${exerciseName}". Output JSON { tips: string[] }.`;
  const body = { contents: [{ parts: [{ text: prompt }]}] };
  const data = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) }).then(r=>r.json());
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try { return JSON.parse(text.match(/\{[\s\S]*\}$/)?.[0] ?? text); }
  catch { return { tips: [] }; }
}
