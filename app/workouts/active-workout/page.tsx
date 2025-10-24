"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface WorkoutTemplate {
  id: number;
  name: string;
  goal?: string;
  duration?: number;
  equipment?: string;
  targetMuscles?: string;
  createdAt?: string;
}

export default function ActiveWorkoutsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const { data, error } = await supabase
          .from("WorkoutTemplate")
          .select(
            "id, name, goal, duration, equipment, targetMuscles, createdAt"
          )
          .order("createdAt", { ascending: false });

        if (error) throw error;
        setWorkouts(data || []);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  return (
    <div className="relative min-h-screen flex justify-center items-start pt-28 pb-20">
      {/*  Background 4 + dim layer */}
      <div className="absolute inset-0 bg-[url('/background4.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/70" />

      {/*  Main container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 text-center">
        {/*  Centered title & description */}
        <h1 className="text-4xl font-bold text-primary mb-3">
          Active Workouts
        </h1>
        <p className="text-gray-300 mb-10 text-lg">
          Choose one of your saved workout routines and begin your next
          training session.
        </p>

        {/*  Workouts Section */}
        {loading ? (
          <p className="text-gray-400 text-center">Loading your workouts...</p>
        ) : workouts.length === 0 ? (
          <p className="text-gray-400 text-center">
            You don’t have any saved workouts yet. Create one to get started!
          </p>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                       gap-6 justify-items-center"
          >
            {workouts.map((w) => (
              <Card
                key={w.id}
                className="w-full max-w-sm px-10 py-10 bg-[#18181b]/80 border border-border 
                          rounded-2xl shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] 
                          transition-all backdrop-blur-md text-left scale-100 hover:scale-[1.02] justify-items-center"
              >


            
                {/*  Workout Title */}
                <h2 className="text-xl font-semibold text-primary mb-3 text-center">
                  {w.name}
                </h2>

                {/*  Workout Details */}
                <div className="text-sm text-gray-200 leading-relaxed space-y-1 mb-5">
                  <p>
                    <span className="text-secondary font-medium">Goal:</span>{" "}
                    {w.goal || "—"}
                  </p>
                  <p>
                    <span className="text-secondary font-medium">Duration:</span>{" "}
                    {w.duration ? `${w.duration} min` : "—"}
                  </p>
                  <p>
                    <span className="text-secondary font-medium">
                      Equipment:
                    </span>{" "}
                    {w.equipment || "—"}
                  </p>
                  <p>
                    <span className="text-secondary font-medium">
                      Target Muscles:
                    </span>{" "}
                    {w.targetMuscles || "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    Created on{" "}
                    {new Date(w.createdAt || "").toLocaleDateString()}
                  </p>
                </div>

                {/*  Start Routine Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={() => router.push(`/workouts/session/${w.id}`)}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Start Routine
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
