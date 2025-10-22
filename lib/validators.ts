import { z } from "zod";

export const exerciseQuerySchema = z.object({
  limit: z.string().transform(Number).optional(),
  bodyPart: z.string().optional(),
  equipment: z.string().optional(),
  target: z.string().optional(),
  name: z.string().optional(),
});

export const nutritionSearchSchema = z.object({
  query: z.string().min(1),
});

export const nutritionParseSchema = z.object({
  text: z.string().min(1),
});

export const aiGenerateSchema = z.object({
  goal: z.string().min(2),
  level: z.enum(["beginner","intermediate","advanced"]),
  daysPerWeek: z.number().min(1).max(7),
  sessionMinutes: z.number().min(10).max(180),
  equipment: z.array(z.string()).default([]),
  targetMuscles: z.array(z.string()).default([]),
});

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  preferences: z.string().optional(),
  goals: z.string().optional(),
  equipment: z.string().optional(),
  dietaryInfo: z.string().optional(),
});
