import { useState } from 'react';
import './InsufficientBalanceModal.css';

/**
 * InsufficientBalanceModal Component
 * Shows when employee tries to spend more than their balance.
 * Allows them to request additional budget.
 */
const InsufficientBalanceModal = ({ isOpen, onClose, balance, requested, onRequestBudget }) => {
  const [requestAmount, setRequestAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const shortfall = requested - balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = Number(requestAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    setError('');

    const result = await onRequestBudget(amount, reason);
    
    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setRequestAmount('');
        setReason('');
        onClose();
      }, 2000);
    } else {
      setError(result.message || 'Failed to submit request');
    }
  };

  const handleClose = () => {
    setRequestAmount('');
    setReason('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="insufficient-modal" onClick={(e) => e.stopPropagation()}>
        {/* Warning Icon */}
        <div className="warning-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
        </div>

        <h2 className="modal-title">Insufficient Balance</h2>
        
        <p className="modal-message">
          You don't have enough balance to complete this expense.
        </p>

        <div className="balance-info">
          <div className="balance-row">
            <span>Current Balance:</span>
            <span className="balance-value">${balance.toLocaleString()}</span>
          </div>
          <div className="balance-row">
            <span>Expense Amount:</span>
            <span className="expense-value">${requested.toLocaleString()}</span>
          </div>
          <div className="balance-row shortfall">
            <span>Shortfall:</span>
            <span className="shortfall-value">${shortfall.toLocaleString()}</span>
          </div>
        </div>

        {success ? (
          <div className="success-message">
            <svg viewBox="0 0 24 24" fill="none">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Budget request submitted successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="request-form">
            <p className="form-label">Request Additional Budget</p>
            
            <div className="form-group">
              <label>Amount to Request ($)</label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                placeholder={shortfall.toString()}
                min="1"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label>Reason (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you need additional budget..."
                rows="2"
                disabled={submitting}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={handleClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn-request" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Request Budget'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InsufficientBalanceModal;
