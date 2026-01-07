import React, { useState } from 'react';
import { API_URL } from '../../config';
import './Login.css';

/**
 * Login Component
 * 
 * Split-screen design with video background on left and login form on right.
 * Features:
 * - Video background with overlay for branding
 * - Clean, modern login form
 * - Password visibility toggle
 * - Remember me checkbox
 * - Responsive design for mobile
 */
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user data
      localStorage.setItem('corticoExpenseToken', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Video Background with Branding */}
      <div className="login-hero">
        <video 
          className="login-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        <div className="login-hero-overlay"></div>
        
        <div className="login-hero-content">
          {/* Logo */}
          <div className="login-brand">
            <div className="login-logo">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                <rect x="16" y="13" width="3" height="2" rx="0.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="login-brand-name">CorticoExpense</span>
          </div>

          {/* Hero Text */}
          <div className="login-hero-text">
            <h1>Smart Expense<br/>Management Platform</h1>
            <p>
              Streamline your expense tracking with our comprehensive solution. 
              Manage budgets, track spending, and gain insights all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="login-stats">
            <div className="login-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Expenses Tracked</span>
            </div>
            <div className="login-stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Accuracy Rate</span>
            </div>
            <div className="login-stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Access</span>
            </div>
          </div>

          {/* Footer */}
          <div className="login-hero-footer">
            © 2025 CorticoExpense. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="login-form-container">
          {/* Welcome Header */}
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
