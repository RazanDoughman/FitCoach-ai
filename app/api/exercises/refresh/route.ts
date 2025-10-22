import { NextResponse } from "next/server";
import { fetchExercisesFromAPI } from "@/lib/external";
import { supabase } from "@/lib/supabaseClient";
import type { ExerciseAPIItem } from "@/lib/types";

export async function POST() {
  const all = await fetchExercisesFromAPI({ limit: 500 });

  const list: ExerciseAPIItem[] = Array.isArray(all) ? (all as ExerciseAPIItem[]) : [];

  const rows = list.map((e) => ({
    name: e.name,
    gifUrl: e.gifUrl ?? null,
    bodyPart: e.bodyPart ?? null,
    equipment: e.equipment ?? null,
    target: e.target ?? null,
    instructions: Array.isArray(e.instructions) ? e.instructions.join("\n") : (e.instructions ?? null),
  }));

  if (rows.length) {
const { error } = await supabase
      .from("Exercise")
      .upsert(rows, { onConflict: "name" });

    if (error) {
      console.error("Exercise upsert error (POST /api/exercises/refresh):", error);
      return NextResponse.json(
        { inserted: 0, upsertError: error.message },
        { status: 500 }
      );
    }
   }

  return NextResponse.json({ inserted: rows.length });
}
