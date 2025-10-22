import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-helpers";
import { supabase } from "@/lib/supabaseClient";

type UserSession = {
  user: {
    id: number;
    email: string;
    name?: string;
  };
};

export async function GET() {
  const session = await requireSession();

  const { data } = await supabase
  .from("WorkoutTemplate")
  .select("*")
  .eq("userEmail", session.user!.email!);

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const rawSession = await requireSession();
  const session = rawSession as unknown as UserSession;

  const body = await req.json();

  const row = { 
    ...body, 
    userEmail: session.user!.email!,
    userId: session.user.id,
    };

  const { data, error } = await supabase
  .from("WorkoutTemplate")
  .insert(row).
  select()
  .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
