"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ------------------ Type Definitions ------------------ */
interface WorkoutSchedule {
  id: number;
  userId: number;
  date: string;
  status: "completed" | "skipped" | "upcoming";
}

interface WeeklyStats {
  weekLabel: string;
  completed: number;
  skipped: number;
}

interface SummaryStats {
  total: number;
  completed: number;
  skipped: number;
  upcoming: number;
  completionRate: number;
}

/* ------------------ Component ------------------ */
export default function WorkoutStatsPage() {
  const [data, setData] = useState<WorkoutSchedule[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<SummaryStats>({
    total: 0,
    completed: 0,
    skipped: 0,
    upcoming: 0,
    completionRate: 0,
  });

  /* ------------------ Fetch Data ------------------ */
  useEffect(() => {
    const fetchSchedules = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("WorkoutSchedule")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Error fetching schedules:", error.message);
        setLoading(false);
        return;
      }

      setData((data as WorkoutSchedule[]) || []);
      setLoading(false);
    };

    fetchSchedules();
  }, []);

  /* ------------------ Compute Stats ------------------ */
  useEffect(() => {
    if (data.length === 0) return;

    const total = data.length;
    const completed = data.filter((s) => s.status === "completed").length;
    const skipped = data.filter((s) => s.status === "skipped").length;
    const upcoming = data.filter((s) => s.status === "upcoming").length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    setStats({ total, completed, skipped, upcoming, completionRate });

    // 🗓️ Group by actual weekly ranges (no duplicates even if month changes)
    const weeklyMap: Record<string, WeeklyStats> = {};

    data.forEach((s) => {
      const date = new Date(s.date);

      // Get start of the week (Sunday) and end (Saturday)
      const dayOfWeek = date.getDay(); // 0–6
      const start = new Date(date);
      start.setDate(date.getDate() - dayOfWeek);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      // Format labels cleanly, showing both month parts if needed
      const startLabel = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endLabel = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Get week number of year (for uniqueness)
      const weekNumber = Math.ceil(
        ((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
          86400000 +
          new Date(date.getFullYear(), 0, 1).getDay() +
          1) /
          7
      );

      const label = `${startLabel} - ${endLabel} (Week ${weekNumber})`;

      if (!weeklyMap[label])
        weeklyMap[label] = { weekLabel: label, completed: 0, skipped: 0 };

      if (s.status === "completed") weeklyMap[label].completed++;
      if (s.status === "skipped") weeklyMap[label].skipped++;
    });

    // Sort chronologically
    const sortedWeeks = Object.values(weeklyMap).sort((a, b) => {
      const dateA = new Date(a.weekLabel.split(" - ")[0]);
      const dateB = new Date(b.weekLabel.split(" - ")[0]);
      return dateA.getTime() - dateB.getTime();
    });

    // Show the last 4 weeks
    setWeeklyData(sortedWeeks.slice(-4));
  }, [data]);

  /* ------------------ Loading State ------------------ */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading workout stats...
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <motion.div
      className="relative min-h-screen px-6 py-24 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🖼 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/background4.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/70 -z-10" />

      {/* ✨ Main Content */}
      <div className="relative max-w-6xl mx-auto text-center text-white z-10">
        <h1 className="text-4xl font-bold mb-2">Workout Stats</h1>
        <p className="text-gray-300 text-sm mb-12">
          Track your performance, consistency, and progress trends.
        </p>

        {/* 🧱 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-12">
          {[
            {
              title: "Total",
              value: stats.total,
              color: "border-[#3B82F6] text-primary",
              colorCode: "#3B82F6",
              icon: "bi-bar-chart-line",
            },
            {
              title: "Completed",
              value: stats.completed,
              color: "border-[#10B981] text-secondary",
              colorCode: "#10B981",
              icon: "bi-check2-circle",
            },
            {
              title: "Skipped",
              value: stats.skipped,
              color: "border-[#F59E0B] text-accent",
              colorCode: "#F59E0B",
              icon: "bi-x-circle",
            },
            {
              title: "Upcoming",
              value: stats.upcoming,
              color: "border-[#3B82F6] text-primary",
              colorCode: "#3B82F6",
              icon: "bi-clock",
            },
            {
              title: "Completion",
              value: `${stats.completionRate}%`,
              color: "border-[#10B981] text-secondary",
              colorCode: "#10B981",
              icon: "bi-bullseye",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`p-5 bg-white/95 backdrop-blur-md border-2 ${card.color} text-gray-900 hover:scale-105 transition-all duration-300`}
              >
                <i
                  className={`${card.icon} text-3xl mb-2`}
                  style={{ color: card.colorCode }}
                />
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className="text-2xl font-bold">{card.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 📈 Chart */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border-2 border-[#3B82F6] shadow-md text-gray-900">
          <h2 className="text-xl font-semibold mb-4">Weekly Workout Activity</h2>
          {weeklyData.length === 0 ? (
            <p className="text-gray-500">No workout data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
              data={weeklyData}
              barCategoryGap="10%" 
              barGap={2}      
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekLabel" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="skipped" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 🧠 AI Insights */}
        <div className="mt-12 bg-[#F59E0B]/15 text-white-900 p-6 rounded-2xl shadow-lg border-2 border-[#F59E0B]">
          <h3 className="text-xl font-bold mb-2 text-[#F59E0B]">
            AI Coach Insights
          </h3>
          <p className="text-lg">
            “You’ve completed {stats.completionRate}% of your scheduled workouts.
            Keep the momentum going — consistency builds results!”
          </p>
        </div>
      </div>
    </motion.div>
  );
}
