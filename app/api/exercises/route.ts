import { NextResponse } from "next/server";
import { fetchExercisesFromAPI } from "@/lib/external";
import { supabase } from "@/lib/supabaseClient";
import type { ExerciseAPIItem } from "@/lib/types";

export async function GET() {
  try {
    // 🔹 Fetch everything directly from ExerciseDB
    const apiItems = await fetchExercisesFromAPI();

    if (!Array.isArray(apiItems) || apiItems.length === 0) {
      return NextResponse.json({ error: "No exercises found" }, { status: 404 });
    }

    // 🔹 Clean and map data for Supabase
    const rows = apiItems.map((e: ExerciseAPIItem) => ({
      name: e.name,
      gifUrl: e.gifUrl ?? null,
      bodyPart: e.bodyPart ?? null,
      equipment: e.equipment ?? null,
      target: e.target ?? null,
      instructions: Array.isArray(e.instructions)
        ? e.instructions.join(" ")
        : e.instructions ?? null,
    }));

    // 🔹 Cache into Supabase
    const { error } = await supabase
      .from("Exercise")
      .upsert(rows, { onConflict: "name" });

    if (error) {
      console.error("Supabase upsert error:", error);
    }

    return NextResponse.json({ source: "api", items: rows });
  } catch (err) {
    console.error("Error fetching exercises:", err);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}
