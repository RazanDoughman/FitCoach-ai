import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { status, note } = await req.json();

  const color =
    status === "completed"
      ? "#10B981"
      : status === "failed"
      ? "#EF4444"
      : "#FACC15"; // yellow = skipped

  const updated = await prisma.workoutSchedule.update({
    where: { id: Number(params.id) },
    data: { status, note, color },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.workoutSchedule.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
