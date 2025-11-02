import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // Import the auth service

/**
 * This component provides a structure for all protected pages.
 * It now includes a header with a working Logout button.
 */
const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout(); // Clears the token from localStorage
    navigate('/login'); // Redirects the user to the login page
  };

  return (
    <div>
      <header className="bg-teal-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold">EventSphere</h2>
          <button 
            onClick={handleLogout}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {/* Outlet renders the current child route (Dashboard or EventDetails) */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;