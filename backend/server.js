const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const activityRoutes = require('./routes/activity');
const expenseRoutes = require('./routes/expenses');
const budgetRequestRoutes = require('./routes/budgetRequests');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget-requests', budgetRequestRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CorticoExpense API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
