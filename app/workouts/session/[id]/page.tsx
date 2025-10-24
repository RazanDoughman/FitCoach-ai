"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SetData {
  id: number;
  weight?: number;
  reps?: number;
  done?: boolean;
}

interface Exercise {
  id: number;
  name: string;
  recommendedSets?: number;
  recommendedReps?: number;
  recommendedWeight?: number;
  recommendedRest?: number;
  sets: SetData[];
}

interface WorkoutNoteExercise {
  exercise: string;
  sets: number;
  reps: number;
  rest: number;
  weight?: number;
}

export default function WorkoutSessionPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = Number(params.id);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // ✅ Fetch workout exercises
  useEffect(() => {
    async function fetchExercises() {
      try {
        const { data, error } = await supabase
          .from("WorkoutTemplate")
          .select("notes")
          .eq("id", workoutId)
          .single();

        if (error) throw error;

        if (data?.notes) {
          const parsed = JSON.parse(data.notes);
          const formatted = parsed.map((ex: WorkoutNoteExercise, i: number) => ({
            id: i + 1,
            name: ex.exercise || "Unnamed Exercise",
            recommendedSets: ex.sets,
            recommendedReps: ex.reps,
            recommendedWeight: ex.weight,
            recommendedRest: ex.rest,
            sets: [{ id: 1, weight: 0, reps: 0, done: false }],
          }));
          setExercises(formatted);
        }
      } catch (err) {
        console.error("Error fetching workout exercises:", err);
      } finally {
        setLoading(false);
      }
    }

    if (workoutId) fetchExercises();
  }, [workoutId]);

  // ⏱ Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleAddSet = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [...ex.sets, { id: ex.sets.length + 1, reps: 0, done: false }],
            }
          : ex
      )
    );
  };

  const handleDiscardSet = (exerciseId: number, setId: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
          : ex
      )
    );
  };

  const handleSetDone = (exerciseId: number, setId: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, done: !s.done } : s
              ),
            }
          : ex
      )
    );
  };

  // ✅ Save workout log on Finish
  async function handleFinishWorkout() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const { error } = await supabase.from("WorkoutLog").insert([
        {
          userId: user.id || null,
          userEmail: user.email || null,
          templateId: workoutId,
          durationMin: Math.floor(time / 60),
          notes: "completed",
        },
      ]);

      if (error) throw error;

      alert("Workout completed and saved!");
      router.push("/workouts");
    } catch (err) {
      console.error("Error saving workout log:", err);
      alert("Failed to save workout log. Try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading workout...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex justify-center items-start pt-28 pb-20">
      <div className="absolute inset-0 bg-[url('/background4.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-3">Active Session</h1>
        <p className="text-gray-300 mb-10 text-lg">
          Log your sets, reps, and weights as you progress through your workout.
        </p>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 text-gray-300">
          <p className="text-sm">⏱ Duration: {time}s</p>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6"
            >
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={() => router.push("/workouts/active-workout")}
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Discard
            </Button>
          </div>
        </div>

        {/* EXERCISES */}
        <div className="space-y-8">
          {exercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="p-6 bg-[#18181b]/80 border border-border rounded-2xl shadow-lg backdrop-blur-md"
            >
              <h2 className="text-xl font-semibold text-white mb-4 text-left flex items-center gap-2 flex-wrap">
                {exercise.name}
                {(exercise.recommendedSets ||
                  exercise.recommendedReps ||
                  exercise.recommendedWeight ||
                  exercise.recommendedRest) && (
                  <span className="text-secondary text-base font-normal">
                    ({exercise.recommendedSets ?? "?"} sets ×{" "}
                    {exercise.recommendedReps ?? "?"} reps
                    {exercise.recommendedWeight
                      ? ` – ${exercise.recommendedWeight}`
                      : ""}
                    {exercise.recommendedRest
                      ? `, ${exercise.recommendedRest}s rest`
                      : ""}
                    )
                  </span>
                )}
              </h2>

              <div className="space-y-3">
                {exercise.sets.map((set) => (
                  <div
                    key={set.id}
                    className={`flex items-center justify-between p-3 rounded-md transition-all ${
                      set.done ? "bg-green-900/40" : "bg-[#1f1f23]"
                    }`}
                  >
                    <span className="text-gray-300 font-medium">
                      Set {set.id}
                    </span>

                    <div className="flex items-center gap-6 text-gray-300">
                      <label className="flex items-center gap-2">
                        <span className="font-medium">Weight(Kg):</span>
                        <input
                          type="number"
                          className="w-24 bg-transparent border border-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          onChange={(e) =>
                            (set.weight = Number(e.target.value))
                          }
                        />
                      </label>

                      <label className="flex items-center gap-2">
                        <span className="font-medium">Reps:</span>
                        <input
                          type="number"
                          className="w-20 bg-transparent border border-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          onChange={(e) => (set.reps = Number(e.target.value))}
                        />
                      </label>

                      <div className="flex items-center gap-3">
                        <Button
                          className={`px-5 py-1 font-semibold ${
                            set.done
                              ? "bg-green-700 hover:bg-green-600"
                              : "bg-gray-700 hover:bg-gray-600"
                          } text-white rounded-md`}
                          onClick={() => handleSetDone(exercise.id, set.id)}
                        >
                          {set.done ? "✓ Done" : "Mark"}
                        </Button>

                        {set.id > 1 && (
                          <button
                            onClick={() =>
                              handleDiscardSet(exercise.id, set.id)
                            }
                            className="text-red-500 hover:text-red-400 text-sm font-semibold transition"
                            title="Remove this set"
                          >
                            —
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="mt-4 bg-primary hover:bg-primary/90 text-white w-full font-semibold py-2"
                onClick={() => handleAddSet(exercise.id)}
              >
                + Add Set
              </Button>
            </Card>
          ))}
        </div>

        {/* ✅ FOOTER */}
        <div className="mt-10 flex justify-between">
          <Button
            onClick={() => router.push("/workouts/active-workout")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-medium"
          >
            Discard Workout
          </Button>
          <Button
            onClick={handleFinishWorkout}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 font-semibold"
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}
