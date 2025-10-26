import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { status, note } = await req.json();

  const color =
    status === "completed"
      ? "#10B981" // green
      : status === "failed"
      ? "#EF4444" // red
      : status === "skipped"
      ? "#FACC15" // yellow
      : "#3B82F6"; // default blue

  const { data, error } = await supabase
    .from("WorkoutSchedule")
    .update({ status, note, color })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { error } = await supabase
    .from("WorkoutSchedule")
    .delete() 
    .eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
