"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"


export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
    if (res?.error) setError(res.error);
    else {
       const { data, error } = await supabase
      .from("User")
      .select("name, email")
      .eq("email", formData.email)
      .single()

    if (!error && data) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          name: data.name || "Athlete",
        })
      );

     
      window.dispatchEvent(new Event("authChange"));
    }
      router.push("/dashboard");
  }
}

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B0B0B] text-white relative">
      {/* dim overlay */}
      <div className="absolute inset-0 bg-[url('/background2.jpg')] bg-cover bg-center opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-[#141414] p-10 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.15)]"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome Back <span className="text-primary">Athlete</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 transition-all text-lg px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
