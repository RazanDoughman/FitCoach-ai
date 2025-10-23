"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

    const handleAuthChange = () => {
      const u = localStorage.getItem("user");
      setIsLoggedIn(!!u);
    };
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const isLanding = pathname === "/";

  function handleLogout() {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange")); 
    window.location.href = "/";
  }

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-md shadow-md transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary tracking-wide">
          FitCoach<span className="text-accent">AI</span>
        </Link>

        {/* Nav Links */}
          {isLanding ? (
            <div className="hidden sm:flex gap-6 text-sm font-medium"></div>
          ) : (
            <div className="flex items-center gap-6 text-sm font-medium text-white">
              <Link
                href="/dashboard"
                className={`hover:text-green-500 ${
                  pathname === "/dashboard" ? "text-green-500" : "text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/workouts"
                className={`hover:text-green-500 ${
                  pathname.startsWith("/workouts") ? "text-green-500" : "text-white"
                }`}
              >
                Workouts
              </Link>
              <Link
                href="/exercises"
                className={`hover:text-green-500 ${
                  pathname.startsWith("/exercises") ? "text-green-500" : "text-white"
                }`}
              >
                Exercises
              </Link>
              <Link
                href="/progress"
                className={`hover:text-green-500 ${
                  pathname.startsWith("/progress") ? "text-green-500" : "text-white"
                }`}
              >
                Progress
              </Link>

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full font-semibold text-white text-xs transition"
                >
                  Log Out
                </button>
              )}
            </div>
          )}
      </div>
    </motion.nav>
  );
}
