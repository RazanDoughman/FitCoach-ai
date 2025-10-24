import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const workouts = await prisma.workoutTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(workouts);
}
