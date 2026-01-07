import { useState, useEffect } from 'react';
import AddExpenseModal from './AddExpenseModal';
import InsufficientBalanceModal from './InsufficientBalanceModal';
import './ExpenseTransactions.css';

/**
 * ExpenseTransactions Component
 * 
 * Core component for the expense tracking feature. Displays a list of expenses
 * with search, filter, and weekly breakdown capabilities.
 * 
 * Design decisions:
 * - Uses local state for filters to provide instant feedback without API calls
 * - Weekly breakdown calculates on client-side to reduce server load
 * - Filtering happens on already-fetched data for better UX (no loading states)
 */
const ExpenseTransactions = ({ user, onExpenseAdded }) => {
  // Expense data and UI state
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insufficientModal, setInsufficientModal] = useState({ open: false, balance: 0, requested: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states - kept separate for independent control
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [showWeeklyBreakdown, setShowWeeklyBreakdown] = useState(false);
  
  // Role check for conditional rendering (employers see all expenses, employees see their own)
  const isEmployer = user?.role === 'Employer';

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

  // Get unique categories for filter dropdown
  const categories = [...new Set(expenses.map(e => e.category))];
  
  // Get unique employees for filter dropdown (employer only)
  const employees = isEmployer 
    ? [...new Set(expenses.filter(e => e.userName).map(e => e.userName))]
    : [];

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(expense => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.userName && expense.userName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;

    // Employee filter (employer only)
    const matchesEmployee = employeeFilter === 'all' || expense.userName === employeeFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      
      if (dateFilter === 'today') {
        matchesDate = expenseDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = expenseDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = expenseDate >= monthAgo;
      }
    }

    return matchesSearch && matchesCategory && matchesDate && matchesEmployee;
  });

  // Calculate total of filtered expenses
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  /**
   * Calculate weekly breakdown for the current year
   * Groups all expenses by ISO week number to show spending patterns
   * Only includes weeks that have expenses (filters out empty weeks)
   */
  const getWeeklyBreakdown = () => {
    const currentYear = new Date().getFullYear();
    const weeks = {};
    
    // Initialize all 52 weeks with zero values
    for (let i = 1; i <= 52; i++) {
      weeks[i] = { week: i, total: 0, count: 0 };
    }

    // Aggregate expenses by week number
    expenses.forEach(expense => {
      const expDate = new Date(expense.date);
      if (expDate.getFullYear() === currentYear) {
        const weekNum = getWeekNumber(expDate);
        if (weeks[weekNum]) {
          weeks[weekNum].total += expense.amount;
          weeks[weekNum].count += 1;
        }
      }
    });

    // Return only weeks with expenses for cleaner display
    return Object.values(weeks).filter(w => w.total > 0);
  };

  /**
   * Get ISO week number from date
   * Uses ISO 8601 standard where week 1 contains the first Thursday of the year
   */
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Get week date range for display
  const getWeekDateRange = (weekNum, year) => {
    const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
    const dow = simple.getDay();
    const startDate = new Date(simple);
    if (dow <= 4) {
      startDate.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      startDate.setDate(simple.getDate() + 8 - simple.getDay());
    }
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const formatShort = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${formatShort(startDate)} - ${formatShort(endDate)}`;
  };

  const weeklyData = getWeeklyBreakdown();

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
            <p className="transactions-subtitle">{isEmployer ? 'View all employee expenses' : 'Track and manage your expenses'}</p>
          </div>
        </div>
        {!isEmployer && (
          <button className="add-expense-btn" onClick={() => setIsModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Expense
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="expense-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" className="search-icon">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder={isEmployer ? "Search by description, category, or employee..." : "Search expenses..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          {isEmployer && employees.length > 0 && (
            <select 
              value={employeeFilter} 
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Employees</option>
              {employees.map(emp => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {error && <div className="error-state">{error}</div>}

      {/* Total and Weekly Breakdown Toggle */}
      <div className="expense-summary-bar">
        <div className="expense-total">
          <span className="total-label">Total:</span>
          <span className="total-value">${totalExpenses.toLocaleString()}</span>
          <span className="total-count">({filteredExpenses.length} expenses)</span>
        </div>
        <button 
          className={`weekly-toggle-btn ${showWeeklyBreakdown ? 'active' : ''}`}
          onClick={() => setShowWeeklyBreakdown(!showWeeklyBreakdown)}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {showWeeklyBreakdown ? 'Hide Weekly' : 'Weekly Breakdown'}
        </button>
      </div>

      {/* Weekly Breakdown Section */}
      {showWeeklyBreakdown && (
        <div className="weekly-breakdown">
          <h3 className="weekly-title">Weekly Expenses - {new Date().getFullYear()}</h3>
          {weeklyData.length === 0 ? (
            <p className="weekly-empty">No expenses recorded this year.</p>
          ) : (
            <div className="weekly-grid">
              {weeklyData.map(week => (
                <div key={week.week} className="weekly-item">
                  <div className="weekly-item-header">
                    <span className="weekly-week">Week {week.week}</span>
                    <span className="weekly-dates">{getWeekDateRange(week.week, new Date().getFullYear())}</span>
                  </div>
                  <div className="weekly-item-amount">${week.total.toLocaleString()}</div>
                  <div className="weekly-item-count">{week.count} expense{week.count !== 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>{expenses.length === 0 
              ? 'No expenses recorded yet. Click "Add Expense" to submit your first expense.'
              : 'No expenses match your search or filters.'
            }</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
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
                    {isEmployer && expense.userName && (
                      <span className="expense-employee">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {expense.userName}
                      </span>
                    )}
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
