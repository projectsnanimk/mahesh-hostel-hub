// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const {
  authenticateToken,
  requireRoles,
  restrictToAssignedHostel
} = require('./middleware/auth');

const {
  studentLogin,
  staffLogin
} = require('./controllers/authController');

const {
  scanQrCode
} = require('./controllers/scanController');

const {
  getKitchenMetrics,
  updateAssetStock
} = require('./controllers/kitchenController');

const {
  getStudentProfile,
  getStudentsList,
  createStudent,
  updateStudent,
  deleteStudent,
  logGateEvent,
  getGateLogsList
} = require('./controllers/studentController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '../public')));

// Root Redirect to beautiful portal landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Explicit routes for login pages (enabling separate slashless routing)
app.get('/login/student', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login/student/index.html'));
});

app.get('/login/staff', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login/staff/index.html'));
});

// ----------------------------------------------------
// AUTHENTICATION GATEWAYS
// ----------------------------------------------------
app.post('/api/auth/student/login', studentLogin);
app.post('/api/auth/staff/login', staffLogin);

// ----------------------------------------------------
// STUDENT PORTAL ENDPOINTS
// ----------------------------------------------------
app.get('/api/student/profile', authenticateToken, requireRoles(['STUDENT']), getStudentProfile);

// ----------------------------------------------------
// ANTI-DUPLICATE SCANNER (WARDEN TERMINAL)
// ----------------------------------------------------
app.post('/api/warden/scan-qr', authenticateToken, requireRoles(['WARDEN', 'ADMIN']), restrictToAssignedHostel, scanQrCode);

// ----------------------------------------------------
// CENTRAL KITCHEN MASTER CONTROL
// ----------------------------------------------------
app.get('/api/kitchen/dashboard-metrics', authenticateToken, requireRoles(['ADMIN', 'ACCOUNTANT']), getKitchenMetrics);
app.put('/api/kitchen/assets', authenticateToken, requireRoles(['ADMIN']), updateAssetStock);

// ----------------------------------------------------
// ACCOUNTANT / ADMIN GENERAL STUDENT CRUD
// ----------------------------------------------------
app.get('/api/accountant/students', authenticateToken, requireRoles(['ACCOUNTANT', 'ADMIN']), getStudentsList);
app.post('/api/accountant/students', authenticateToken, requireRoles(['ACCOUNTANT', 'ADMIN']), createStudent);
// PUT and DELETE check internal roles inside controller (allowing ADMIN only, returning 403 for ACCOUNTANT)
app.put('/api/accountant/students/:id', authenticateToken, requireRoles(['ACCOUNTANT', 'ADMIN']), updateStudent);
app.delete('/api/accountant/students/:id', authenticateToken, requireRoles(['ACCOUNTANT', 'ADMIN']), deleteStudent);

// ----------------------------------------------------
// WATCHMAN GATE MONITORING
// ----------------------------------------------------
app.post('/api/watchman/gate-log', authenticateToken, requireRoles(['WATCHMAN', 'ADMIN']), restrictToAssignedHostel, logGateEvent);
app.get('/api/watchman/gate-log', authenticateToken, requireRoles(['WATCHMAN', 'ADMIN']), restrictToAssignedHostel, getGateLogsList);

// Fallback Route to serve the SPA or handle undefined routes
app.get('*', (req, res) => {
  res.status(404).json({ status: 'ERROR', message: 'Endpoint not found or invalid client route.' });
});

// Start Database and then Express listener
if (require.main === module) {
  db.initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`========================================================================`);
      console.log(` HostelHub Server Running on http://localhost:${PORT}`);
      console.log(` Environment Mode: ${db.isFallback() ? 'In-Memory Fallback' : 'PostgreSQL Live Pool'}`);
      console.log(` Current Server Timestamp: ${new Date().toISOString()}`);
      console.log(`========================================================================`);
    });
  }).catch(err => {
    console.error('Critical database initialization failure:', err);
    process.exit(1);
  });
}

let isDbInitialized = false;
try {
  const functions = require('firebase-functions');
  exports.api = functions.https.onRequest(async (req, res) => {
    if (!isDbInitialized) {
      await db.initDb();
      isDbInitialized = true;
    }
    return app(req, res);
  });
} catch (e) {
  // Not running in serverless Firebase context
}

module.exports = app;
