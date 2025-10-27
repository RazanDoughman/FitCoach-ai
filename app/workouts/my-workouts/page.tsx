"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";


interface Exercise {
  exercise: string;
  sets?: number;
  reps?: number;
  rest?: number;
  weight?: string | number; // ✅ added weight field
}

interface WorkoutTemplate {
  id: number;
  name: string;
  goal?: string;
  duration?: number;
  equipment?: string;
  targetMuscles?: string;
  createdAt: string;
  notes?: string;
}

/* ---------------------------- VIEW MODAL ---------------------------- */
function WorkoutViewModal({
  workout,
  onClose,
}: {
  workout: WorkoutTemplate | null;
  onClose: () => void;
}) {
  if (!workout) return null;

  let exercises: Exercise[] = [];
  try {
    exercises = JSON.parse(workout.notes || "[]");
  } catch {
    exercises = [];
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl border border-amber-400 shadow-xl p-6 max-w-lg w-full">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {workout.name}
        </h2>

        {/* Basic Info */}
        <div className="space-y-1 text-gray-700 mb-4 text-sm">
          <p><strong>Goal:</strong> {workout.goal || "—"}</p>
          <p><strong>Duration:</strong> {workout.duration ? `${workout.duration} mins` : "—"}</p>
          <p><strong>Equipment:</strong> {workout.equipment || "—"}</p>
          <p><strong>Target Muscles:</strong> {workout.targetMuscles || "—"}</p>
        </div>

        {/* Exercises */}
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Exercises:</h3>
        <div className="max-h-64 overflow-y-auto space-y-3">
          {exercises.length > 0 ? (
            exercises.map((ex, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition"
              >
                <h4 className="font-semibold text-gray-900">{ex.exercise}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Sets:</strong> {ex.sets || "—"} &nbsp;&nbsp;
                  <strong>Reps:</strong> {ex.reps || "—"} &nbsp;&nbsp;
                  <strong>Rest:</strong> {ex.rest ? `${ex.rest}s` : "—"} &nbsp;&nbsp;
                  {ex.weight && (
                    <>
                      <strong>Weight:</strong>{" "}
                      <span className="text-green-600 font-semibold">
                        {typeof ex.weight === "number"
                          ? `${ex.weight} kg`
                          : ex.weight}
                      </span>
                    </>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No exercises found.</p>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- MAIN PAGE ---------------------------- */
export default function MyWorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutTemplate | null>(null);

    const router = useRouter();
      
        useEffect(() => {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          if (!user.email) {
            router.push("/login"); // redirect if not logged in
            return;
          }
        }, [router]);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const res = await fetch("/api/workouts");
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load workouts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkouts();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this workout?")) return;

    const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Workout deleted successfully!");
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } else {
      alert("Failed to delete workout.");
    }
  }

  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-28 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/background4.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/70 -z-10" />

      {/* Header */}
      <div className="text-center text-white mb-12">
        <h1 className="text-3xl font-bold mb-2">My Workouts</h1>
        <p className="text-gray-300 text-sm">
          View, manage, and edit your saved workout templates.
        </p>
      </div>

      {/* Workouts List */}
      {loading ? (
        <p className="text-gray-300">Loading your workouts...</p>
      ) : workouts.length === 0 ? (
        <p className="text-gray-400">
          You haven’t saved any workouts yet. Generate one using the AI Builder!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {workouts.map((workout, i) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-md rounded-2xl border border-green-500 p-6 text-left hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {workout.name || "Unnamed Workout"}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Goal: {workout.goal || "—"}
                </p>

                <div className="flex flex-col gap-1 text-sm text-gray-500 mb-4">
                  <p>
                    Duration:{" "}
                    {workout.duration ? `${workout.duration} min` : "—"}
                  </p>
                  <p>Equipment: {workout.equipment || "—"}</p>
                  <p>Target Muscles: {workout.targetMuscles || "—"}</p>
                </div>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => setSelectedWorkout(workout)}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  Created on {new Date(workout.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedWorkout && (
        <WorkoutViewModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </motion.div>
  );
}
