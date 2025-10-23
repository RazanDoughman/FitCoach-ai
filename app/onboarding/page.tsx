"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkIfOnboarded() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) return;

      const { data, error } = await supabase
        .from("User")
        .select("isOnboarded")
        .eq("email", user.email)
        .single();

      if (!error && data?.isOnboarded) {
        router.push("/dashboard");
      }
    }

    checkIfOnboarded();
  }, [router]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    goals: "",
    equipment: "",
    dietaryInfo: "",
  });

  const handleNext = () => {
    setErrorMessage("");

    if (step === 1) {
      const { gender, age, height, weight } = formData;
      if (!gender || !age || !height || !weight) {
        setErrorMessage("Please fill in all fields before continuing.");
        return;
      }
    }

    if (step === 2 && !formData.goals) {
      setErrorMessage("Please select your fitness goal before continuing.");
      return;
    }

    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  async function handleSubmit() {
    setErrorMessage("");
    const { gender, age, height, weight, goals, equipment, dietaryInfo } = formData;

    if (!gender || !age || !height || !weight || !goals || !equipment || !dietaryInfo) {
      setErrorMessage("Please fill in all fields before finishing onboarding.");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const preferences = { gender, age, height, weight };

      const { error } = await supabase
        .from("User")
        .update({
          preferences: JSON.stringify(preferences),
          goals,
          equipment,
          dietaryInfo,
          isOnboarded: true,
        })
        .eq("email", user.email);

      if (error) throw error;

    window.dispatchEvent(new Event("authChange"));

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error saving onboarding info. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen relative flex items-center justify-center text-white font-sans px-6"
      style={{
        backgroundImage: "url('/background3.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/75" />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-[#141414]/90 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)]"
      >
        <div className="flex justify-between mb-6 text-sm text-gray-400">
          <span>Step {step} of 3</span>
          <span>{["Profile", "Goals", "Equipment"][step - 1]}</span>
        </div>

        {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Tell Us About You</h2>

              {/* Gender Buttons */}
              <div className="flex justify-center gap-6">
                {["Male", "Female"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`w-24 h-24 flex flex-col items-center justify-center rounded-full border-2 ${
                      formData.gender === gender
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-gray-600 hover:border-amber-400"
                    }`}
                  >
                    <i
                      className={`bi ${
                        gender === "Male" ? "bi-gender-male" : "bi-gender-female"
                      } text-3xl mb-2`}
                    />
                    {gender}
                  </button>
                ))}
              </div>

              {/* Age / Height / Weight */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <input
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="p-3 bg-[#0B0B0B] border border-gray-700 rounded-lg text-center"
                />
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="p-3 bg-[#0B0B0B] border border-gray-700 rounded-lg text-center"
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="p-3 bg-[#0B0B0B] border border-gray-700 rounded-lg text-center col-span-2"
                />
              </div>

              {/* 🥗 Dietary Info Dropdown */}
              <div className="mt-6 text-left">
                <h3 className="text-lg font-medium mb-2 text-center">Are you following any specific diet?</h3>
                <select
                  value={formData.dietaryInfo}
                  onChange={(e) => setFormData({ ...formData, dietaryInfo: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-gray-700 rounded-lg text-center focus:outline-none focus:border-amber-400"
                >
                  <option value="">Select a diet</option>
                  <option value="None">None</option>
                  <option value="Keto">Keto</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Mediterranean">Mediterranean</option>
                </select>
              </div>
            </div>
          )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold mb-4">What Is Your Goal?</h2>
            <div className="flex flex-col gap-4">
              {["Lose Weight", "Build Muscle", "Stay Fit"].map((goals) => (
                <button
                  key={goals}
                  onClick={() => setFormData({ ...formData, goals })}
                  className={`py-3 rounded-full border-2 ${
                    formData.goals === goals
                      ? "border-green-400 bg-green-400/20"
                      : "border-gray-700 hover:border-green-400"
                  }`}
                >
                  {goals}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold mb-4">What Equipment Do You Use?</h2>
            <div className="flex flex-col gap-4">
              {["None", "Home", "Gym", "Dumbbells"].map((equipment) => (
                <button
                  key={equipment}
                  onClick={() => setFormData({ ...formData, equipment })}
                  className={`py-3 rounded-full border-2 ${
                    formData.equipment === equipment
                      ? "border-blue-400 bg-blue-400/20"
                      : "border-gray-700 hover:border-blue-400"
                  }`}
                >
                  {equipment}
                </button>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center mt-6 bg-red-500/10 border border-red-500/30 py-2 rounded-lg"
          >
            {errorMessage}
          </motion.div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-semibold transition"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full font-semibold transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </motion.div>
    </main>
  );
}
