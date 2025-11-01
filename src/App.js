import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the layout wrapper (you'll create this later)
import Layout from './components/Layout'; 

// Import the pages (to be created by the team)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventDetailsPage from './pages/EventDetailsPage';

// Import your custom ProtectedRoute component (next step)
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No login required) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Nested Protected Routes (Login required) */}
        {/* All routes inside this require the ProtectedRoute check */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
          {/* Dashboard is the default homepage after login */}
          <Route index element={<DashboardPage />} /> 

          {/* Dynamic route for specific event details */}
          <Route path="event/:eventId" element={<EventDetailsPage />} />
          
        </Route>

        {/* Catch-all route for 404 (optional but good practice) */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;