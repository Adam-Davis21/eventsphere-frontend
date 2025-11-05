import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import CreateEventModal from "../components/CreateEventModal";
import eventService from "../services/eventService"; // ✅ use token-aware service

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await eventService.getEvents(); // ✅ Protected request
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreated = async () => {
    setShowModal(false);
    await fetchEvents();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Events</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Create Event
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading events...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No events yet. Click “Create Event” to get started.
            </p>
          )}
        </div>
      )}

      {showModal && (
        <CreateEventModal
          onClose={() => setShowModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  );
};

export default DashboardPage;
