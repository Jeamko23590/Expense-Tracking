import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { EmployerDashboard, EmployeeDashboard } from './components/Dashboard';
import './styles/App.css';

/**
 * Main App Component
 * Handles authentication state and renders appropriate view.
 * Shows Login page when not authenticated, Dashboard when logged in.
 * Displays different dashboards based on user role (Employer vs Employee).
 */
function App() {
  // User state - null when not logged in
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('corticoExpenseToken');
      
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token invalid, clear it
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

  // Handle login - save user to state
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle logout - clear user from state and localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('corticoExpenseToken');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="App loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Determine which dashboard to show based on user role
  const isEmployee = user.role === 'Employee';

  // Show main app when authenticated
  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      {isEmployee ? <EmployeeDashboard user={user} /> : <EmployerDashboard />}
    </div>
  );
}

export default App;
