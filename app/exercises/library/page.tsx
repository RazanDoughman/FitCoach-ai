"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import ExerciseCard from "../components/ExerciseCard";


interface Exercise {
  id: number;
  name: string;
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  instructions?: string;
}

export default function ExerciseLibraryPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    bodyPart: "",
    equipment: "",
    target: "",
  });
  const [visibleCount, setVisibleCount] = useState(20); // how many to show
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);


  // 🔹 Fetch all exercises from API (1300+)
  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch("/api/exercises");
        const data = await res.json();
        console.log("✅ /api/exercises response:", data);

        const exercisesArray =
          data && Array.isArray(data.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];

        const cleaned: Exercise[] = (exercisesArray as Partial<Exercise>[])
          .filter((ex): ex is Exercise => !!ex && !!ex.name)
          .map((ex, index): Exercise => ({
                 id: typeof ex.id === "number" ? ex.id : index + 1000,
                name: ex.name?.trim() || "Unnamed Exercise",
                gifUrl: ex.gifUrl || "",
                bodyPart: ex.bodyPart || "",
                equipment: ex.equipment || "",
                target: ex.target || "",
                instructions: ex.instructions || "",
                }));


        setExercises(cleaned);
        setFilteredExercises(cleaned);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      }
    }
    fetchExercises();
  }, []);

  //  Filter + search across all 1300 exercises
  useEffect(() => {
    const results = exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesBodyPart = !filters.bodyPart || ex.bodyPart === filters.bodyPart;
      const matchesEquipment = !filters.equipment || ex.equipment === filters.equipment;
      const matchesTarget = !filters.target || ex.target === filters.target;
      return matchesSearch && matchesBodyPart && matchesEquipment && matchesTarget;
    });

    setFilteredExercises(results);
    setVisibleCount(20); 
  }, [search, filters, exercises]);

  async function ensureExerciseExists(exercise: Exercise) {
  // Try inserting if not already present
  const { error } = await supabase
    .from("Exercise")
    .upsert(
      [{
        id: exercise.id,
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        bodyPart: exercise.bodyPart,
        equipment: exercise.equipment,
        target: exercise.target,
        instructions: exercise.instructions,
      }],
      { onConflict: "id" } // avoids duplicate insert
    );

  if (error) console.error("Exercise sync error:", error);
}

  //  Save to Supabase
  async function handleSave(exerciseId: number) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id && !user.email) {
        alert("You must be logged in to save exercises");
        return;
        }

    const parsedUserId = Number(user.id);
    const parsedExercise = exercises.find((ex) => ex.id === exerciseId);

    if (!parsedExercise) {
    alert("Exercise not found!");
    return;
  }
    const { data: existing, error: lookupError } = await supabase
        .from("Exercise")
        .select("id")
        .eq("name", parsedExercise.name)
        .maybeSingle();

    if (lookupError) {
        console.error("Lookup failed:", lookupError);
        alert("Error checking exercise in database.");
        return;
    }

    if (!existing) {
        alert("This exercise doesn't exist in the Exercise table.");
        return;
    }

    const realExerciseId = existing.id; 

    const { error: saveError } = await supabase
        .from("SavedExercise")
        .insert([{ userId: parsedUserId, exerciseId: realExerciseId }]);

    if (saveError) {
        console.error("Save failed:", saveError);
        alert("Failed to save exercise.");
    } else {
        alert("✅ Exercise saved!");
    }
    }

  //  Load More Pagination
  function handleLoadMore() {
    setVisibleCount((prev) => prev + 20);
  }

  //  UI
  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-24 overflow-hidden text-white">
      {/* 🖼️ Background + Dim */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{
          backgroundImage: "url('/background4.jpg')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      {/*  Content Wrapper */}
      <div className="relative max-w-7xl w-full z-10">
        {/* 🔹 Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-primary">Exercise Library</h1>
          <p className="text-gray-300 text-sm">
            Explore exercises by body part, equipment, or target muscle.
          </p>
        </div>

        {/* 🔹 Search & Filters */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md mb-10">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 text-gray-800">
            <div className="w-full text-center font-semibold text-gray-700">
              Search & Filter
            </div>

            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              onChange={(e) =>
                setFilters({ ...filters, bodyPart: e.target.value })
              }
            >
              <option value="">Body Part</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="waist">Waist</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              onChange={(e) =>
                setFilters({ ...filters, equipment: e.target.value })
              }
            >
              <option value="">Equipment</option>
              <option value="body weight">Body Weight</option>
              <option value="barbell">Barbell</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="machine">Machine</option>
              <option value="resistance band">Resistance Band</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              onChange={(e) =>
                setFilters({ ...filters, target: e.target.value })
              }
            >
              <option value="">Target Muscle</option>
              <option value="biceps">Biceps</option>
              <option value="triceps">Triceps</option>
              <option value="chest">Chest</option>
              <option value="quads">Quads</option>
              <option value="abs">Abs</option>
              <option value="glutes">Glutes</option>
            </select>
          </div>
        </div>

        {/* 🔹 Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <p className="text-center text-gray-400">No exercises found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {filteredExercises.slice(0, visibleCount).map((ex) => (
                <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    onClick={() => setSelectedExercise(ex)} // opens modal
                    onSave={() => handleSave(ex.id)} // saves to Supabase
                    showSaveButton
                    />

              ))}
            </div>

            {/* 🧭 Load More Button */}
            {visibleCount < filteredExercises.length && (
              <div className="flex justify-center mb-12">
                <Button
                  onClick={handleLoadMore}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

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
        <video
          src={selectedExercise.gifUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-64 object-contain rounded mb-3 bg-gray-100"
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

      <div className="mt-5 flex justify-end gap-3">
        <Button onClick={() => setSelectedExercise(null)} variant="secondary">
          Close
        </Button>
        <Button
          onClick={() => handleSave(selectedExercise.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
