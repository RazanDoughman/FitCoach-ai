import { NextRequest, NextResponse } from "next/server";
import { exerciseQuerySchema } from "@/lib/validators";
import { fetchExercisesFromAPI } from "@/lib/external";
import { supabase } from "@/lib/supabaseClient";
import { rateLimit } from "@/lib/rateLimit";
import { clientKey } from "@/lib/auth-helpers";
import type { ExerciseAPIItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  const rl = rateLimit("exercises:" + clientKey(req), 60, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const url = new URL(req.url);
  const parsed = exerciseQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });

  const q = parsed.data;

  {
    let qdb = supabase.from("Exercise").select("*").limit(q.limit ?? 50);
    if (q.bodyPart)  qdb = qdb.eq("bodyPart", q.bodyPart);
    if (q.equipment) qdb = qdb.eq("equipment", q.equipment);
    if (q.target)    qdb = qdb.eq("target", q.target);
    if (q.name)      qdb = qdb.ilike("name", `%${q.name}%`);

    const { data } = await qdb;
    if (data && data.length) {
      return NextResponse.json({ source: "cache", items: data });
    }
  }
  
  // fetch external + upsert cache
  const apiItems = await fetchExercisesFromAPI(q);

  if (Array.isArray(apiItems)) {
    const rows = (Array.isArray(apiItems) ? apiItems : [])
    .slice(0, q.limit ?? 50)
    .map((e: ExerciseAPIItem) => ({
      name: e.name,
      gifUrl: e.gifUrl ?? null,
      bodyPart: e.bodyPart ?? null,
      equipment: e.equipment ?? null,
      target: e.target ?? null,
      instructions: e.instructions ?? null
    }));

    if (rows.length) {
    const { error } = await supabase
      .from("Exercise")
      .upsert(rows, { onConflict: "name" });

    if (error) {
      console.error("Exercise upsert error (GET /api/exercises):", error);
      return NextResponse.json(
        { source: "api", items: rows, upsertError: error.message },
        { status: 500 }
      );
    }
  }
    return NextResponse.json({ source: "api", items: rows });
  }

  return NextResponse.json({ items: [] });
}
