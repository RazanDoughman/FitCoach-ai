import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireSession } from "@/lib/auth-helpers";
import { z } from "zod";

const postSchema = z.object({
  loggedAt: z.string().datetime().optional(),
  food: z.string().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
});

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let q = supabase.from("NutritionLog").select("*").eq("userEmail", session.user!.email!);
  if (from) q = q.gte("loggedAt", from);
  if (to) q = q.lte("loggedAt", to);
  q = q.order("loggedAt", { ascending: false });

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const row = {
    ...parsed.data,
    loggedAt: parsed.data.loggedAt ?? new Date().toISOString(),
    userEmail: session.user!.email!,
    userId: session.user!.id,
  };

  const { data, error } = await supabase.from("NutritionLog").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
