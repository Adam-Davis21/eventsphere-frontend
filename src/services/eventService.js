import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const API_URL = "http://localhost:8080/api/events";

// ✅ Create a shared axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: Add Authorization header automatically if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Event Service ---
const eventService = {
  getEvents: async () => {
    try {
      const response = await api.get("/events");
      const data = response.data;

      console.log("Fetched events:", data);

      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.events)) return data.events;
      return [];
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      throw error.response?.data || "Could not fetch events.";
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post("/events", eventData);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating event:", error);
      throw error.response?.data || "Could not create event.";
    }
  },

  getEventById: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      const raw = response.data;
      console.log("🔍 Raw event data:", raw);

      if (!raw) return null;
      if (raw.event) return raw.event;
      if (Array.isArray(raw)) return raw[0];
      return raw;
    } catch (error) {
      console.error("❌ Error fetching event:", error);
      throw error.response?.data || "Could not fetch event details.";
    }
  },

  addGuest: async (eventId, guestData) => {
    try {
      const response = await api.post(`/events/${eventId}/guests`, guestData);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding guest:", error);
      throw error.response?.data || "Could not add guest.";
    }
  },

  addTask: async (eventId, taskData) => {
    try {
      const response = await api.post(`/events/${eventId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding task:", error);
      throw error.response?.data || "Could not add task.";
    }
  },

  // --- Task Management ---
updateTaskStatus: async (eventId, taskId, completed) => {
  const response = await axios.put(
    `${API_URL}/${eventId}/tasks/${taskId}`,
    { completed },
    getAuthHeaders()
  );
  return response.data;
},

deleteTask: async (eventId, taskId) => {
  await axios.delete(`${API_URL}/${eventId}/tasks/${taskId}`, getAuthHeaders());
},

// --- Guest Management ---
updateGuestRsvp: async (eventId, guestId, rsvp) => {
  const response = await axios.put(
    `${API_URL}/${eventId}/guests/${guestId}`,
    { rsvp },
    getAuthHeaders()
  );
  return response.data;
},

deleteGuest: async (eventId, guestId) => {
  await axios.delete(`${API_URL}/${eventId}/guests/${guestId}`, getAuthHeaders());
},

};

export default eventService;
