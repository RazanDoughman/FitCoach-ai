"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExercisesPage() {
  
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) {
      router.push("/login"); // redirect if not logged in
      return;
    }
  }, [router]);

  const cards = [
    {
      title: "Exercise Library",
      desc: "Browse 1300+ exercises with filters, search, and GIF demos",
      icon: "bi-collection-play",
      color: "border-blue-500 hover:bg-blue-50",
      link: "/exercises/library",
    },
    {
      title: "Saved Exercises",
      desc: "View and manage your saved favorite exercises",
      icon: "bi-star",
      color: "border-green-500 hover:bg-green-50",
      link: "/exercises/saved",
    },
    {
      title: "Ask AI (Form Tips)",
      desc: "Ask AI for exercise form tips, safety guidance, or technique help",
      icon: "bi-robot",
      color: "border-purple-500 hover:bg-purple-50",
      link: "/exercises/ai",
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

      {/* 🌑 Dim Overlay */}
      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      {/* 💡 Main Content */}
      <div className="relative max-w-6xl mx-auto mt-10 sm:mt-16 text-center z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Exercises
          </h1>
          <p className="text-gray-300 text-sm">
            Explore, save, and improve your workout techniques with AI
            assistance.
          </p>
        </div>

        {/* 🧱 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.link}>
                <Card
                  className={`border-2 ${card.color} rounded-2xl p-6 text-center cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-md transition-all duration-200 h-40 flex flex-col justify-center items-center`}
                >
                  <i
                    className={`${card.icon} text-5xl mb-4 text-gray-700 transition-none`}
                  ></i>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    {card.desc}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
