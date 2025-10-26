import * as dotenv from "dotenv";
import { resolve } from "path";


import fetch from "node-fetch";
import type { ExerciseAPIItem } from "@/lib/types";


// Manually load the same .env.local file that Next.js uses
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

function isExerciseArray(data: unknown): data is ExerciseAPIItem[] {
  return (
    Array.isArray(data) &&
    data.every((d) => d && typeof d === "object" && "name" in d)
  );
}

async function testExerciseDB() {
  const base = "https://exercisedb.p.rapidapi.com/exercises";
  const headers = {
    "x-rapidapi-key": process.env.EXERCISEDB_API_KEY ?? "",
    "x-rapidapi-host": process.env.EXERCISEDB_API_HOST ?? "",
  };

  console.log("🔑 Using API host:", process.env.EXERCISEDB_API_HOST);
  console.log("🔑 Key starts with:", process.env.EXERCISEDB_API_KEY?.slice(0, 5));

  const res = await fetch(`${base}?limit=1&offset=0`, { headers });
  console.log("Status:", res.status);

  const json = await res.json();
  console.log("🔍 Raw response:", JSON.stringify(json, null, 2));

  if (!isExerciseArray(json)) {
    throw new Error("Unexpected API response shape");
  }

  console.log("✅ First exercise:", json[0]);
}

testExerciseDB().catch((err) => {
  console.error("❌ Test failed:", err);
});
