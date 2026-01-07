import React, { useState, useEffect } from 'react';
import AddExpenseModal from './AddExpenseModal';
import './ExpenseTransactions.css';

/**
 * ExpenseTransactions Component
 * Displays list of expense transactions for employees.
 * Shows expense details with status badges and amounts.
 */
const ExpenseTransactions = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem(`corticoExpenses_${user?.email}`);
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, [user]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`corticoExpenses_${user.email}`, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  // Add new expense
  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="expense-transactions">
      {/* Section Header */}
      <div className="transactions-header">
        <div className="transactions-title-section">
          <div className="transactions-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 21V9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h2 className="transactions-title">Expense Transactions</h2>
            <p className="transactions-subtitle">Track and manage your expense submissions</p>
          </div>
        </div>
        <button className="add-expense-btn" onClick={() => setIsModalOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses recorded yet. Click "Add Expense" to submit your first expense.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-item-left">
                {/* Tag Icon */}
                <div className="expense-tag-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                  </svg>
                </div>

                {/* Expense Details */}
                <div className="expense-details">
                  <div className="expense-title-row">
                    <h3 className="expense-title">{expense.description}</h3>
                    <span className={`expense-status ${getStatusClass(expense.status)}`}>
                      {expense.status}
                    </span>
                  </div>
                  <div className="expense-meta">
                    <span className="expense-category">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {expense.category}
                    </span>
                    <span className="expense-date">
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="expense-amount">
                ${expense.amount.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
      />
    </div>
  );
};

export default ExpenseTransactions;
