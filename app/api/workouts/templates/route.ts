import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await requireSession();

   const email = session.user?.email ?? null;
  if (!email) {
    return NextResponse.json([], { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return NextResponse.json([], { status: 200 });

  const workouts = await prisma.workoutTemplate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true }, // keep payload small
  });

  return NextResponse.json(workouts);
}
