import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * This component provides a structure for all protected pages.
 * It ensures the dashboard and event details pages share the same header/footer.
 */
const Layout = () => {
  return (
    <div>
      {/* TODO: The navigation bar component will go here later.
        For now, just a placeholder.
      */}
      <header className="bg-teal-700 text-white p-4">
        <h2>EventSphere App Header</h2>
      </header>
      
      <main className="container mx-auto p-4">
        {/* Outlet renders the current child route (Dashboard or EventDetails) */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;