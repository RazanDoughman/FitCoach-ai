import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireSession } from "@/lib/auth-helpers";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await context.params; 

  const { data, error } = await supabase
    .from("WorkoutTemplate")
    .select("*")
    .eq("id", Number(id))
    .eq("userEmail", session.user!.email!)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await context.params; 
  const body = await req.json(); // { name?, notes? }

  const { data, error } = await supabase
    .from("WorkoutTemplate")
    .update(body)
    .eq("id", Number(id))
    .eq("userEmail", session.user!.email!)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("WorkoutTemplate")
    .update({
      goal: body.goal,
      duration: body.duration,
      equipment: body.equipment,
      targetMuscles: body.targetMuscles,
    })
    .eq("id", Number(id))
    .eq("userEmail", session.user!.email!)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await context.params; 

  const { error } = await supabase
    .from("WorkoutTemplate")
    .delete()
    .eq("id", Number(id))
    .eq("userEmail", session.user!.email!);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
