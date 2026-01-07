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

  // Check localStorage for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('corticoExpenseUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle login - save user to state and localStorage
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('corticoExpenseUser', JSON.stringify(userData));
  };

  // Handle logout - clear user from state and localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('corticoExpenseUser');
  };

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
      {isEmployee ? <EmployeeDashboard /> : <EmployerDashboard />}
    </div>
  );
}

export default App;
