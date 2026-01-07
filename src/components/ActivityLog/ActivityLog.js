import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../config';
import './ActivityLog.css';

/**
 * ActivityLog Component
 * Displays recent management actions fetched from backend API.
 * On mobile, shows as a floating button that opens a modal.
 */
const ActivityLog = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [lastViewedCount, setLastViewedCount] = useState(() => {
    return parseInt(localStorage.getItem('activityLogViewedCount') || '0', 10);
  });

  const fetchActivities = useCallback(async () => {
    try {
      const token = localStorage.getItem('corticoExpenseToken');
      const response = await fetch(`${API_URL}/api/activity`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshTrigger]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'employee_added':
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'budget_updated':
      case 'budget_added':
      case 'budget_approved':
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 5H9.5C7.5 5 6 6.5 6 8.5S7.5 12 9.5 12H14.5C16.5 12 18 13.5 18 15.5S16.5 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'budget_rejected':
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
        );
    }
  };

  const ActivityContent = () => (
    <>
      <div className="activity-list">
        {loading ? (
          <div className="activity-empty">
            <p>Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="activity-empty">
            <p>No recent activity</p>
          </div>
        ) : (
          activities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-item-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-item-content">
                <p className="activity-action">{activity.action}</p>
                <p className="activity-details">{activity.details}</p>
                {activity.amount && (
                  <p className="activity-amount">${activity.amount.toLocaleString()}</p>
                )}
                <p className="activity-time">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="activity-log activity-log-desktop">
        <div className="activity-header">
          <div className="activity-title-row">
            <span className="activity-icon-header">⚡</span>
            <h2 className="activity-title">Activity Log</h2>
          </div>
          <p className="activity-subtitle">Recent management actions</p>
        </div>
        <ActivityContent />
      </div>

      {/* Mobile Floating Button */}
      <button 
        className="activity-fab"
        onClick={() => {
          setIsMobileModalOpen(true);
          setLastViewedCount(activities.length);
          localStorage.setItem('activityLogViewedCount', activities.length.toString());
        }}
      >
        <span className="fab-icon">⚡</span>
        {activities.length > lastViewedCount && (
          <span className="fab-badge">{Math.min(activities.length - lastViewedCount, 9)}{(activities.length - lastViewedCount) > 9 ? '+' : ''}</span>
        )}
      </button>

      {/* Mobile Modal */}
      {isMobileModalOpen && (
        <div className="activity-modal-overlay" onClick={() => setIsMobileModalOpen(false)}>
          <div className="activity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="activity-modal-header">
              <div className="activity-title-row">
                <span className="activity-icon-header">⚡</span>
                <h2 className="activity-title">Activity Log</h2>
              </div>
              <button className="activity-modal-close" onClick={() => setIsMobileModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <p className="activity-subtitle">Recent management actions</p>
            <ActivityContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityLog;
