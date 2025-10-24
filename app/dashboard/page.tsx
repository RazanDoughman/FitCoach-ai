"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) {
      router.push("/login"); // not logged in → redirect
      return;
    }
    setUserName(user.name?.split(" ")[0] || "Athlete");
  }, [router]);


  const cards = [
    {
      title: "Today's Workout",
      desc: "View your next session and start training",
      icon: "bi-lightning",
      color: "border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
      link: "workouts/active-workout",
      button: "Start Workout",
    },
    {
      title: "Upcoming Workouts",
      desc: "See what’s coming next on your schedule",
      icon: "bi-calendar-event",
      color: "border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]",
      link: "workouts/calendar",
      button: "Open Calendar",
    },
  ];


  const quickActions = [
    
    { name: "AI Builder", href: "workouts/ai-builder" },
    { name: "Exercises", href: "/exercises" },
    { name: "Nutrition", href: "/nutrition" },
  ];

  return (
    <main
      className="min-h-screen relative text-white flex flex-col items-center px-6 py-20 font-sans"
      style={{
        backgroundImage: "url('/background3.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-6xl"
      >
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-blue-400">{userName}</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Here’s your fitness summary and quick tools
          </p>
        </div>

        {/* Top Grid — Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-[#141414]/90 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 transform hover:scale-[1.03] border border-[#696464]/30"
              style={{
                "--glow-color":
                  card.title === "Today's Workout"
                    ? "rgba(59,130,246,0.4)" // blue
                    : "rgba(74,222,128,0.4)", // green
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-3 mb-4">
                <i className={`bi ${card.icon} text-3xl text-blue-400`} />
                <h2 className="text-xl font-semibold">{card.title}</h2>
              </div>
              <p className="text-gray-400 mb-6 text-sm">{card.desc}</p>

              <Link
                href={card.link}
                className="inline-block bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-semibold transition text-sm"
              >
                {card.button}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom — Centered Quick Actions */}
        <div className="mt-12 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#141414]/90 rounded-2xl p-8 backdrop-blur-md border border-[#696464]/30 w-full md:w-2/3 text-center transition-all duration-300 transform hover:scale-[1.03]"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <i className="bi bi-arrow-down-circle text-3xl text-blue-400 transition-transform duration-200 "></i>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>


            <p className="text-gray-400 mb-6 text-sm">
              Access your favorite tools instantly
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="bg-blue-500 hover:bg-blue-600 transition px-10 py-3 rounded-lg font-medium text-sm min-w-[130px] text-center"
                >
                  {action.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
