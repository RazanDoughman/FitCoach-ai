import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-helpers";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const session = await requireSession();
  const { data } = await supabase.from("User").select("*").eq("email", session.user!.email!).single();
  return NextResponse.json(data ?? {});
}
