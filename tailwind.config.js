/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#3B82F6",   // Blue
        secondary: "#10B981", // Green
        accent: "#F59E0B",    // Amber
      },
    },
  },
  plugins: [],
};
