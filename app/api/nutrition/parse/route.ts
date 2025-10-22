import { NextRequest, NextResponse } from "next/server";
import { nutritionParseSchema } from "@/lib/validators";
import { nutritionNatural } from "@/lib/external";
import { rateLimit } from "@/lib/rateLimit";
import { clientKey } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const rl = rateLimit("nutri-parse:" + clientKey(req), 20, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const body = await req.json();
  const parsed = nutritionParseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const data = await nutritionNatural(parsed.data.text);
  return NextResponse.json(data);
}
