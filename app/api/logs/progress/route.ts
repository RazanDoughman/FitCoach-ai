import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireSession } from "@/lib/auth-helpers";
import { z } from "zod";

const postSchema = z.object({
  date: z.string().date().optional(),  // "YYYY-MM-DD"
  weightKg: z.number().min(10).max(500),
  bodyFatPct: z.number().min(1).max(75).optional(),
});

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let q = supabase.from("ProgressLog").select("*").eq("userEmail", session.user!.email!);
  if (from) q = q.gte("date", from);
  if (to) q = q.lte("date", to);
  q = q.order("date", { ascending: false });

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
    date: parsed.data.date ?? new Date().toISOString().slice(0,10),
    userEmail: session.user!.email!,
     userId: session.user!.id,
  };

  const { data, error } = await supabase.from("ProgressLog").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
