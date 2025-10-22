"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { hashPassword } from "@/utils/hash"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    try {
      const hashedPassword = await hashPassword(formData.password)
      const { data, error } = await supabase.from("User").insert([
        { name: formData.name, email: formData.email, password: hashedPassword },
      ])

      if (error) throw error

      alert("Account created successfully! You can now log in.")
      router.push("/login")
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message)
  } else {
    setError("An unexpected error occurred")
  }
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <input
          type="text" 
          placeholder="Name"
          className="w-full mb-3 p-3 border rounded bg-white text-black placeholder-gray-500"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded bg-white text-black placeholder-gray-500"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 border rounded bg-white text-black placeholder-gray-500"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          Register
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium">
            Sign In
          </a>
        </p>
      </form>
    </div>
  )
}
