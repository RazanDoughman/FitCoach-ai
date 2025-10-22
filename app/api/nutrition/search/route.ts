import { NextRequest, NextResponse } from "next/server";
import { nutritionSearchSchema } from "@/lib/validators";
import { nutritionSearchInstant } from "@/lib/external";
import { rateLimit } from "@/lib/rateLimit";
import { clientKey } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const rl = rateLimit("nutri-search:" + clientKey(req), 30, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const url = new URL(req.url);
  const query = url.searchParams.get("query") ?? "";
  const parsed = nutritionSearchSchema.safeParse({ query });
  if (!parsed.success) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const data = await nutritionSearchInstant(parsed.data.query);
  return NextResponse.json(data);
}
