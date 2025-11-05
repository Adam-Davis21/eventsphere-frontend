import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import eventService from "../services/eventService"; // ✅ USE SHARED SERVICE

function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({ name: "", email: "" });
  const [newTask, setNewTask] = useState("");
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const fetchEvent = async () => {
    try {
      const data = await eventService.getEventById(eventId);
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event:", err);
      toast.error("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleAddGuest = async () => {
    if (!newGuest.name.trim() || !newGuest.email.trim()) {
      return toast.error("Enter name and email.");
    }

    try {
      setIsAddingGuest(true);
      await eventService.addGuest(eventId, newGuest);
      toast.success("Guest added 🎉");
      setNewGuest({ name: "", email: "" });
      fetchEvent();
    } catch {
      toast.error("Could not add guest.");
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return toast.error("Enter a task name.");

    try {
      setIsAddingTask(true);
      await eventService.addTask(eventId, { title: newTask });
      toast.success("Task added ✔️");
      setNewTask("");
      fetchEvent();
    } catch {
      toast.error("Could not add task.");
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    await eventService.updateTaskStatus(eventId, taskId, !completed);
    fetchEvent();
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await eventService.deleteTask(eventId, taskId);
    fetchEvent();
  };

  const handleUpdateRSVP = async (guestId, rsvp) => {
    await eventService.updateGuestRsvp(eventId, guestId, rsvp);
    fetchEvent();
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm("Delete this guest?")) return;
    await eventService.deleteGuest(eventId, guestId);
    fetchEvent();
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Delete this event?")) return;
    await eventService.deleteEvent(eventId);
    toast.success("Event deleted.");
    navigate("/");
  };

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;
  if (!event) return <p className="p-6 text-red-600">Event not found.</p>;

  const sortedGuests = [...(event.guests || [])].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate("/")} className="bg-gray-700 text-white px-4 py-2 rounded">
          ← Back
        </button>
        <button onClick={handleDeleteEvent} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete Event
        </button>
      </div>

      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{event.description || "No description"}</p>
      <p className="text-gray-500">📍 {event.location}</p>
      <p className="text-gray-500">
        🗓 {event.dateTime ? new Date(event.dateTime).toLocaleString() : "No date set"}
      </p>

      {/* Guests */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Guests</h2>
        <ul className="space-y-2">
          {sortedGuests.map((g) => (
            <li key={g.id} className="flex justify-between bg-gray-100 p-2 rounded">
              <span>{g.name} ({g.email}) — {g.rsvp}</span>
              <div className="space-x-2">
                <button onClick={() => handleUpdateRSVP(g.id, "Accepted")}>Accept</button>
                <button onClick={() => handleUpdateRSVP(g.id, "Declined")}>Decline</button>
                <button onClick={() => handleDeleteGuest(g.id)}>🗑</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 mt-3">
          <input className="border px-3 py-2 rounded" placeholder="Name"
            value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} />
          <input className="border px-3 py-2 rounded" placeholder="Email"
            value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} />
          <button onClick={handleAddGuest} disabled={isAddingGuest}
            className="bg-blue-600 text-white px-4 py-2 rounded">
            {isAddingGuest ? "Adding..." : "Add Guest"}
          </button>
        </div>
      </section>

      {/* Tasks */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Tasks</h2>
        <ul className="space-y-2">
          {event.tasks?.map((t) => (
            <li key={t.id} className="flex justify-between bg-gray-100 p-2 rounded">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={t.completed} onChange={() => handleToggleTask(t.id, t.completed)} />
                <span className={t.completed ? "line-through" : ""}>{t.title}</span>
              </div>
              <button onClick={() => handleDeleteTask(t.id)}>🗑</button>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 mt-3">
          <input className="border px-3 py-2 rounded" placeholder="Task name"
            value={newTask} onChange={(e) => setNewTask(e.target.value)} />
          <button onClick={handleAddTask} disabled={isAddingTask}
            className="bg-green-600 text-white px-4 py-2 rounded">
            {isAddingTask ? "Adding..." : "Add Task"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default EventDetailsPage;
