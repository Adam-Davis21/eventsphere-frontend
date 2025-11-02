import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <Link
      to={`/event/${event.id}`} // ✅ match your App.js route: "event/:eventId"
      className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {event.title?.trim() || "Untitled Event"}
      </h2>

      <p className="text-gray-600 mb-1">
        📍 {event.location?.trim() || "No location specified"}
      </p>

      <p className="text-gray-500 mb-1">
        🗓{" "}
        {event.dateTime
          ? new Date(event.dateTime).toLocaleString()
          : "No date set"}
      </p>

      <p className="text-gray-500">
        {event.description
          ? event.description.length > 60
            ? `${event.description.slice(0, 60)}...`
            : event.description
          : "No description provided"}
      </p>
    </Link>
  );
};

export default EventCard;
