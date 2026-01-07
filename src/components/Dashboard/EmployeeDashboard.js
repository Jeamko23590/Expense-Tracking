import { useState, useEffect } from 'react';
import ExpenseTransactions from '../ExpenseTransactions';
import RequestBudgetModal from './RequestBudgetModal';
import './EmployeeDashboard.css';

/**
 * EmployeeDashboard Component
 * Displays employee wallet balance, budget breakdown, and expense transactions.
 * Includes button to request additional budget.
 */
const EmployeeDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalBudget: 0,
    spent: 0,
    balance: 0,
    pendingRequest: 0,
    totalExpenses: 0
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('http://localhost:5000/api/expenses/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRequestSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsRequestModalOpen(false);
  };

  const budgetUsage = stats.totalBudget > 0 
    ? ((stats.spent / stats.totalBudget) * 100).toFixed(1) 
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

        <div className="wallet-balance">${stats.balance.toLocaleString()}</div>
        <div className="wallet-subtitle">Available to spend</div>

        {/* Budget Breakdown */}
        <div className="budget-breakdown">
          <div className="budget-item">
            <span className="budget-label">Total Budget</span>
            <span className="budget-value">${stats.totalBudget.toLocaleString()}</span>
          </div>
          <div className="budget-item">
            <span className="budget-label">Spent</span>
            <span className="budget-value">${stats.spent.toLocaleString()}</span>
          </div>
          <div className="budget-item">
            <span className="budget-label">Pending Request</span>
            <span className="budget-value budget-pending">
              {stats.pendingRequest > 0 ? `$${stats.pendingRequest.toLocaleString()}` : '-'}
            </span>
          </div>
        </div>

        {/* Budget Usage Progress Bar */}
        <div className="budget-usage">
          <span className="usage-label">Budget Usage</span>
          <span className="usage-percentage">{budgetUsage}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(budgetUsage, 100)}%` }}></div>
        </div>

        {/* Request Budget Button */}
        <button 
          className="request-budget-btn"
          onClick={() => setIsRequestModalOpen(true)}
          disabled={stats.pendingRequest > 0}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {stats.pendingRequest > 0 ? 'Request Pending' : 'Request Budget Increase'}
        </button>
      </div>

      {/* Expense Summary Cards */}
      <div className="expense-cards">
        {/* Total Expenses Card */}
        <div className="expense-card">
          <div className="expense-card-header">
            <span className="expense-card-title">Total Expenses</span>
            <div className="expense-card-icon icon-indigo">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <div className="expense-card-value value-indigo">{stats.totalExpenses}</div>
          <div className="expense-card-subtitle">Recorded transactions</div>
        </div>

        {/* Total Spent Card */}
        <div className="expense-card">
          <div className="expense-card-header">
            <span className="expense-card-title">Total Spent</span>
            <div className="expense-card-icon icon-green">
              <svg viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="expense-card-value value-green">${stats.spent.toLocaleString()}</div>
          <div className="expense-card-subtitle">From your budget</div>
        </div>

        {/* Pending Request Card */}
        <div className="expense-card">
          <div className="expense-card-header">
            <span className="expense-card-title">Budget Request</span>
            <div className="expense-card-icon icon-yellow">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="expense-card-value value-yellow">
            {stats.pendingRequest > 0 ? `$${stats.pendingRequest.toLocaleString()}` : 'None'}
          </div>
          <div className="expense-card-subtitle">
            {stats.pendingRequest > 0 ? 'Awaiting approval' : 'No pending request'}
          </div>
        </div>
      </div>

      {/* Expense Transactions Section */}
      <ExpenseTransactions user={user} onExpenseAdded={handleExpenseAdded} />

      {/* Request Budget Modal */}
      <RequestBudgetModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestSubmitted}
        currentBalance={stats.balance}
      />
    </div>
  );
};

export default EmployeeDashboard;
