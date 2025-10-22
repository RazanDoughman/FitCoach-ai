import { NextRequest, NextResponse } from "next/server";
import { aiFormTips } from "@/lib/external";
import { rateLimit } from "@/lib/rateLimit";
import { clientKey, requireSession } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  await requireSession();
  const rl = rateLimit("ai-tips:" + clientKey(req), 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { 
        error: "You’ve reached your limit of 10 AI requests per minute. Please wait a moment and try again." 
      },
      { status: 429 }
    );
  }

  const { exerciseName } = await req.json();
  if (!exerciseName) return NextResponse.json({ error: "exerciseName required" }, { status: 400 });
  const tips = await aiFormTips(exerciseName);
  return NextResponse.json(tips);
}
