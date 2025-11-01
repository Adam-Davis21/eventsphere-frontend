import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A wrapper component that checks for a JWT in localStorage.
 * If the token exists, it renders the child components (e.g., the Dashboard).
 * If the token is missing, it redirects the user to the /login page.
 */
const ProtectedRoute = ({ children }) => {
  
  // 1. Check browser's storage for the token
  const token = localStorage.getItem('token');

  // 2. If the token is missing, redirect to login
  if (!token) {
    // Navigate is a React Router component that forces navigation
    return <Navigate to="/login" replace />;
  }

  // 3. If the token is present, render the protected page content
  return children;
};

export default ProtectedRoute;