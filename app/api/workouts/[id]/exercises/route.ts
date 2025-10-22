import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireSession } from "@/lib/auth-helpers";
import { z } from "zod";

const addSchema = z.object({
  items: z.array(z.object({
    exerciseId: z.number().int(),
    order: z.number().int().min(1),
    sets: z.number().int().min(1),
    reps: z.number().int().min(1),
    restSec: z.number().int().min(0).default(60),
  })).min(1)
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  const templateId = Number(params.id);

  // Ensure template belongs to user
  const { data: tmpl, error: te } = await supabase
    .from("WorkoutTemplate")
    .select("id,userEmail")
    .eq("id", templateId)
    .single();
  if (te || !tmpl || tmpl.userEmail !== session.user!.email)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("TemplateExercise")
    .select("*")
    .eq("templateId", templateId)
    .order("order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  const templateId = Number(params.id);
  const body = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // check ownership
  const { data: tmpl, error: te } = await supabase
    .from("WorkoutTemplate")
    .select("id,userEmail")
    .eq("id", templateId)
    .single();
  if (te || !tmpl || tmpl.userEmail !== session.user!.email)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rows = parsed.data.items.map(i => ({ ...i, templateId }));
  const { data, error } = await supabase
    .from("TemplateExercise")
    .insert(rows)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
