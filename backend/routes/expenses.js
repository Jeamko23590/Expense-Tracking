const express = require('express');
const pool = require('../config/db');
const { auth, employerOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/expenses
 * Get expenses - employees see their own, employers see all
 */
router.get('/', auth, async (req, res) => {
  try {
    let query, params;
    
    if (req.user.role === 'Employer') {
      query = `
        SELECT e.*, u.first_name, u.last_name, u.email as user_email
        FROM expenses e
        JOIN users u ON e.user_id = u.id
        ORDER BY e.created_at DESC
      `;
      params = [];
    } else {
      query = `SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC`;
      params = [req.user.id];
    }

    const [rows] = await pool.query(query, params);

    const expenses = rows.map(exp => ({
      id: exp.id,
      userId: exp.user_id,
      userName: exp.first_name ? `${exp.first_name} ${exp.last_name}` : null,
      userEmail: exp.user_email || null,
      description: exp.description,
      amount: parseFloat(exp.amount),
      category: exp.category,
      date: exp.date,
      notes: exp.notes,
      createdAt: exp.created_at
    }));

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/expenses
 * Add new expense - instant deduction from balance
 */
router.post('/', auth, async (req, res) => {
  try {
    const { description, amount, category, date, notes } = req.body;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check if user has enough balance
    const [userRows] = await pool.query(
      'SELECT budget, spent FROM users WHERE id = ?',
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];
    const balance = parseFloat(user.budget) - parseFloat(user.spent);

    if (amount > balance) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        balance: balance,
        requested: amount
      });
    }

    // Insert expense
    const [result] = await pool.query(
      `INSERT INTO expenses (user_id, description, amount, category, date, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, description, amount, category, date, notes || null]
    );

    // Update user's spent amount immediately
    await pool.query(
      'UPDATE users SET spent = spent + ? WHERE id = ?',
      [amount, req.user.id]
    );

    res.status(201).json({
      id: result.insertId,
      userId: req.user.id,
      description,
      amount: parseFloat(amount),
      category,
      date,
      notes: notes || null,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/expenses/stats
 * Get expense statistics for dashboard
 */
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role === 'Employer') {
      // Employer stats
      const [employeeCount] = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE role = "Employee"'
      );
      const [budgetStats] = await pool.query(
        'SELECT COALESCE(SUM(budget), 0) as totalBudget, COALESCE(SUM(spent), 0) as totalSpent FROM users WHERE role = "Employee"'
      );
      const [pendingStats] = await pool.query(
        'SELECT COALESCE(SUM(requested_amount), 0) as pendingAmount FROM budget_requests WHERE status = "pending"'
      );

      res.json({
        totalEmployees: employeeCount[0].count,
        totalBudget: parseFloat(budgetStats[0].totalBudget),
        totalSpent: parseFloat(budgetStats[0].totalSpent),
        pendingApproval: parseFloat(pendingStats[0].pendingAmount)
      });
    } else {
      // Employee stats
      const [userStats] = await pool.query(
        'SELECT budget, spent FROM users WHERE id = ?',
        [req.user.id]
      );
      const [expenseCount] = await pool.query(
        'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?',
        [req.user.id]
      );
      const [pendingRequest] = await pool.query(
        'SELECT requested_amount FROM budget_requests WHERE user_id = ? AND status = "pending"',
        [req.user.id]
      );

      const budget = userStats.length > 0 ? parseFloat(userStats[0].budget) : 0;
      const spent = userStats.length > 0 ? parseFloat(userStats[0].spent) : 0;
      const pending = pendingRequest.length > 0 ? parseFloat(pendingRequest[0].requested_amount) : 0;

      res.json({
        totalBudget: budget,
        spent: spent,
        balance: budget - spent,
        pendingRequest: pending,
        totalExpenses: expenseCount[0].count
      });
    }
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/expenses/balance
 * Get current balance for expense validation
 */
router.get('/balance', auth, async (req, res) => {
  try {
    const [userRows] = await pool.query(
      'SELECT budget, spent FROM users WHERE id = ?',
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const budget = parseFloat(userRows[0].budget);
    const spent = parseFloat(userRows[0].spent);

    res.json({
      budget,
      spent,
      balance: budget - spent
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
