# CorticoExpense - Expense Tracker Application

A full-stack application for employees to easily report and track expenses, with separate dashboards for employers and employees.

## Features

- Role-based dashboards (Employer and Employee views)
- Employee management with budget allocation
- Add and track expense transactions
- Activity log for recent management actions
- View all expenses with status badges (pending/approved/rejected)
- Mobile-friendly responsive design
- JWT-based authentication
- MySQL database for data persistence

## Tech Stack

- **Frontend:** React.js (JavaScript, no TypeScript)
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** Custom CSS with Cortico color scheme

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://www.mysql.com/) or XAMPP with MySQL

### Clone the Repository

```bash
git clone https://github.com/Jeamko23590/Expense-Tracking.git
cd Expense-Tracking/expense-tracker
```

### Database Setup

1. Create a MySQL database named `cortico_expense`
2. Run the SQL script in `backend/config/init.sql` to create tables and default employer account

### Backend Setup

```bash
cd backend
npm install
```

Update `backend/.env` with your MySQL credentials if needed:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cortico_expense
DB_USER=root
DB_PASSWORD=
```

Start the backend server:
```bash
npm start
```

The API will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

```bash
cd ..
npm install
npm start
```

The app will open automatically in your browser at [http://localhost:3000](http://localhost:3000).

### Default Account

- **Employer:** employer@company.com
- **Password:** Password123

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── init.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   └── activity.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ActivityLog/
│   │   ├── Dashboard/
│   │   ├── EmployeeManagement/
│   │   ├── ExpenseTransactions/
│   │   ├── Login/
│   │   └── Navbar/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Employees (Employer only)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `DELETE /api/employees/:id` - Delete employee

### Activity Log (Employer only)
- `GET /api/activity` - Get recent activity logs

## License

This project is for demonstration purposes.
