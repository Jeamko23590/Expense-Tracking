import { useState, useEffect } from 'react';
import AddExpenseModal from './AddExpenseModal';
import InsufficientBalanceModal from './InsufficientBalanceModal';
import './ExpenseTransactions.css';

/**
 * ExpenseTransactions Component
 * Displays list of expense transactions. Expenses are instant (no approval needed).
 */
const ExpenseTransactions = ({ user, onExpenseAdded }) => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insufficientModal, setInsufficientModal] = useState({ open: false, balance: 0, requested: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('http://localhost:5000/api/expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch expenses');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });

      const data = await response.json();

      if (response.ok) {
        setExpenses(prev => [data, ...prev]);
        if (onExpenseAdded) onExpenseAdded();
        return { success: true };
      } else if (response.status === 400 && data.message === 'Insufficient balance') {
        // Show insufficient balance modal
        setInsufficientModal({
          open: true,
          balance: data.balance,
          requested: data.requested
        });
        return { success: false, insufficientBalance: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Failed to connect to server' };
    }
  };

  const handleRequestBudget = async (amount, reason) => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('http://localhost:5000/api/budget-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestedAmount: amount, reason })
      });

      if (response.ok) {
        setInsufficientModal({ open: false, balance: 0, requested: 0 });
        if (onExpenseAdded) onExpenseAdded(); // Refresh stats
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Failed to connect to server' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="expense-transactions">
        <div className="loading-state">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="expense-transactions">
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
            <p className="transactions-subtitle">Track and manage your expenses</p>
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

      {error && <div className="error-state">{error}</div>}

      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses recorded yet. Click "Add Expense" to submit your first expense.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-item-left">
                <div className="expense-tag-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20.59 13.41L13.42 20.58C13.04 20.96 12.53 21.17 12 21.17C11.47 21.17 10.96 20.96 10.59 20.58L2 12V2H12L20.59 10.59C20.96 10.96 21.17 11.47 21.17 12C21.17 12.53 20.96 13.04 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
                <div className="expense-details">
                  <h3 className="expense-title">{expense.description}</h3>
                  <div className="expense-meta">
                    <span className="expense-category">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M20.59 13.41L13.42 20.58C13.04 20.96 12.53 21.17 12 21.17C11.47 21.17 10.96 20.96 10.59 20.58L2 12V2H12L20.59 10.59C20.96 10.96 21.17 11.47 21.17 12C21.17 12.53 20.96 13.04 20.59 13.41Z" stroke="currentColor" strokeWidth="2"/>
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
              <div className="expense-amount">${expense.amount.toLocaleString()}</div>
            </div>
          ))
        )}
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
      />

      <InsufficientBalanceModal
        isOpen={insufficientModal.open}
        onClose={() => setInsufficientModal({ open: false, balance: 0, requested: 0 })}
        balance={insufficientModal.balance}
        requested={insufficientModal.requested}
        onRequestBudget={handleRequestBudget}
      />
    </div>
  );
};

export default ExpenseTransactions;
