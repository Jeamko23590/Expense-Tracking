import React, { useState } from 'react';
import './Login.css';

/**
 * Login Component
 * Displays login form with email/password fields and demo account buttons.
 * Demo accounts allow quick access for testing (Employer and Employee roles).
 */
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Demo account credentials
  const demoAccounts = {
    employer: {
      email: 'employer@company.com',
      role: 'Employer'
    },
    employee: {
      email: 'employee@company.com',
      role: 'Employee'
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Determine role based on email
      const role = email.includes('employer') ? 'Employer' : 'Employee';
      onLogin({ email, role });
    }
  };

  // Fill form with demo account credentials
  const handleDemoClick = (accountType) => {
    const account = demoAccounts[accountType];
    setEmail(account.email);
    setPassword('demo123');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <svg 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="login-wallet-icon"
          >
            <rect x="8" y="6" width="16" height="10" rx="2" fill="white" opacity="0.85"/>
            <rect x="4" y="14" width="32" height="20" rx="3" fill="white"/>
            <rect x="26" y="21" width="6" height="6" rx="1.5" fill="#6366F1"/>
          </svg>
        </div>

        {/* Title */}
        <h1 className="login-title">CorticoExpense</h1>
        <p className="login-subtitle">Your smart expense management companion</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye-off icon (hide)
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  // Eye icon (show)
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Sign In to CorticoExpense
          </button>
        </form>

        {/* Demo Accounts Section */}
        <div className="demo-section">
          <p className="demo-label">
            <span className="demo-icon">○</span>
            Demo Accounts Available
          </p>
          
          <div className="demo-buttons">
            <button 
              type="button"
              className="demo-button"
              onClick={() => handleDemoClick('employer')}
            >
              <svg viewBox="0 0 20 20" fill="none" className="demo-button-icon">
                <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 7L10 11L17 7" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <div className="demo-button-text">
                <span className="demo-role">Employer</span>
                <span className="demo-email">employer@company.com</span>
              </div>
            </button>

            <button 
              type="button"
              className="demo-button"
              onClick={() => handleDemoClick('employee')}
            >
              <svg viewBox="0 0 20 20" fill="none" className="demo-button-icon">
                <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 7L10 11L17 7" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <div className="demo-button-text">
                <span className="demo-role">Employee</span>
                <span className="demo-email">employee@company.com</span>
              </div>
            </button>
          </div>

          <p className="demo-note">Any password works for demo</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
