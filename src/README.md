# Source Code Structure

```
src/
├── components/               # Reusable UI components
│   ├── ActivityLog/          # Activity log sidebar for employers
│   │   ├── ActivityLog.js
│   │   ├── ActivityLog.css
│   │   └── index.js
│   ├── Dashboard/            # Dashboard views
│   │   ├── EmployerDashboard.js
│   │   ├── EmployerDashboard.css
│   │   ├── EmployeeDashboard.js
│   │   ├── EmployeeDashboard.css
│   │   └── index.js
│   ├── EmployeeManagement/   # Employee budget management
│   │   ├── EmployeeManagement.js
│   │   ├── EmployeeManagement.css
│   │   ├── AddEmployeeModal.js
│   │   ├── AddEmployeeModal.css
│   │   └── index.js
│   ├── ExpenseTransactions/  # Expense tracking for employees
│   │   ├── ExpenseTransactions.js
│   │   ├── ExpenseTransactions.css
│   │   ├── AddExpenseModal.js
│   │   ├── AddExpenseModal.css
│   │   └── index.js
│   ├── Login/                # Login page
│   │   ├── Login.js
│   │   ├── Login.css
│   │   └── index.js
│   └── Navbar/               # Navigation bar
│       ├── Navbar.js
│       ├── Navbar.css
│       └── index.js
├── styles/                   # Global styles
│   ├── App.css               # App container styles
│   └── index.css             # CSS reset and base styles
├── App.js                    # Main app component
└── index.js                  # React entry point
```

## Component Structure

Each component follows a folder-based structure:
- `ComponentName.js` - Component logic and JSX
- `ComponentName.css` - Component-specific styles
- `index.js` - Clean export for easier imports
