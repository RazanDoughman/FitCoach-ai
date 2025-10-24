"use client";

import { useState } from "react";
import { aiFormTips } from "@/lib/external";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ExerciseAiTipsPage() {
  const [exerciseName, setExerciseName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const exampleQuestions = [
    "How do I improve my squat form?",
    "What should I focus on when doing push-ups?",
    "How can I avoid injury when deadlifting?",
    "What’s the best breathing technique for bench press?",
  ];

  async function handleAsk() {
  if (!question.trim()) return alert("Please enter a question.");
  setLoading(true);

  try {
    const res = await fetch("/api/ai/form-tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseName, question }),
    });

    const data = await res.json();
    setAnswer(data.answer || data.error || "No response.");
  } catch (err) {
    console.error("Error calling AI:", err);
    setAnswer("Sorry, something went wrong.");
  } finally {
    setLoading(false);
  }
}


  return (
  <div className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden text-white">
    {/* 🖼️ Background */}
    <div
      className="absolute inset-0 bg-cover bg-center -z-20"
      style={{ backgroundImage: "url('/background4.jpg')" }}
    ></div>
    <div className="absolute inset-0 bg-black/70 -z-10"></div>

    {/* 🌟 Glass Card Container */}
    <Card className="bg-white/15 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-3xl w-full border border-amber-400/30 text-center">
      <h1 className="text-4xl font-bold mb-4 text-accent">AI Exercise Form Tips</h1>
      <p className="text-gray-200 mb-8 text-sm">
        Ask <span className="text-accent font-semibold">FitCoachAI</span> for safe and effective tips related to your exercise form, posture, and performance.
      </p>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Enter exercise name (e.g., squat)"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <textarea
          placeholder="Ask a question about this exercise..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      </div>

      <Button
        onClick={handleAsk}
        disabled={loading}
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]"
      >
        {loading ? "Generating..." : "Ask AI"}
      </Button>

      {/* Suggested Questions */}
      <div className="mt-10 text-left">
        <h3 className="text-lg font-semibold mb-3 text-accent">
          Recommended Questions:
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {exampleQuestions.map((q, i) => (
            <li
              key={i}
              className="cursor-pointer bg-white/10 hover:bg-amber-500/30 transition-all rounded-lg px-3 py-2 text-sm text-gray-200 hover:text-white"
              onClick={() => setQuestion(q)}
            >
              {q}
            </li>
          ))}
        </ul>
      </div>

      {/* AI Answer */}
      {answer && (
        <div className="mt-10 bg-white/90 text-gray-900 p-6 rounded-2xl shadow-md text-left border-l-4 border-amber-400">
          <h3 className="font-bold text-lg mb-2 text-accent">AI Response:</h3>
          <p className="whitespace-pre-line leading-relaxed">{answer}</p>
        </div>
      )}
    </Card>
  </div>
);
}