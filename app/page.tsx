"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white font-sans">
      {/* ---------- HERO SECTION ---------- */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-32 px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
             Train Smarter With <br />
            <span className="text-primary">FitCoach AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl mx-auto text-gray-200 text-base sm:text-lg mb-10"
          >
            Your personal AI-powered fitness companion that helps you build
            customized workouts, stay motivated, and track progress seamlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/register"
              className="bg-primary hover:bg-blue-700 transition-all text-lg px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Get Started
            </Link>
            
          </motion.div>
        </div>
      </section>

      {/* ---------- FEATURES SECTION ---------- */}
    <section className="py-24 px-6">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">
        Core Features That Redefine Fitness
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {[
          {
            title: "AI Workout Builder",
            desc: "Generate personalized plans using AI—tailored to your goals, time, and equipment.",
            icon: "bi-robot",
            color: "text-accent",
            shadow: "hover:shadow-[0_0_20px_#f59e0b50]",
          },
          {
            title: "Exercise Library",
            desc: "Explore 1300+ exercises with GIFs and smart filters for every muscle group.",
            icon: "bi-collection-play",
            color: "text-primary",
             shadow: "hover:shadow-[0_0_20px_#3b82f650]",
          },
          {
            title: "Progress Dashboard",
            desc: "Visualize your progress with interactive charts and adaptive AI insights.",
            icon: "bi-graph-up-arrow",
            color: "text-secondary",
             shadow: "hover:shadow-[0_0_20px_#10b98150]",
          },
          {
            title: "Workout Calendar",
            desc: "Plan, track, and stay consistent with your weekly fitness schedule.",
            icon: "bi-calendar-check",
            color: "text-primary",
            shadow: "hover:shadow-[0_0_20px_#3b82f650]",
          },
        ].map((f, i) => (
          <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`group p-8 bg-[#141414] rounded-2xl shadow-lg transition-all duration-300 text-center ${f.shadow}`}
            >
              <i className={`${f.icon} text-6xl mb-12 ${f.color} block mx-auto transition-transform duration-300 group-hover:-translate-y-1`}></i>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
        ))}
      </div>
    </section>


      {/* ---------- AI PREVIEW SECTION ---------- */}
      <section className="py-24 px-6 flex flex-col md:flex-row items-center justify-center gap-16">
        <motion.img
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          src="https://cdn-icons-png.flaticon.com/512/10887/10887582.png"
          alt="AI Coach"
          className="w-60 sm:w-72 md:w-96 rounded-2xl shadow-lg"
        />
        <div className="max-w-md text-center md:text-left">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-4"
          >
            Meet Your <span className="text-accent">AI Fitness Coach</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-300 mb-6"
          >
            FitCoach AI adapts to your progress, offering real-time feedback,
            motivational insights, and smarter training adjustments.
          </motion.p>
          <Link
            href="/ai-builder"
            className="bg-accent hover:bg-amber-600 text-black px-6 py-3 rounded-lg transition-all font-semibold"
          >
            Try the AI Builder
          </Link>
        </div>
      </section>

      {/* ---------- CTA FOOTER ---------- */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-36 px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/background2.jpg')" }}
      >
        {/* dark overlay (same dimness as hero) */}
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 max-w-2xl">
          <h4 className="text-3xl font-bold mb-6 leading-tight">
            Ready to Transform Your <br />
            <span className="text-primary">Fitness Journey?</span>
          </h4>

          <Link
            href="/register"
            className="inline-block bg-secondary hover:bg-emerald-600 px-10 py-3 rounded-full font-semibold text-lg transition-all shadow-lg"
          >
            Join Now
          </Link>
        </div>
      </section>
    </main>
  );
}
