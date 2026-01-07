const express = require('express');
const pool = require('../config/db');
const { auth, employerOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/activity
 * Get recent activity logs (Employer only)
 */
router.get('/', auth, employerOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, action_type, action, details, amount, created_at 
       FROM activity_log 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    const activities = rows.map(log => ({
      id: log.id,
      type: log.action_type,
      action: log.action,
      details: log.details,
      amount: log.amount ? parseFloat(log.amount) : null,
      timestamp: log.created_at
    }));

    res.json(activities);
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
