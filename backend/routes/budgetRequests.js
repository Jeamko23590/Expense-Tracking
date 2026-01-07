const express = require('express');
const pool = require('../config/db');
const { auth, employerOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/budget-requests
 * Get budget requests - employees see their own, employers see all pending
 */
router.get('/', auth, async (req, res) => {
  try {
    let query, params;
    
    if (req.user.role === 'Employer') {
      query = `
        SELECT br.*, u.first_name, u.last_name, u.email, u.budget as current_budget
        FROM budget_requests br
        JOIN users u ON br.user_id = u.id
        ORDER BY br.status = 'pending' DESC, br.created_at DESC
      `;
      params = [];
    } else {
      query = `SELECT * FROM budget_requests WHERE user_id = ? ORDER BY created_at DESC`;
      params = [req.user.id];
    }

    const [rows] = await pool.query(query, params);

    const requests = rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      userName: r.first_name ? `${r.first_name} ${r.last_name}` : null,
      userEmail: r.email || null,
      currentBudget: r.current_budget ? parseFloat(r.current_budget) : null,
      requestedAmount: parseFloat(r.requested_amount),
      reason: r.reason,
      status: r.status,
      approvedAmount: r.approved_amount ? parseFloat(r.approved_amount) : null,
      createdAt: r.created_at,
      reviewedAt: r.reviewed_at
    }));

    res.json(requests);
  } catch (error) {
    console.error('Get budget requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/budget-requests
 * Create new budget request (Employee only)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { requestedAmount, reason } = req.body;

    if (!requestedAmount || requestedAmount <= 0) {
      return res.status(400).json({ message: 'Valid requested amount is required' });
    }

    // Check if user already has a pending request
    const [existing] = await pool.query(
      'SELECT id FROM budget_requests WHERE user_id = ? AND status = "pending"',
      [req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You already have a pending budget request' });
    }

    const [result] = await pool.query(
      `INSERT INTO budget_requests (user_id, requested_amount, reason)
       VALUES (?, ?, ?)`,
      [req.user.id, requestedAmount, reason || null]
    );

    // Log activity
    await pool.query(
      `INSERT INTO activity_log (user_id, action_type, action, details, amount)
       VALUES (?, 'budget_requested', 'Requested budget increase', ?, ?)`,
      [req.user.id, req.user.name, requestedAmount]
    );

    res.status(201).json({
      id: result.insertId,
      userId: req.user.id,
      requestedAmount: parseFloat(requestedAmount),
      reason: reason || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Create budget request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * PUT /api/budget-requests/:id
 * Approve or reject budget request (Employer only)
 */
router.put('/:id', auth, employerOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedAmount } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Get request details
    const [requests] = await pool.query(
      `SELECT br.*, u.first_name, u.last_name 
       FROM budget_requests br 
       JOIN users u ON br.user_id = u.id 
       WHERE br.id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Budget request not found' });
    }

    const request = requests[0];

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    const finalAmount = status === 'approved' ? (approvedAmount || request.requested_amount) : 0;

    // Update request
    await pool.query(
      `UPDATE budget_requests 
       SET status = ?, approved_amount = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE id = ?`,
      [status, status === 'approved' ? finalAmount : null, req.user.id, id]
    );

    // If approved, add to user's budget
    if (status === 'approved') {
      await pool.query(
        'UPDATE users SET budget = budget + ? WHERE id = ?',
        [finalAmount, request.user_id]
      );
    }

    // Log activity
    const employeeName = `${request.first_name} ${request.last_name}`;
    await pool.query(
      `INSERT INTO activity_log (user_id, action_type, action, details, amount)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        status === 'approved' ? 'budget_approved' : 'budget_rejected',
        status === 'approved' ? 'Approved budget request' : 'Rejected budget request',
        employeeName,
        status === 'approved' ? finalAmount : request.requested_amount
      ]
    );

    res.json({ 
      message: `Budget request ${status}`, 
      status,
      approvedAmount: status === 'approved' ? finalAmount : null
    });
  } catch (error) {
    console.error('Update budget request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/budget-requests/pending-count
 * Get count of pending requests (for employer dashboard)
 */
router.get('/pending-count', auth, employerOnly, async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(requested_amount), 0) as totalAmount
       FROM budget_requests WHERE status = 'pending'`
    );
    res.json({
      count: result[0].count,
      totalAmount: parseFloat(result[0].totalAmount)
    });
  } catch (error) {
    console.error('Get pending count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
