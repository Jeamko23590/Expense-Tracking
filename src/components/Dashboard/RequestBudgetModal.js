import { useState } from 'react';
import './RequestBudgetModal.css';

/**
 * RequestBudgetModal Component
 * Modal for employees to request additional budget from employer.
 */
const RequestBudgetModal = ({ isOpen, onClose, onSubmit, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestAmount = Number(amount);
    if (!requestAmount || requestAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('http://localhost:5000/api/budget-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          requestedAmount: requestAmount, 
          reason: reason.trim() 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAmount('');
        setReason('');
        onSubmit();
      } else {
        setError(data.message || 'Failed to submit request');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="request-budget-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Request Budget Increase</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="current-balance-info">
          <span className="balance-label">Current Balance</span>
          <span className="balance-amount">${currentBalance.toLocaleString()}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount to Request ($) *</label>
            <input
              type="number"
              id="amount"
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

          <div className="form-group">
            <label htmlFor="reason">Reason (Optional)</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you need additional budget..."
              rows="3"
              disabled={submitting}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestBudgetModal;
