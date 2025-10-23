"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { hashPassword } from "@/utils/hash";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const hashedPassword = await hashPassword(formData.password);
      const { error } = await supabase.from("User").insert([
        { name: formData.name, email: formData.email, password: hashedPassword },
      ]);
      if (error) throw error;
      localStorage.setItem(
        "user",
        JSON.stringify({ email: formData.email, name: formData.name })
      );
      window.dispatchEvent(new Event("authChange"));
      router.push("/onboarding");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B0B0B] text-white relative">
      {/* background overlay */}
      <div className="absolute inset-0 bg-[url('/background2.jpg')] bg-cover bg-center opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-[#141414] p-10 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.15)]"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          Join <span className="text-secondary">FitCoach AI</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-gray-700 text-white placeholder-gray-400 focus:border-secondary focus:outline-none transition"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-gray-700 text-white placeholder-gray-400 focus:border-secondary focus:outline-none transition"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-gray-700 text-white placeholder-gray-400 focus:border-secondary focus:outline-none transition"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-secondary hover:bg-emerald-600 transition-all text-lg px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
