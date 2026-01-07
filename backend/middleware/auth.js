const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Authentication Middleware
 * Verifies JWT token from request headers
 */
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Employer Only Middleware
 * Checks if user has Employer role
 */
const employerOnly = (req, res, next) => {
  if (req.user.role !== 'Employer') {
    return res.status(403).json({ message: 'Access denied. Employer only.' });
  }
  next();
};

module.exports = { auth, employerOnly };
