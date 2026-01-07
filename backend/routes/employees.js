const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { auth, employerOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/employees
 * Get all employees (Employer only)
 */
router.get('/', auth, employerOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, email, role, title, department, phone, budget, spent, created_at 
       FROM users WHERE role = 'Employee' ORDER BY created_at DESC`
    );

    const employees = rows.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      title: user.title,
      department: user.department,
      phone: user.phone,
      budget: parseFloat(user.budget),
      spent: parseFloat(user.spent),
      createdAt: user.created_at
    }));

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/employees
 * Add new employee (Employer only)
 */
router.post('/', auth, employerOnly, async (req, res) => {
  try {
    const { firstName, lastName, email, password, title, department, phone, budget } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !title || !department || !budget) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new employee
    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, title, department, phone, budget, spent)
       VALUES (?, ?, ?, ?, 'Employee', ?, ?, ?, ?, 0)`,
      [firstName, lastName, email.toLowerCase(), hashedPassword, title, department, phone || null, budget]
    );

    // Log activity
    await pool.query(
      `INSERT INTO activity_log (user_id, action_type, action, details, amount)
       VALUES (?, 'employee_added', 'Added new employee', ?, ?)`,
      [req.user.id, `${firstName} ${lastName}`, budget]
    );

    // Return new employee data
    res.status(201).json({
      id: result.insertId,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      role: 'Employee',
      title,
      department,
      phone: phone || null,
      budget: parseFloat(budget),
      spent: 0
    });
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/employees/:id
 * Delete employee (Employer only)
 */
router.delete('/:id', auth, employerOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role = "Employee"', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
