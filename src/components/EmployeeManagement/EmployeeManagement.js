import { useState, useEffect } from 'react';
import AddEmployeeModal from './AddEmployeeModal';
import AddBudgetModal from './AddBudgetModal';
import { API_URL } from '../../config';
import './EmployeeManagement.css';

/**
 * EmployeeManagement Component
 * Displays employee budget management section for employers.
 * Allows adding employees and adjusting their budgets.
 */
const EmployeeManagement = ({ onEmployeeAdded }) => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetModal, setBudgetModal] = useState({ open: false, employee: null });
  const [expensesModal, setExpensesModal] = useState({ open: false, employee: null, expenses: [], loading: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('${API_URL}/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('${API_URL}/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      });

      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees(prev => [newEmployee, ...prev]);
        if (onEmployeeAdded) onEmployeeAdded();
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (err) {
      return { success: false, message: 'Failed to connect to server' };
    }
  };

  const handleAddBudget = async (employeeId, amount) => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch(`${API_URL}/api/employees/${employeeId}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (response.ok) {
        // Update local state
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, budget: emp.budget + amount }
            : emp
        ));
        if (onEmployeeAdded) onEmployeeAdded();
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (err) {
      return { success: false, message: 'Failed to connect to server' };
    }
  };

  const getUsageColor = (spent, budget) => {
    if (budget === 0) return { color: '#E5E7EB', percentage: 0 };
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { color: '#EF4444', percentage: 100 };
    if (percentage >= 75) return { color: '#F59E0B', percentage };
    return { color: '#4F46E5', percentage };
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get unique roles/titles for filter
  const roles = [...new Set(employees.map(e => e.title))];

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === 'all' || employee.title === roleFilter;

    // Date filter (based on when employee was added)
    let matchesDate = true;
    if (dateFilter !== 'all' && employee.createdAt) {
      const createdDate = new Date(employee.createdAt);
      const now = new Date();
      
      if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = createdDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = createdDate >= monthAgo;
      } else if (dateFilter === 'quarter') {
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        matchesDate = createdDate >= quarterAgo;
      }
    }

    return matchesSearch && matchesRole && matchesDate;
  });

  const fetchEmployeeExpenses = async (employee) => {
    setExpensesModal({ open: true, employee, expenses: [], loading: true });
    setExpenseSearchTerm(''); // Reset search when opening modal
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch(`${API_URL}/api/employees/${employee.id}/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setExpensesModal(prev => ({ ...prev, expenses: data, loading: false }));
      } else {
        setExpensesModal(prev => ({ ...prev, expenses: [], loading: false }));
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setExpensesModal(prev => ({ ...prev, expenses: [], loading: false }));
    }
  };

  // Filter expenses in modal by description
  const filteredModalExpenses = expensesModal.expenses.filter(expense => 
    expenseSearchTerm === '' || 
    expense.description.toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(expenseSearchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="employee-management">
        <div className="loading-state">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="employee-management">
      <div className="management-header">
        <div className="management-title-section">
          <div className="management-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="management-title">Employee Budget Management</h2>
            <p className="management-subtitle">Allocate and track budgets for your team members</p>
          </div>
        </div>
        <button className="add-employee-btn" onClick={() => setIsModalOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Employee
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="employee-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" className="search-icon">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Time</option>
          <option value="week">Added This Week</option>
          <option value="month">Added This Month</option>
          <option value="quarter">Added This Quarter</option>
        </select>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="employee-list">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <p>{employees.length === 0 
              ? 'No employees added yet. Click "Add Employee" to get started.'
              : 'No employees match your search or filters.'
            }</p>
          </div>
        ) : (
          filteredEmployees.map((employee) => {
            const { color, percentage } = getUsageColor(employee.spent, employee.budget);
            const remaining = employee.budget - employee.spent;
            
            return (
              <div key={employee.id} className="employee-card">
                <div className="employee-info">
                  <div className="employee-avatar">
                    {getInitials(employee.name)}
                  </div>
                  
                  <div className="employee-details">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-title">{employee.title}</p>
                    <p className="employee-email">{employee.email}</p>
                  </div>
                  
                  <div className="employee-actions">
                    <button 
                      className="add-budget-btn"
                      onClick={() => setBudgetModal({ open: true, employee })}
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M17 5H9.5C7.5 5 6 6.5 6 8.5S7.5 12 9.5 12H14.5C16.5 12 18 13.5 18 15.5S16.5 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Add Budget
                    </button>
                    <button 
                      className="view-expenses-btn"
                      onClick={() => fetchEmployeeExpenses(employee)}
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      View Expenses
                    </button>
                  </div>
                </div>

                <div className="budget-stats">
                  <div className="stat-box">
                    <span className="stat-label">Budget</span>
                    <span className="stat-value">${employee.budget.toLocaleString()}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Spent</span>
                    <span className="stat-value">${employee.spent.toLocaleString()}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Remaining</span>
                    <span className="stat-value stat-remaining" style={{ color: remaining <= 0 ? '#EF4444' : '#10B981' }}>
                      ${remaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="budget-progress">
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
                    ></div>
                  </div>
                  <span className="progress-percentage" style={{ color }}>
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <AddBudgetModal
        isOpen={budgetModal.open}
        onClose={() => setBudgetModal({ open: false, employee: null })}
        employee={budgetModal.employee}
        onAdd={handleAddBudget}
      />

      {/* View Expenses Modal */}
      {expensesModal.open && (
        <div className="expenses-modal-overlay" onClick={() => setExpensesModal({ open: false, employee: null, expenses: [], loading: false })}>
          <div className="expenses-modal" onClick={(e) => e.stopPropagation()}>
            <div className="expenses-modal-header">
              <div className="expenses-modal-title-section">
                <div className="expenses-modal-avatar">
                  {expensesModal.employee && getInitials(expensesModal.employee.name)}
                </div>
                <div>
                  <h2 className="expenses-modal-title">{expensesModal.employee?.name}'s Expenses</h2>
                  <p className="expenses-modal-subtitle">{expensesModal.employee?.title}</p>
                </div>
              </div>
              <button 
                className="expenses-modal-close" 
                onClick={() => setExpensesModal({ open: false, employee: null, expenses: [], loading: false })}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="expenses-modal-stats">
              <div className="expenses-stat">
                <span className="expenses-stat-label">Budget</span>
                <span className="expenses-stat-value">${expensesModal.employee?.budget.toLocaleString()}</span>
              </div>
              <div className="expenses-stat">
                <span className="expenses-stat-label">Spent</span>
                <span className="expenses-stat-value">${expensesModal.employee?.spent.toLocaleString()}</span>
              </div>
              <div className="expenses-stat">
                <span className="expenses-stat-label">Remaining</span>
                <span className="expenses-stat-value" style={{ color: (expensesModal.employee?.budget - expensesModal.employee?.spent) <= 0 ? '#EF4444' : '#10B981' }}>
                  ${(expensesModal.employee?.budget - expensesModal.employee?.spent).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Search filter for expenses */}
            <div className="expenses-modal-search">
              <svg viewBox="0 0 24 24" fill="none" className="expenses-search-icon">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by description..."
                value={expenseSearchTerm}
                onChange={(e) => setExpenseSearchTerm(e.target.value)}
                className="expenses-search-input"
              />
            </div>

            <div className="expenses-modal-list">
              {expensesModal.loading ? (
                <div className="expenses-modal-empty">Loading expenses...</div>
              ) : filteredModalExpenses.length === 0 ? (
                <div className="expenses-modal-empty">
                  {expensesModal.expenses.length === 0 
                    ? 'No expenses recorded yet.' 
                    : 'No expenses match your search.'}
                </div>
              ) : (
                filteredModalExpenses.map((expense) => (
                  <div key={expense.id} className="expenses-modal-item">
                    <div className="expenses-modal-item-left">
                      <div className="expenses-modal-item-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M20.59 13.41L13.42 20.58C13.04 20.96 12.53 21.17 12 21.17C11.47 21.17 10.96 20.96 10.59 20.58L2 12V2H12L20.59 10.59C20.96 10.96 21.17 11.47 21.17 12C21.17 12.53 20.96 13.04 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="expenses-modal-item-details">
                        <h4 className="expenses-modal-item-title">{expense.description}</h4>
                        <div className="expenses-modal-item-meta">
                          <span>{expense.category}</span>
                          <span>•</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="expenses-modal-item-amount">${expense.amount.toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
