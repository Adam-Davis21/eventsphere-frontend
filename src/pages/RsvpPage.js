//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false, // ✅ Public RSVP access (no login needed)
});

function RsvpPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const guestId = searchParams.get("guestId");

  const [event, setEvent] = useState(null);
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ Fetch event
        const eventRes = await api.get(`/events/${eventId}`);
        setEvent(eventRes.data);

        // ✅ Fetch guest directly (instead of list)
        const guestRes = await api.get(`/events/${eventId}/guests/${guestId}`);
        setGuest(guestRes.data);

      } catch (err) {
        toast.error("Invalid RSVP link.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId && guestId) load();
    else setLoading(false);
  }, [eventId, guestId]);

  const handleRSVP = async (status) => {
    try {
      await api.put(`/events/${eventId}/guests/${guestId}`, { rsvp: status });
      toast.success(`RSVP recorded: ${status}`);
      setGuest({ ...guest, rsvp: status });
    } catch (err) {
      toast.error("Failed to update RSVP.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading RSVP...</p>;

  if (!guest || !event)
    return <p className="text-center mt-10 text-red-600">RSVP link invalid or expired.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center border border-gray-200">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">You're invited to:</h1>
        <p className="text-xl font-bold text-indigo-600 mb-4">{event.title}</p>

        <p className="text-gray-600">
          📅 {event.dateTime ? new Date(event.dateTime).toLocaleString() : "TBA"}
        </p>
        <p className="text-gray-600 mb-6">📍 {event.location || "Location TBA"}</p>

        <hr className="my-5" />

        <h2 className="text-lg font-semibold mb-2">Hi {guest.name}!</h2>
        <p className="text-gray-600 mb-6">Can you attend this event?</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleRSVP("Accepted")}
            className="px-5 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition"
          >
            Accept
          </button>
          <button
            onClick={() => handleRSVP("Declined")}
            className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
          >
            Decline
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Current response:{" "}
          <span
            className={`font-semibold ${
              guest.rsvp === "Accepted"
                ? "text-green-600"
                : guest.rsvp === "Declined"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {guest.rsvp}
          </span>
        </p>
      </div>
    </div>
  );
}

export default RsvpPage;