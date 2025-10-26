import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await requireSession();

  const { data, error } = await supabase
    .from("WorkoutTemplate")
    .select("*")
    .eq("userEmail", session.user!.email!)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
