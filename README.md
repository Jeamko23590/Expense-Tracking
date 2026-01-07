# CorticoExpense - Expense Tracker Application

A full-stack expense tracking application that allows employees to easily report and track expenses, with separate dashboards for employers and employees.

## Features

### Core Features (Meeting Project Requirements)
- **Single Page Application** - React-based SPA for seamless user experience
- **Expense Tracking** - Track expenses with date, description, category, and amount
- **Add Expense Form** - Modal form to enter new expenses
- **Expense Table** - View all past expenses in a clean list format
- **Total Display** - Shows total amount of filtered expenses
- **Text Search/Filter** - Filter expenses by description, category
- **Weekly Breakdown** - View total expenses by week for the entire year

### Additional Features
- Role-based dashboards (Employer and Employee views)
- Employee management with budget allocation
- Budget request system for employees
- Activity log for management actions
- Mobile-friendly responsive design
- JWT-based authentication
- MySQL database for data persistence

## Tech Stack

- **Frontend:** React.js (JavaScript, no TypeScript)
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** Custom CSS with Cortico color scheme (Indigo #6366F1, Coral #F97066)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://www.mysql.com/) or XAMPP with MySQL

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/Jeamko23590/Expense-Tracking.git
cd Expense-Tracking/expense-tracker
```

2. **Database Setup**
   - Create a MySQL database named `cortico_expense`
   - Run the SQL script to create tables:
```bash
mysql -u root -p cortico_expense < backend/config/init.sql
```

3. **Backend Setup**
```bash
cd backend
npm install
```

   Update `backend/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cortico_expense
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_secret_key
PORT=5000
```

   Start the backend server:
```bash
npm start
```
   The API runs on http://localhost:5000

4. **Frontend Setup**
```bash
cd ..
npm install
npm start
```
   The app opens at http://localhost:3000

### Default Login Credentials

- **Employer:** employer@company.com / Password123

## Usage

### For Employees
1. Login with your credentials
2. View your wallet balance and budget breakdown
3. Click "Add Expense" to record a new expense
4. Use search and filters to find specific expenses
5. Click "Weekly Breakdown" to see expenses grouped by week
6. Request budget increase if needed

### For Employers
1. Login with employer credentials
2. View dashboard with total employees, budget, and spending stats
3. Manage employee budgets via Employee Management section
4. Approve or reject budget requests
5. View individual employee expenses via "View Expenses" button
6. Monitor activity log for recent actions

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   ├── db.js          # Database connection
│   │   └── init.sql       # Database schema
│   ├── middleware/
│   │   └── auth.js        # JWT authentication
│   ├── routes/
│   │   ├── auth.js        # Login/auth routes
│   │   ├── employees.js   # Employee management
│   │   ├── expenses.js    # Expense CRUD
│   │   ├── budgetRequests.js
│   │   └── activity.js    # Activity logging
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Dashboard/     # Employer & Employee dashboards
│   │   ├── ExpenseTransactions/  # Expense list, add, search
│   │   ├── EmployeeManagement/   # Employee CRUD
│   │   ├── BudgetRequests/       # Budget approval
│   │   ├── ActivityLog/          # Activity feed
│   │   ├── Login/                # Authentication
│   │   └── Navbar/               # Navigation
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |
| GET | /api/expenses | Get expenses |
| POST | /api/expenses | Add expense |
| GET | /api/expenses/stats | Get expense statistics |
| GET | /api/employees | Get all employees |
| POST | /api/employees | Add employee |
| GET | /api/employees/:id/expenses | Get employee's expenses |
| PUT | /api/employees/:id/budget | Add budget to employee |
| GET | /api/budget-requests | Get budget requests |
| POST | /api/budget-requests | Create budget request |
| PUT | /api/budget-requests/:id | Approve/reject request |
| GET | /api/activity | Get activity log |

## Design Decisions

1. **React with Hooks** - Modern React patterns for state management
2. **Component-based Architecture** - Reusable, modular components
3. **CSS Modules** - Scoped styling per component
4. **JWT Authentication** - Secure, stateless authentication
5. **MySQL** - Reliable relational database for data integrity
6. **Mobile-first Responsive Design** - Works on all screen sizes

## License

This project is for demonstration purposes.
