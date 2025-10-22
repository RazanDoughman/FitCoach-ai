export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <section className="max-w-3xl">
        <h1 className="text-5xl font-bold mb-6">FitCoach AI</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your personal AI-powered fitness companion. Track, train, and transform.
        </p>
        <a
          href="/register/"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Get Started
        </a>
      </section>
    </main>
  );
}
