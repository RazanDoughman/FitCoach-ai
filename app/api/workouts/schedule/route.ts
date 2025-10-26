import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json([], { status: 200 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json([], { status: 200 });

  const schedules = await prisma.workoutSchedule.findMany({
    where: { userId: user.id },
    include: { workout: true },
  });

  const events = schedules.map((s) => ({
    id: s.id.toString(),
    title: s.workout?.name ?? "Unnamed Workout",
    start: s.date ? s.date.toISOString() : new Date().toISOString(), 
    color:
      s.status === "completed"
        ? "#10B981"
        : s.status === "missed"
        ? "#EF4444"
        : "#3B82F6",
  }));

  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

 const body = await req.json();
  const workoutId = Number(body?.workoutId);
  const dateStr = String(body?.date);
  if (!workoutId || !dateStr) {
    return NextResponse.json(
      { error: "workoutId and date are required" },
      { status: 400 }
    );
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select  : { id: true },
  });
 if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const userId = user.id;

  const tpl = await prisma.workoutTemplate.findFirst({
    where: { id: workoutId, userId },
    select: { id: true },
  });
  if (!tpl) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const newSchedule = await prisma.workoutSchedule.create({
      data: {
        userId,
        workoutId,
        date: new Date(dateStr),
        status: "upcoming",
        color: "#3B82F6",
      },
    });



  return NextResponse.json(newSchedule);
}
