import { NextResponse } from "next/server";
import { aiFormTips } from "@/lib/external";

export async function POST(req: Request) {
  try {
    const { exerciseName, question } = await req.json();

    if (!exerciseName || !question) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    const answer = await aiFormTips(exerciseName, question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Form Tips API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
