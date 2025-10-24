import { NextRequest, NextResponse } from "next/server";
import { aiGenerateSchema } from "@/lib/validators";
import { aiGenerateWorkout } from "@/lib/external";
import { rateLimit } from "@/lib/rateLimit";
import { clientKey, requireSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await requireSession();
  const rl = rateLimit("ai-gen:" + clientKey(req), 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { 
        error: "You’ve reached your limit of 10 AI requests per minute. Please wait a moment and try again." 
      },
      { status: 429 }
    );
  }
  const payload = await req.json();
  const parsed = aiGenerateSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const plan = await aiGenerateWorkout(parsed.data);
  return NextResponse.json(plan);
}
