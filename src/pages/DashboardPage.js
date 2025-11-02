import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import CreateEventModal from "../components/CreateEventModal";

// 🔧 Set up axios globally (optional but recommended)
axios.defaults.baseURL = "http://localhost:8080/api";
axios.defaults.withCredentials = true; // Allow cookies/auth if needed

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("/events"); // 👈 Uses baseURL
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again.");
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Events</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Create Event
        </button>
      </div>

      {/* Status messages */}
      {loading && <p className="text-gray-600">Loading events...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Events Grid */}
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

      {/* Create Event Modal */}
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
