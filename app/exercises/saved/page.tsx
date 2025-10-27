"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface SavedExercise {
  id: number;
  exerciseId: number;
  name: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  gifUrl?: string;
  instructions?: string;
}

export default function SavedExercisesPage() {
  const [savedExercises, setSavedExercises] = useState<SavedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<SavedExercise | null>(null);

  const router = useRouter();
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) {
        router.push("/login");
      }
    }, [router]);


  useEffect(() => {
    async function fetchSavedExercises() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;

        const { data, error } = await supabase
          .from("SavedExercise")
          .select(`
            id,
            exerciseId,
            Exercise (
              id,
              name,
              gifUrl,
              bodyPart,
              equipment,
              target,
              instructions
            )
          `)
          .eq("userId", user.id);

        if (error) throw error;

        interface SupabaseSavedExercise {
          id: number;
          exerciseId: number;
          Exercise:
            | {
                id: number;
                name: string;
                gifUrl?: string;
                bodyPart?: string;
                equipment?: string;
                target?: string;
                instructions?: string;
              }
            | { 
                id: number;
                name: string;
                gifUrl?: string;
                bodyPart?: string;
                equipment?: string;
                target?: string;
                instructions?: string;
              }[]
            | null;
        }

        const formatted: SavedExercise[] = (Array.isArray(data)
          ? data.map((item) => {
              const exerciseItem = Array.isArray(item.Exercise)
                ? item.Exercise[0]
                : item.Exercise;

              return {
                id: Number(item.id),
                exerciseId: Number(item.exerciseId),
                name: exerciseItem?.name ?? "Unnamed Exercise",
                gifUrl: exerciseItem?.gifUrl ?? "",
                bodyPart: exerciseItem?.bodyPart ?? "",
                equipment: exerciseItem?.equipment ?? "",
                target: exerciseItem?.target ?? "",
                instructions: exerciseItem?.instructions ?? "",
              };
            })
          : []);

        setSavedExercises(formatted);
      } catch (err) {
        console.error("Failed to load saved exercises:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedExercises();
  }, []);

  async function handleRemove(id: number) {
    if (!confirm("Remove this exercise from your saved list?")) return;

    const { error } = await supabase.from("SavedExercise").delete().eq("id", id);
    if (error) console.error("Delete failed:", error);
    else {
      alert("Exercise removed!");
      setSavedExercises((prev) => prev.filter((e) => e.id !== id));
    }
  }

  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-28 overflow-hidden text-white"
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
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2 text-primary">Saved Exercises</h1>
        <p className="text-gray-300 text-sm">
          View and manage all the exercises you’ve saved to your personal library.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-300">Loading your saved exercises...</p>
      ) : savedExercises.length === 0 ? (
        <p className="text-gray-400">
          You haven’t saved any exercises yet. Browse the Exercise Library to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {savedExercises.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                onClick={() => setSelectedExercise(ex)}
                className="bg-white/90 backdrop-blur-md rounded-2xl border border-blue-500 p-5 text-gray-900 hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-pointer"
              >
                {ex.gifUrl && (
                  <img
                    src={ex.gifUrl}
                    alt={ex.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}

                <h3 className="font-bold text-lg mb-1 text-gray-900 text-center">
                  {ex.name}
                </h3>

                <p className="text-sm text-gray-600 text-center mb-2">
                  {ex.target || "—"} | {ex.equipment || "—"}
                </p>

                <p className="text-xs text-gray-500 text-center mb-4">
                  Body Part: {ex.bodyPart || "—"}
                </p>

                <div className="flex justify-center">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(ex.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🔹 Popup Modal for Exercise Details */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 rounded-2xl p-6 w-[90%] md:w-[500px] relative shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-center">
              {selectedExercise.name}
            </h2>

            {selectedExercise.gifUrl && (
              <img
                src={selectedExercise.gifUrl}
                alt={selectedExercise.name}
                className="w-full h-64 object-cover rounded mb-3"
              />
            )}

            <div className="space-y-2 text-sm">
              <p><strong>Body Part:</strong> {selectedExercise.bodyPart || "N/A"}</p>
              <p><strong>Equipment:</strong> {selectedExercise.equipment || "N/A"}</p>
              <p><strong>Target:</strong> {selectedExercise.target || "N/A"}</p>
              <p className="whitespace-pre-line">
                {selectedExercise.instructions || "No instructions available."}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <Button onClick={() => setSelectedExercise(null)} variant="secondary">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
