export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center py-8 border-t border-gray-800">
      <p className="text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-primary font-semibold">FitCoach AI</span>. All rights reserved.
      </p>
    </footer>
  );
}
