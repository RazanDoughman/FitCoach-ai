"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

type AIExercise = {
  exercise: string;
  sets?: number;
  reps?: number;
  rest?: number;
  weight?: string | number;
};


export default function AIWorkoutBuilderPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIExercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    goal: "",
    level: "",
    duration: "",
    equipment: "",
    targetMuscles: "",
  });

  const equipmentOptions = [
    "Dumbbells",
    "Barbell",
    "Resistance Bands",
    "Bodyweight",
    "Machine",
  ];

  const muscleOptions = [
    "Chest",
    "Back",
    "Legs",
    "Arms",
    "Shoulders",
    "Core",
    "Full Body",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult([]);

    try {
      const res = await fetch("/api/ai/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        goal: formData.goal,
        level: formData.level.toLowerCase(),
        daysPerWeek: 4, 
        sessionMinutes: Number(formData.duration),
        equipment: [formData.equipment],
        targetMuscles: [formData.targetMuscles], 
      }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Gemini may return either { plan: [...] } or a direct array
        setResult(data.plan || data);
      }
    } catch (err) {
      console.error("AI generation error:", err);
      setError("Something went wrong while generating your workout.");
    } finally {
      setLoading(false);
    }

  }

  async function handleSaveWorkout() {
  try {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${formData.goal} Workout`,
        notes: JSON.stringify(result),
        goal: formData.goal,
        duration: Number(formData.duration),
        equipment: formData.equipment,
        targetMuscles: formData.targetMuscles,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(" Workout template saved successfully!");
      setResult([]); // Close modal after saving
    } else {
      alert(` Failed to save: ${data.error}`);
    }
  } catch (err) {
    console.error("Error saving workout:", err);
    alert("Something went wrong while saving the workout.");
  }
}



  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-28 bg-cover bg-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/background4.jpg')" }}
      />
      {/* 🔹 Dim background overlay */}
      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      {/* 🔹 Header */}
      <div className="text-center text-white mb-12">
        <h1 className="text-5xl font-bold mb-2">AI Workout Builder</h1>
        <p className="text-gray-300 text-sm">
          Generate a personalized workout plan based on your fitness preferences.
        </p>
      </div>

      {/* 🔹 Form Section */}
      <Card className="bg-white/90 backdrop-blur-md border border-amber-400 rounded-2xl p-6 max-w-2xl w-full text-gray-800 mb-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm"
        >
          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold mb-2">Goal</label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 placeholder-gray-300 border-gray-400 focus:ring-0"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              required
            >
              <option value="">Select goal</option>
              <option>Strength</option>
              <option>Weight Loss</option>
              <option>Endurance</option>
              <option>Mobility</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Fitness Level
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 placeholder-gray-200 border-gray-400 focus:ring-0"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              required
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Workout Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 text-gray-700 placeholder-gray-400 border-gray-400 focus:ring-0"
              placeholder="e.g. 45"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              required
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Equipment Available
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 placeholder-gray-300 border-gray-400 focus:ring-0"
              value={formData.equipment}
              onChange={(e) =>
                setFormData({ ...formData, equipment: e.target.value })
              }
              required
            >
              <option value="">Select equipment</option>
              {equipmentOptions.map((eq) => (
                <option key={eq}>{eq}</option>
              ))}
            </select>
          </div>

          {/* Target Muscles */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Target Muscles
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 placeholder-gray-300 border-gray-400 focus:ring-0"
              value={formData.targetMuscles}
              onChange={(e) =>
                setFormData({ ...formData, targetMuscles: e.target.value })
              }
              required
            >
              <option value="">Select muscle group</option>
              {muscleOptions.map((muscle) => (
                <option key={muscle}>{muscle}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-full transition"
            >
              {loading ? "Generating..." : "Generate Workout"}
            </button>
          </div>
        </form>
      </Card>

      {/* Error message */}
      {error && (
        <p className="text-red-400 text-sm font-medium mb-4">{error}</p>
      )}

      {/* AI Output */}
      {result.length > 0 && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
          <Card className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 p-8 w-full max-w-2xl text-gray-800 shadow-xl relative">
            {/* Close button */}
            <button
              onClick={() => setResult([])}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              AI-Generated Workout
            </h2>

            {/* Exercise list */}
            <div className="space-y-3 max-h-80 overflow-y-auto px-2">
              {result.map((exercise, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 bg-white/80 hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {exercise.exercise}
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Sets:</strong> {exercise.sets}</p>
                    <p><strong>Reps:</strong> {exercise.reps}</p>
                    <p><strong>Rest:</strong> {exercise.rest}s</p>
                    {exercise.weight && (
                      <p>
                        <strong>Weight:</strong>{" "}
                        <span className="text-green-600 font-semibold">
                          {typeof exercise.weight === "number"
                            ? `${exercise.weight} kg`
                            : exercise.weight}
                        </span>
                      </p>
                    )}
                    
                  </div>
                </div>
              ))}
            </div>

            {/* Save + Cancel buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleSaveWorkout}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
              >
                Save Workout
              </button>
              <button
                onClick={() => setResult([])}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}

    </motion.div>
  );
}
