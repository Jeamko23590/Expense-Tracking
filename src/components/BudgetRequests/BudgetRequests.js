import { useState, useEffect } from 'react';
import './BudgetRequests.css';

/**
 * BudgetRequests Component
 * Displays pending budget requests for employer to approve/reject.
 */
const BudgetRequests = ({ onAction }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch('http://localhost:5000/api/budget-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Only show pending requests
        setRequests(data.filter(r => r.status === 'pending'));
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status, customAmount = null) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const body = { status };
      if (customAmount !== null) {
        body.approvedAmount = customAmount;
      }

      const response = await fetch(`http://localhost:5000/api/budget-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        if (onAction) onAction();
      }
    } catch (err) {
      console.error('Failed to process request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="budget-requests">
        <div className="loading-state">Loading requests...</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return null; // Don't show section if no pending requests
  }

  return (
    <div className="budget-requests">
      <div className="requests-header">
        <div className="requests-title-section">
          <div className="requests-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="requests-title">Pending Budget Requests</h2>
            <p className="requests-subtitle">Review and approve employee budget requests</p>
          </div>
        </div>
        <span className="requests-count">{requests.length} pending</span>
      </div>

      <div className="requests-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-info">
              <div className="request-avatar">
                {request.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
              </div>
              <div className="request-details">
                <h3 className="request-name">{request.userName}</h3>
                <p className="request-email">{request.userEmail}</p>
                <p className="request-current">Current budget: ${request.currentBudget?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="request-amount-section">
              <div className="request-amount">
                <span className="amount-label">Requested</span>
                <span className="amount-value">${request.requestedAmount.toLocaleString()}</span>
              </div>
              {request.reason && (
                <p className="request-reason">"{request.reason}"</p>
              )}
              <p className="request-time">{formatTimeAgo(request.createdAt)}</p>
            </div>

            <div className="request-actions">
              <button 
                className="btn-approve"
                onClick={() => handleAction(request.id, 'approved')}
                disabled={processingId === request.id}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Approve
              </button>
              <button 
                className="btn-reject"
                onClick={() => handleAction(request.id, 'rejected')}
                disabled={processingId === request.id}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetRequests;
