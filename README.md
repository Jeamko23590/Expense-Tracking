# CorticoExpense - Expense Tracker Application

A single-page application for employees to easily report and track expenses, with separate dashboards for employers and employees.

## Features

- Role-based dashboards (Employer and Employee views)
- Employee management with budget allocation
- Add and track expense transactions
- View all expenses with status badges (pending/approved/rejected)
- Search/filter expenses by description
- View total expenses by week for the entire year
- Mobile-friendly responsive design
- Data persistence using localStorage
- Demo accounts for quick testing

## Tech Stack

- **Frontend:** React.js (JavaScript, no TypeScript)
- **Styling:** Custom CSS with Cortico color scheme
- **Storage:** localStorage for data persistence

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Clone the Repository

```bash
git clone https://github.com/Jeamko23590/Expense-Tracking.git
cd Expense-Tracking/expense-tracker
```

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
npm start
```

The app will open automatically in your browser at [http://localhost:3000](http://localhost:3000).

### Demo Accounts

Use these demo accounts to test the application:
- **Employer:** employer@company.com (any password)
- **Employee:** employee@company.com (any password)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── EmployerDashboard.js
│   │   │   ├── EmployerDashboard.css
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── EmployeeDashboard.css
│   │   │   └── index.js
│   │   ├── EmployeeManagement/
│   │   │   ├── EmployeeManagement.js
│   │   │   ├── EmployeeManagement.css
│   │   │   ├── AddEmployeeModal.js
│   │   │   ├── AddEmployeeModal.css
│   │   │   └── index.js
│   │   ├── ExpenseTransactions/
│   │   │   ├── ExpenseTransactions.js
│   │   │   ├── ExpenseTransactions.css
│   │   │   ├── AddExpenseModal.js
│   │   │   ├── AddExpenseModal.css
│   │   │   └── index.js
│   │   ├── Login/
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   └── index.js
│   │   └── Navbar/
│   │       ├── Navbar.js
│   │       ├── Navbar.css
│   │       └── index.js
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## License

This project is for demonstration purposes.
