import * as dotenv from "dotenv";
import { resolve } from "path";
import fetch from "node-fetch";

// Load environment variables (Next.js doesn't do this automatically in scripts)
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

interface ExerciseAPIItem {
  id: string;
  name: string;
  gifUrl?: string | null;
  bodyPart?: string | null;
  equipment?: string | null;
  target?: string | null;
  instructions?: string[] | string | null;
}

async function testFetchWithGifUrls(): Promise<void> {
  const base = "https://exercisedb.p.rapidapi.com/exercises";
  const headers: Record<string, string> = {
    "x-rapidapi-key": process.env.EXERCISEDB_API_KEY ?? "",
    "x-rapidapi-host": process.env.EXERCISEDB_API_HOST ?? "",
  };

  const batchSize = 5; // just 5 for quick testing
  const url = `${base}?limit=${batchSize}&offset=0`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`❌ Failed to fetch: ${response.status} ${response.statusText}`);
      return;
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      console.error("❌ Unexpected data structure:", data);
      return;
    }

    const exercises: ExerciseAPIItem[] = data
      .filter(
        (ex): ex is ExerciseAPIItem =>
          typeof ex.id === "string" && typeof ex.name === "string"
      )
      .map((ex) => ({
        id: ex.id,
        name: ex.name,
        gifUrl: `https://v2.exercisedb.io/image/${ex.id}.gif`,
        bodyPart: ex.bodyPart ?? null,
        equipment: ex.equipment ?? null,
        target: ex.target ?? null,
        instructions: Array.isArray(ex.instructions)
          ? ex.instructions
          : typeof ex.instructions === "string"
          ? [ex.instructions]
          : null,
      }));

    console.log(`✅ Fetched ${exercises.length} exercises`);
    for (const ex of exercises) {
      console.log(`🎥 ${ex.name} → ${ex.gifUrl}`);
    }

    console.log("\n✅ Example exercise:");
    console.log(JSON.stringify(exercises[0], null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testFetchWithGifUrls();
