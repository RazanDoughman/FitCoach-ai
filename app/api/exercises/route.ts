import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // 🧠 Fetch all exercises from your Supabase "Exercise" table
    const { data, error } = await supabase
      .from("Exercise")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Supabase fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ No exercises found in Supabase");
      return NextResponse.json({ message: "No exercises found" }, { status: 404 });
    }

    console.log(`✅ Successfully fetched ${data.length} exercises from Supabase`);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("❌ Unexpected error fetching exercises:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
