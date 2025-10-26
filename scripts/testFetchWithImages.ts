import * as dotenv from "dotenv";
import { resolve } from "path";
import fetch from "node-fetch";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Define a strict type for each exercise
interface ExerciseAPIItem {
  id: string;
  name: string;
  gifUrl?: string | null;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  instructions?: string | string[];
}

async function testFetchWithImages(): Promise<void> {
  const base = "https://exercisedb.p.rapidapi.com/exercises";
  const headers: Record<string, string> = {
    "x-rapidapi-key": process.env.EXERCISEDB_API_KEY ?? "",
    "x-rapidapi-host": process.env.EXERCISEDB_API_HOST ?? "",
  };

  const batchSize = 5; // smaller batch for testing

  try {
    // 1️⃣ Fetch basic exercise data
    const url = `${base}?limit=${batchSize}&offset=0`;
    const response = await fetch(url, { headers });
    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      console.error("❌ Unexpected data structure:", data);
      return;
    }

    // Validate and map to proper type
    const allExercises: ExerciseAPIItem[] = data
      .filter((item): item is ExerciseAPIItem =>
        typeof item.id === "string" && typeof item.name === "string"
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        bodyPart: item.bodyPart,
        equipment: item.equipment,
        target: item.target,
        instructions: item.instructions,
      }));

    console.log(`✅ Fetched ${allExercises.length} exercises`);

    // 2️⃣ Fetch detail data for each to get gifUrl
    const detailedExercises: ExerciseAPIItem[] = [];

    for (const ex of allExercises) {
      const detailUrl = `${base}/exercise/${ex.id}`;
      const detailRes = await fetch(detailUrl, { headers });

      if (!detailRes.ok) {
        console.warn(`⚠️ Failed to fetch details for ${ex.name}`);
        continue;
      }

      const detailData = (await detailRes.json()) as unknown;

      if (
        typeof detailData === "object" &&
        detailData !== null &&
        "gifUrl" in detailData
      ) {
        const gifUrl =
          typeof (detailData as { gifUrl?: string }).gifUrl === "string"
            ? (detailData as { gifUrl: string }).gifUrl
            : null;

        detailedExercises.push({ ...ex, gifUrl });
        console.log(`🎥 ${ex.name} → ${gifUrl}`);
      } else {
        detailedExercises.push({ ...ex, gifUrl: null });
      }
    }

    console.log("\n✅ Example with image:");
    console.log(JSON.stringify(detailedExercises[0], null, 2));
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
  }
}

testFetchWithImages();
