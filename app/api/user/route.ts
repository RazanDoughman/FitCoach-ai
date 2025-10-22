import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-helpers";
import { supabase } from "@/lib/supabaseClient";
import { userUpdateSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest) {
  const session = await requireSession();
  const body = await req.json();
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { error } = await supabase.from("User").update(parsed.data).eq("email", session.user!.email!);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
