import React from 'react';
import './EmployeeDashboard.css';

/**
 * EmployeeDashboard Component
 * Displays employee-specific dashboard with wallet balance, budget breakdown,
 * and expense summary cards.
 */
const EmployeeDashboard = () => {
  // Placeholder data - will be dynamic later
  const walletData = {
    balance: 0,
    totalBudget: 0,
    spent: 0,
    pending: 0
  };

  const expenseData = {
    totalExpenses: 0,
    approved: 0,
    pendingReview: 0
  };

  // Calculate budget usage percentage
  const budgetUsage = walletData.totalBudget > 0 
    ? ((walletData.spent / walletData.totalBudget) * 100).toFixed(1) 
    : 0;

  return (
    <div className="employee-dashboard">
      {/* Main Wallet Balance Card */}
      <div className="wallet-card">
        <div className="wallet-header">
          <div className="wallet-title">
            <svg viewBox="0 0 24 24" fill="none" className="wallet-title-icon">
              <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
              <rect x="16" y="13" width="3" height="2" rx="0.5" fill="currentColor"/>
            </svg>
            Your Wallet Balance
          </div>
          <div className="wallet-icon-container">
            <svg viewBox="0 0 24 24" fill="none" className="wallet-dollar-icon">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="wallet-balance">${walletData.balance.toLocaleString()}</div>
        <div className="wallet-subtitle">Available to spend</div>

        {/* Budget Breakdown */}
        <div className="budget-breakdown">
          <div className="budget-item">
            <span className="budget-label">Total Budget</span>
            <span className="budget-value">${walletData.totalBudget.toLocaleString()}</span>
          </div>
          <div className="budget-item">
            <span className="budget-label">Spent</span>
            <span className="budget-value">${walletData.spent.toLocaleString()}</span>
          </div>
          <div className="budget-item">
            <span className="budget-label">Pending</span>
            <span className="budget-value">${walletData.pending.toLocaleString()}</span>
          </div>
        </div>

        {/* Budget Usage Progress Bar */}
        <div className="budget-usage">
          <span className="usage-label">Budget Usage</span>
          <span className="usage-percentage">{budgetUsage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${budgetUsage}%` }}
          ></div>
        </div>
      </div>

      {/* Expense Summary Cards */}
      <div className="expense-cards">
        {/* Total Expenses Card */}
        <div className="expense-card">
          <div className="expense-card-header">
            <span className="expense-card-title">Total Expenses</span>
            <div className="expense-card-icon icon-indigo">
              <svg viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="expense-card-value value-indigo">{expenseData.totalExpenses}</div>
          <div className="expense-card-subtitle">Recorded transactions</div>
        </div>

        {/* Approved Card */}
        <div className="expense-card">
          <div className="expense-card-header">
            <span className="expense-card-title">Approved</span>
            <div className="expense-card-icon icon-green">
              <svg viewBox="0 0 24 24" fill="none">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17,6 23,6 23,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="expense-card-value value-green">{expenseData.approved}</div>
          <div className="expense-card-subtitle">Approved budget</div>
        </div>

        {/* Pending Review Card */}
        <div className="expense-card">
          <div className="expense-card-header">
            <span className="expense-card-title">Pending Review</span>
            <div className="expense-card-icon icon-yellow">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <div className="expense-card-value value-yellow">{expenseData.pendingReview}</div>
          <div className="expense-card-subtitle">Awaiting approval</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
