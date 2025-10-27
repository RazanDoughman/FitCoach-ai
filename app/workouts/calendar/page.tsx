"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import type { EventClickArg } from "@fullcalendar/core";
import { useRouter } from "next/navigation";

interface WorkoutTemplate {
  id: number;
  name: string;
}
interface CalendarEvent { 
  id: string;
  title: string;
  start: string;
  color: string;
  note?: string;
}

export default function WorkoutCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [status, setStatus] = useState("completed");
  const [note, setNote] = useState("");

  const router = useRouter();
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) {
        router.push("/login"); // redirect if not logged in
        return;
      }
    }, [router]);

  async function fetchData() {
    const e = await fetch("/api/workouts/schedule").then((r) => r.json());
    const t = await fetch("/api/workouts/templates").then((r) => r.json());
    setEvents(e);
    setTemplates(t);
  }

  function getColor(status: string) {
  if (status === "completed") return "#10B981"; // green
  if (status === "failed") return "#EF4444"; // red
  if (status === "skipped") return "#FACC15"; // yellow
  return "#3B82F6"; // default blue
}

  useEffect(() => {
    fetchData();
  }, []);

  async function addWorkout() {
    if (!selectedDate || !selectedWorkout) return alert("Select a workout first");
    await fetch("/api/workouts/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workoutId: selectedWorkout, date: selectedDate }),
    });
    setSelectedDate(null);
    setSelectedWorkout(null);
    fetchData();
  }

  async function deleteWorkout(id: string) {
    await fetch(`/api/workouts/schedule/${id}`, { method: "DELETE" });
    fetchData();
  }

  function handleEventClick(info: EventClickArg) {
  const clicked = events.find(e => e.id === info.event.id);
  if (clicked) {
    setEditEvent(clicked);
    setStatus(
      clicked.color === "#10B981"
        ? "completed"
        : clicked.color === "#EF4444"
        ? "failed"
        : "upcoming"
    );
    setNote(clicked.note || "");
  }
}

async function saveWorkoutStatus() {
  if (!editEvent) return;

  await fetch(`/api/workouts/schedule/${editEvent.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, note }),
  });

  setEvents((prev) =>
    prev.map((ev) =>
      ev.id === editEvent.id ? { ...ev, color: getColor(status) } : ev
    )
  );
  
  setEditEvent(null); // Close modal
  fetchData(); // Refresh updated events
}

  return (
  <main
    className="min-h-screen relative text-white flex flex-col items-center px-6 py-20 font-sans"
  >
    {/* Background section */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "url('/background3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center w-full">
      {/* ---------- Page Header ---------- */}
      <div className="text-center mb-8 mt-6 bg-black/40 backdrop-blur-md p-4 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-primary">Workout Calendar</h1>
        <p className="text-gray-200 mt-2 text-sm sm:text-base">
          Plan, track, and reflect on your weekly workouts.
        </p>
      </div>
      <div className="text-center mb-8 mt-6 bg-black/40 backdrop-blur-md p-4 rounded-xl shadow-md">
        <p className="text-center text-lg text-secondary mb-8">
        Select any date on the calendar, then choose a workout from the bar below 
      </p>
      <p  className="text-center text-lg text-accent mb-8">
        Note that:  You can only update the status after this workout date
      </p>
      </div>

      {/* ---------- Top Selection Bar ---------- */}
      {selectedDate && (
        <div className="w-full max-w-4xl bg-black/80 backdrop-blur-md p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center mb-6 shadow-lg border border-gray-700">
          <div className="text-sm text-gray-300 mb-2 sm:mb-0">
            <span className="text-secondary">Selected date:</span>{" "}
            <span className="text-primary font-semibold">{selectedDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="bg-gray-900 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:border-primary"
              value={selectedWorkout ?? ""}
              onChange={(e) => setSelectedWorkout(Number(e.target.value))}
            >
              <option value="">Select Workout</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <Button onClick={addWorkout}>Add</Button>
            <Button
              variant="secondary"
              className="ml-2"
              onClick={() => setSelectedDate(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ---------- Calendar ---------- */}
      <div className="w-full max-w-5xl bg-white text-black rounded-2xl shadow-2xl p-4 mb-10">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          events={events}
          height="75vh"
          eventTextColor="white"
          dateClick={(info) => setSelectedDate(info.dateStr)}
          eventClick={handleEventClick}

        />
      </div>

      {/* ---------- Workout History ---------- */}
      <div className="w-full max-w-4xl bg-black/70 rounded-xl p-6 text-gray-200 shadow-md">
        <h2 className="text-xl font-semibold text-primary mb-4">Workout History</h2>
        {events.filter(e => new Date(e.start) < new Date()).length === 0 ? (
          <p className="text-gray-400">No past workouts yet.</p>
        ) : (
          <ul className="space-y-2">
            {events
              .filter(e => new Date(e.start) < new Date())
              .map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700"
                  onClick={() => setEditEvent(e)} 
                >
                  <span className="font-medium">{e.title}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(e.start).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      e.color === "#10B981"
                        ? "text-green-400"
                        : e.color === "#EF4444"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {e.color === "#10B981"
                      ? "Completed"
                      : e.color === "#EF4444"
                      ? "Failed"
                      : "Skipped"}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>

    {/* ---------- Edit Modal ---------- */}
    {editEvent && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
        <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-lg">
          <h2 className="text-lg font-bold text-primary mb-3">Workout Details</h2>

          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-black">Workout: </span>
              {editEvent.title}
            </p>

            <p>
              <span className="font-semibold text-black">Date: </span>
              {new Date(editEvent.start).toLocaleDateString()}
            </p>

            {/* ✅ Status Dropdown */}
            <div>
              <label className="block font-semibold text-black mb-1">Status:</label>
              <select
                className="border p-2 w-full rounded-lg text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="skipped">Skipped</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>


            <div>
              <label className="block font-semibold text-black mb-1">Notes:</label>
              <textarea
                className="border p-2 w-full rounded-lg text-sm"
                rows={3}
                placeholder="Write your reflection on this workout..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-5">
            {/* Left side: Delete button */}
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (confirm("Are you sure you want to delete this workout?")) {
                  deleteWorkout(editEvent.id);
                  setEditEvent(null);
                }
              }}
            >
              Delete
            </Button>

            {/* Right side: Close and Save */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setEditEvent(null)}>
                Close
              </Button>
              <Button onClick={saveWorkoutStatus}>Save Changes</Button>
            </div>
          </div>


        </div>
      </div>
    )}
  </main>
);
}