import { useState } from 'react';
import './AddBudgetModal.css';

/**
 * AddBudgetModal Component
 * Modal for employer to add budget to an employee.
 */
const AddBudgetModal = ({ isOpen, onClose, employee, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const budgetAmount = Number(amount);
    if (!budgetAmount || budgetAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    setError('');

    const result = await onAdd(employee.id, budgetAmount);
    
    setSubmitting(false);

    if (result.success) {
      setAmount('');
      onClose();
    } else {
      setError(result.message || 'Failed to add budget');
    }
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  if (!isOpen || !employee) return null;

  const remaining = employee.budget - employee.spent;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-budget-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Budget</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="employee-info-section">
          <div className="employee-avatar">
            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h3 className="employee-name">{employee.name}</h3>
            <p className="employee-email">{employee.email}</p>
          </div>
        </div>

        <div className="current-budget-info">
          <div className="budget-row">
            <span>Current Budget:</span>
            <span className="budget-value">${employee.budget.toLocaleString()}</span>
          </div>
          <div className="budget-row">
            <span>Spent:</span>
            <span>${employee.spent.toLocaleString()}</span>
          </div>
          <div className="budget-row">
            <span>Remaining:</span>
            <span style={{ color: remaining <= 0 ? '#DC2626' : '#10B981' }}>
              ${remaining.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount to Add ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
              placeholder="1000"
              min="1"
              disabled={submitting}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
