# CorticoExpense Backend API

Node.js/Express backend with MySQL database for the CorticoExpense application.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL database

### Installation

```bash
npm install
```

### Database Setup

1. Create a MySQL database named `cortico_expense`
2. Run the SQL script in `config/init.sql`

### Environment Variables

Create a `.env` file (or update the existing one):

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cortico_expense
DB_USER=root
DB_PASSWORD=

JWT_SECRET=cortico_expense_secret_key_2026

PORT=5000
```

### Run the Server

```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user from token |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

## Default Account

- **Email:** employer@company.com
- **Password:** Password123

## Project Structure

```
backend/
├── config/
│   ├── db.js           # MySQL connection pool
│   └── init.sql        # Database schema
├── middleware/
│   └── auth.js         # JWT authentication middleware
├── routes/
│   └── auth.js         # Authentication routes
├── scripts/
│   └── hashPassword.js # Password hashing utility
├── server.js           # Express server entry point
├── package.json
├── .env                # Environment variables
└── .gitignore
```
