import React from 'react';
import EmployeeManagement from '../EmployeeManagement';
import ActivityLog from '../ActivityLog';
import './EmployerDashboard.css';

/**
 * EmployerDashboard Component
 * Displays 4 summary cards: Total Employees, Total Budget, Total Spent, Pending Approval
 * Plus Employee Management section and Activity Log sidebar.
 */
const EmployerDashboard = () => {
  return (
    <div className="employer-dashboard">
      <div className="dashboard-layout">
        {/* Main Content */}
        <div className="dashboard-main">
          {/* Summary Cards Grid */}
          <div className="dashboard-grid">
            {/* Total Employees Card - White card */}
            <div className="dashboard-card card-white">
              <div className="card-header">
                <span className="card-title">Total Employees</span>
                <div className="card-icon icon-indigo">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="card-value value-indigo">0</div>
              <div className="card-subtitle">Active team members</div>
            </div>

            {/* Total Budget Card - Indigo card */}
            <div className="dashboard-card card-indigo">
              <div className="card-header">
                <span className="card-title">Total Budget</span>
                <div className="card-icon icon-white">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="card-value value-white">$0</div>
              <div className="card-subtitle">Allocated funds</div>
            </div>

            {/* Total Spent Card - White card */}
            <div className="dashboard-card card-white">
              <div className="card-header">
                <span className="card-title">Total Spent</span>
                <div className="card-icon icon-indigo">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17,6 23,6 23,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="card-value value-indigo">$0</div>
              <div className="card-subtitle">0% of total budget</div>
            </div>

            {/* Pending Approval Card - White card */}
            <div className="dashboard-card card-white">
              <div className="card-header">
                <span className="card-title">Pending Approval</span>
                <div className="card-icon icon-yellow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="card-value value-yellow">$0</div>
              <div className="card-subtitle">Awaiting review</div>
            </div>
          </div>

          {/* Employee Budget Management Section */}
          <EmployeeManagement />
        </div>

        {/* Sidebar - Activity Log */}
        <div className="dashboard-sidebar">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
