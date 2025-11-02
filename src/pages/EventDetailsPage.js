import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({ name: "", email: "" });
  const [newTask, setNewTask] = useState("");

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event:", err);
      alert("Failed to load event details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  // ✅ Add Guest
  const handleAddGuest = async () => {
    if (!newGuest.name.trim() || !newGuest.email.trim()) {
      alert("Please enter both name and email.");
      return;
    }
    try {
      await api.post(`/events/${eventId}/guests`, newGuest);
      setNewGuest({ name: "", email: "" });
      fetchEvent();
    } catch (err) {
      console.error("Error adding guest:", err);
      alert("Failed to add guest.");
    }
  };

  // ✅ Add Task
  const handleAddTask = async () => {
    if (!newTask.trim()) {
      alert("Please enter a task name.");
      return;
    }
    try {
      await api.post(`/events/${eventId}/tasks`, { title: newTask });
      setNewTask("");
      fetchEvent();
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  // ✅ Toggle Task Completion
  const handleToggleTask = async (taskId, completed) => {
    try {
      await api.put(`/events/${eventId}/tasks/${taskId}`, { completed: !completed });
      fetchEvent();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task.");
    }
  };

  // ✅ Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/events/${eventId}/tasks/${taskId}`);
      fetchEvent();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  // ✅ Update Guest RSVP
  const handleUpdateRSVP = async (guestId, newStatus) => {
    try {
      await api.put(`/events/${eventId}/guests/${guestId}`, { rsvp: newStatus });
      fetchEvent();
    } catch (err) {
      console.error("Error updating RSVP:", err);
      alert("Failed to update RSVP.");
    }
  };

  // ✅ Delete Guest
  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm("Delete this guest?")) return;
    try {
      await api.delete(`/events/${eventId}/guests/${guestId}`);
      fetchEvent();
    } catch (err) {
      console.error("Error deleting guest:", err);
      alert("Failed to delete guest.");
    }
  };

  // ✅ Delete Event
  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${eventId}`);
      alert("Event deleted successfully.");
      navigate("/"); // go back to dashboard
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };

  if (loading) return <h2 className="p-6">Loading...</h2>;
  if (!event) return <h2 className="p-6 text-red-600">Event not found.</h2>;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <button
            onClick={handleDeleteEvent}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🗑 Delete Event
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">{event.description || "No description"}</p>
        <p className="text-gray-500">📍 {event.location || "No location specified"}</p>
        <p className="text-gray-500">
          🗓 {event.dateTime ? new Date(event.dateTime).toLocaleString() : "No date set"}
        </p>
      </div>

      {/* Guests Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Guests</h2>
        <ul className="space-y-2 mb-4">
          {event.guests?.length > 0 ? (
            event.guests.map((g) => (
              <li key={g.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div>
                  <span className="font-medium">{g.name}</span>{" "}
                  <span className="text-gray-500">({g.email})</span>{" "}
                  <span
                    className={`ml-2 text-sm px-2 py-1 rounded ${
                      g.rsvp === "Accepted"
                        ? "bg-green-200 text-green-800"
                        : g.rsvp === "Declined"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {g.rsvp}
                  </span>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => handleUpdateRSVP(g.id, "Accepted")}
                    className="text-green-600 hover:underline"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateRSVP(g.id, "Declined")}
                    className="text-red-600 hover:underline"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleDeleteGuest(g.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No guests yet.</li>
          )}
        </ul>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            placeholder="Guest Name"
            className="border px-3 py-2 rounded w-48"
          />
          <input
            type="email"
            value={newGuest.email}
            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
            placeholder="Guest Email"
            className="border px-3 py-2 rounded w-60"
          />
          <button
            onClick={handleAddGuest}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Guest
          </button>
        </div>
      </section>

      {/* Tasks Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Tasks</h2>
        <ul className="space-y-2 mb-4">
          {event.tasks?.length > 0 ? (
            event.tasks.map((t) => (
              <li key={t.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => handleToggleTask(t.id, t.completed)}
                    className="cursor-pointer"
                  />
                  <span className={t.completed ? "line-through text-gray-500" : ""}>
                    {t.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(t.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  🗑
                </button>
              </li>
            ))
          ) : (
            <li>No tasks yet.</li>
          )}
        </ul>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task name"
            className="border px-3 py-2 rounded w-64"
          />
          <button
            onClick={handleAddTask}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Task
          </button>
        </div>
      </section>
    </div>
  );
}

export default EventDetailsPage;
