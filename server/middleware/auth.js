// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hostel_hub_key_2026';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ status: 'ERROR', message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ status: 'ERROR', message: 'Access Denied: Invalid Token' });
  }
}

// Middleware to check if user has required roles (RBAC)
function requireRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return res.status(403).json({
        status: 'ERROR',
        message: `Forbidden: This action requires one of the following roles: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`
      });
    }
    next();
  };
}

// Middleware to enforce block lock (Warden and Watchman scope checks)
// Ensures staff can only see or modify data matching their assigned_hostel
function restrictToAssignedHostel(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
  }

  const { role, assigned_hostel } = req.user;

  // Global Admins and Central Accountants are not bound to a specific hostel block
  if (role === 'ADMIN' || role === 'ACCOUNTANT') {
    return next();
  }

  // Wardens and Watchmen must have an assigned hostel
  if (!assigned_hostel) {
    return res.status(403).json({ status: 'ERROR', message: 'Forbidden: No hostel block assigned to your account' });
  }

  // Capture hostel_id from route parameter or body
  const requestHostelId = req.params.hostelId || req.body.hostel_id || req.query.hostel_id;

  if (requestHostelId && requestHostelId.toUpperCase() !== assigned_hostel.toUpperCase()) {
    return res.status(403).json({
      status: 'ERROR',
      message: `Forbidden: Your hardware scope is locked to block ${assigned_hostel}. You cannot access block ${requestHostelId}.`
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  requireRoles,
  restrictToAssignedHostel
};
