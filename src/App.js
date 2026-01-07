import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { EmployerDashboard, EmployeeDashboard } from './components/Dashboard';
import { API_URL } from './config';
import './styles/App.css';

/**
 * Main App Component
 * 
 * Root component that manages authentication state and routing.
 * 
 * Architecture decisions:
 * - Single Page Application (SPA) - no page reloads for better UX
 * - JWT stored in localStorage for persistent sessions across browser refreshes
 * - Role-based rendering - Employer and Employee see different dashboards
 * - Auth check on mount ensures users stay logged in after page refresh
 */
function App() {
  // User state - null when not logged in, contains user data when authenticated
  const [user, setUser] = useState(null);
  // Loading state prevents flash of login page while checking existing token
  const [loading, setLoading] = useState(true);

  /**
   * Check for existing authentication on app mount
   * This allows users to stay logged in after closing/reopening the browser
   * Token is validated with the server to ensure it hasn't expired
   */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('corticoExpenseToken');
      
      if (token) {
        try {
          // Validate token with server
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token invalid or expired - clear it to force re-login
            localStorage.removeItem('corticoExpenseToken');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('corticoExpenseToken');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Handle successful login - update state with user data
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle logout - clear all auth state
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('corticoExpenseToken');
  };

  // Show loading spinner while checking authentication
  // Prevents flash of login page for already-authenticated users
  if (loading) {
    return (
      <div className="App loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Unauthenticated users see the login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Role-based dashboard rendering
  // Employers see employee management, budget requests, activity log
  // Employees see their wallet, expenses, and can request budget increases
  const isEmployee = user.role === 'Employee';

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      {isEmployee ? <EmployeeDashboard user={user} /> : <EmployerDashboard />}
    </div>
  );
}

export default App;
