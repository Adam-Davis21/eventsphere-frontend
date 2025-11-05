import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';

// ✅ NEW
import RsvpPage from './pages/RsvpPage';

function App() {
  return (
    <Router>
      {/* ✅ Global Toast Notification System */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e1e1e',
            color: '#fff',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '0.95rem',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#1e1e1e',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#1e1e1e',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Public RSVP Page (No Login Required) */}
        <Route path="/rsvp" element={<RsvpPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="event/:eventId" element={<EventDetailsPage />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-10 text-2xl font-semibold">404 Not Found</h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
