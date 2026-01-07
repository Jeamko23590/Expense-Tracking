import { useState, useEffect } from 'react';
import AddEmployeeModal from './AddEmployeeModal';
import AddBudgetModal from './AddBudgetModal';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('http://localhost:5000/api/employees', {
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
      const response = await fetch('http://localhost:5000/api/employees', {
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
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}/budget`, {
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

      {error && <div className="error-state">{error}</div>}

      <div className="employee-list">
        {employees.length === 0 ? (
          <div className="empty-state">
            <p>No employees added yet. Click "Add Employee" to get started.</p>
          </div>
        ) : (
          employees.map((employee) => {
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
                    <button className="view-expenses-btn">
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
    </div>
  );
};

export default EmployeeManagement;
