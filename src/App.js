import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './styles/App.css';

/**
 * Main App Component
 * Root component that renders the expense tracker application.
 * Displays navigation bar and dashboard summary cards.
 */
function App() {
  return (
    <div className="App">
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;
