import React, { useState } from 'react';
import eventService from '../services/eventService';

// This component takes two "props" (inputs) from DashboardPage:
// 1. onClose: A function to call to close the modal
// 2. onEventCreated: A function to call to refresh the dashboard's event list
const CreateEventModal = ({ onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [error, setError] = useState('');

  // Local state for date and time inputs
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !time) {
      setError('Please select both a date and a time.');
      return;
    }

    // ✅ Ensure full ISO format (adds seconds) for Java's LocalDateTime
    const combinedDateTime = `${date}T${time}:00`;

    // ✅ Backend expects "dateTime", not "eventDate"
    const eventData = {
      ...formData,
      dateTime: combinedDateTime
    };

    try {
      await eventService.createEvent(eventData);
      onEventCreated(); // Refresh dashboard
      onClose(); // Close modal
    } catch (err) {
      setError(err.message || 'Failed to create event.');
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Create a New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">
                Event Date
              </label>
              <input
                type="date"
                id="date"
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-slate-600 mb-1">
                Event Time
              </label>
              <input
                type="time"
                id="time"
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-slate-600 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="3"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-600 font-medium py-2 px-4 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
