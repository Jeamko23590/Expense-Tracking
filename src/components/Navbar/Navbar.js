import React from 'react';
import './Navbar.css';

/**
 * Navbar Component
 * Displays the app header with logo, title, user email, and sign out button.
 * This is a static navigation bar for the expense tracker application.
 */
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo icon representing a wallet with card */}
        <div className="navbar-logo">
          <svg 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="wallet-icon"
          >
            {/* Card/receipt sticking out from top */}
            <rect x="8" y="6" width="16" height="10" rx="2" fill="white" opacity="0.85"/>
            {/* Main wallet body */}
            <rect x="4" y="14" width="32" height="20" rx="3" fill="white"/>
            {/* Wallet clasp/button */}
            <rect x="26" y="21" width="6" height="6" rx="1.5" fill="#3B82F6"/>
          </svg>
        </div>
        
        {/* App title and user info */}
        <div className="navbar-info">
          <h1 className="navbar-title">ExpenseWallet</h1>
          <span className="navbar-email">
            {/* Small envelope icon */}
            <svg 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="email-icon"
            >
              <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#6B7280" strokeWidth="1.2" fill="none"/>
              <path d="M1 4.5L8 9L15 4.5" stroke="#6B7280" strokeWidth="1.2" fill="none"/>
            </svg>
            employer@company.com
          </span>
        </div>
      </div>
      
      {/* Sign out button */}
      <button className="navbar-signout">
        {/* Exit/logout arrow icon */}
        <svg 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="signout-icon"
        >
          <path d="M7 3H4C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H7" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 13L17 10L13 7" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 10H7" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
