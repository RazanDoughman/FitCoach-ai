import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";


export async function requireSession() {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const { data: user } = await supabase
    .from("User")
    .select("id, email, name")
    .eq("email", session.user!.email!)
    .single();

    return {
      ...session,
      user: {
        ...session.user,
        id: user?.id ?? null,
      },
  };}

export function clientKey(req: NextRequest) {
  return req.headers.get("x-forwarded-for") || "local";
}
