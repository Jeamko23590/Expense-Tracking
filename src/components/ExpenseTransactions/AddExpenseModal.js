import { useState } from 'react';
import './AddExpenseModal.css';

/**
 * AddExpenseModal Component
 * Modal form for adding new expense transactions via API.
 */
const AddExpenseModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const categories = [
    'Travel', 'Meals', 'Equipment', 'Software', 'Office Supplies',
    'Transportation', 'Accommodation', 'Training', 'Entertainment', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setApiError('');

    const expenseData = {
      description: formData.description.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes.trim()
    };

    const result = await onAdd(expenseData);
    setSubmitting(false);

    if (result.success) {
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setErrors({});
      onClose();
    } else {
      setApiError(result.message || 'Failed to add expense');
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setErrors({});
    setApiError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Expense</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="expense-modal-form">
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Flight to client meeting"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'input-error' : ''}
              disabled={submitting}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount ($) *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="1200"
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? 'input-error' : ''}
                min="0"
                step="0.01"
                disabled={submitting}
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'input-error' : ''}
                disabled={submitting}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
              disabled={submitting}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Additional details about this expense..."
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              disabled={submitting}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
