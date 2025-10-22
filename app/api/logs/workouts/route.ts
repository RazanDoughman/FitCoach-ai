import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireSession } from "@/lib/auth-helpers";
import { z } from "zod";

const postSchema = z.object({
  templateId: z.number().int().optional(),
  startedAt: z.string().datetime().optional(),
  durationMin: z.number().int().min(1),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let q = supabase.from("WorkoutLog").select("*").eq("userEmail", session.user!.email!);
  if (from) q = q.gte("startedAt", from);
  if (to) q = q.lte("startedAt", to);
  q = q.order("startedAt", { ascending: false });

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
    startedAt: parsed.data.startedAt ?? new Date().toISOString(),
    userEmail: session.user!.email!,
    userId: session.user!.id,
  };

  const { data, error } = await supabase.from("WorkoutLog").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
