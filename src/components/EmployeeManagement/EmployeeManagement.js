import React, { useState, useEffect } from 'react';
import AddEmployeeModal from './AddEmployeeModal';
import './EmployeeManagement.css';

/**
 * EmployeeManagement Component
 * Displays employee budget management section for employers.
 * Shows list of employees with their budget allocation, spending, and remaining balance.
 * Manages employees in localStorage.
 */
const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load employees from localStorage on mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem('corticoExpenseEmployees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('corticoExpenseEmployees', JSON.stringify(employees));
  }, [employees]);

  // Add new employee
  const handleAddEmployee = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  // Calculate usage percentage and determine color
  const getUsageColor = (spent, budget) => {
    if (budget === 0) return { color: '#E5E7EB', percentage: 0 };
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { color: '#EF4444', percentage: 100 };
    if (percentage >= 75) return { color: '#F59E0B', percentage };
    return { color: '#4F46E5', percentage };
  };

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="employee-management">
      {/* Section Header */}
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

      {/* Employee List */}
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
                  {/* Avatar with initials */}
                  <div className="employee-avatar">
                    {getInitials(employee.name)}
                  </div>
                  
                  {/* Name and email */}
                  <div className="employee-details">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-title">{employee.title}</p>
                    <p className="employee-email">{employee.email}</p>
                  </div>
                  
                  {/* View Expenses button */}
                  <button className="view-expenses-btn">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    View Expenses
                  </button>
                </div>

                {/* Budget Stats */}
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

                {/* Progress Bar */}
                <div className="budget-progress">
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${percentage}%`, backgroundColor: color }}
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

      {/* Add Employee Modal */}
      <AddEmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEmployee}
      />
    </div>
  );
};

export default EmployeeManagement;
