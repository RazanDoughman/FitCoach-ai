import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await requireSession();

  const workouts = await prisma.workoutTemplate.findMany({
    where: { userEmail: session.user.email },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true }, // keep payload small
  });

  return NextResponse.json(workouts);
}
