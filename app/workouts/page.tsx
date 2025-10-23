"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function WorkoutsPage() {
  const cards = [
    {
      title: "AI Workout Builder",
      desc: "Generate custom workouts using AI",
      icon: "bi-cpu",
      color: "border-amber-400 hover:bg-amber-50",
      link: "/workouts/ai-builder",
    },
    {
      title: "My Workouts",
      desc: "View and manage your saved templates",
      icon: "bi-collection",
      color: "border-blue-500 hover:bg-blue-50",
      link: "/workouts/my-workouts",
    },
    {
      title: "Calendar View",
      desc: "Plan and track your weekly schedule",
      icon: "bi-calendar-week",
      color: "border-green-500 hover:bg-green-50",
      link: "/workouts/calendar",
    },
    {
      title: "Active Workout",
      desc: "Track your session live with set logging",
      icon: "bi-stopwatch",
      color: "border-purple-500 hover:bg-purple-50",
      link: "/workouts/active-workout",
    },
  ];

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🖼️ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{
          backgroundImage: "url('/background4.jpg')",
        }}
      ></div>

      {/* 🌑 Dim Overlay (above background, behind cards) */}
      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      {/* 💡 Main Content */}
      <div className="relative max-w-6xl mx-auto mt-10 sm:mt-16 text-center z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Workouts
          </h1>
          <p className="text-gray-300 text-sm">
            Build, plan, and track your fitness journey all in one place.
          </p>
        </div>

        {/* 🧱 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.link}>
                <Card
                  className={`border-2 ${card.color} rounded-2xl p-6 text-center cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-md transition-all duration-200`}
                >
                  <i
                    className={`${card.icon} text-5xl mb-4 text-gray-700 transition-none`}
                  ></i>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{card.desc}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
