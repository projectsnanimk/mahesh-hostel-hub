// server/controllers/scanController.js
const db = require('../db');

// Helper to determine the current meal window based on system time (hour 0-23)
function getCurrentMealWindow(date = new Date()) {
  const hour = date.getHours();
  
  if (hour >= 6 && hour < 10) {
    return 'MORNING';
  } else if (hour >= 12 && hour < 15) {
    return 'AFTERNOON';
  } else if (hour >= 18 && hour < 21) {
    return 'EVENING';
  }
  return null; // Outside meal windows
}

// Warden Scan QR Controller
async function scanQrCode(req, res) {
  try {
    const { qr_token } = req.body;
    const wardenHostel = req.user.assigned_hostel;

    if (!qr_token) {
      return res.status(400).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: 'Scan Rejected: Invalid QR token data.'
      });
    }

    // Step 1: Parse the QR token
    let qrData;
    try {
      // The token can be a JSON string
      qrData = JSON.parse(qr_token);
    } catch (e) {
      return res.status(400).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: 'Scan Rejected: Unreadable QR Code payload.'
      });
    }

    const { student_id, meal_window, timestamp } = qrData;

    if (!student_id || !meal_window || !timestamp) {
      return res.status(400).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: 'Scan Rejected: Malformed QR data structure.'
      });
    }

    // Fetch student profile to verify block lock
    const student = await db.getStudentById(student_id);
    if (!student) {
      return res.status(404).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: `Fraud Alert: Student record '${student_id}' does not exist.`
      });
    }

    // Enforce Hardware block lock for WARDEN: Warden must belong to same hostel as student
    // Ensure Warden is not scan-jacking other blocks
    if (wardenHostel && student.hostel_id.toUpperCase() !== wardenHostel.toUpperCase()) {
      return res.status(403).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: `Security Violation: Warden is locked to Block ${wardenHostel}. Cannot scan Student from Block ${student.hostel_id}.`
      });
    }

    // Check QR expiration: 30 seconds ceiling
    const serverTime = Date.now();
    const timeDriftMs = Math.abs(serverTime - parseInt(timestamp));
    if (timeDriftMs > 30000) {
      return res.status(400).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: 'Verification Failure: QR Code has expired. Auto-refreshes every 30 seconds.'
      });
    }

    // Step 2: Confirm the incoming token matches the current scheduled clock window
    const activeWindow = getCurrentMealWindow();
    if (!activeWindow) {
      return res.status(400).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: 'Scan Denied: Central Kitchen is closed. No active meal window at this hour.'
      });
    }

    if (meal_window.toUpperCase() !== activeWindow) {
      return res.status(400).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: `Fraud Alert: QR slot '${meal_window}' does not match live window '${activeWindow}'.`
      });
    }

    // Step 3: Query attendance logs database for the current date and active window
    const todayStr = new Date().toISOString().split('T')[0];
    const existingScan = await db.checkDuplicateMessScan(student_id, activeWindow, todayStr);

    if (existingScan) {
      const scannedTime = new Date(existingScan.scanned_at).toLocaleTimeString();
      return res.status(400).json({
        status: 'DENIED',
        ui_color: 'RED',
        message: `Fraud Alert! Already scanned for this meal at ${scannedTime}.`
      });
    }

    // Step 4: Write row transaction to logs and return success
    const log = await db.addMessLog(student_id, student.hostel_id, activeWindow);
    return res.status(200).json({
      status: 'SUCCESS',
      ui_color: 'GREEN',
      message: `Scan Verified! Portion allocated for student ${student.full_name} (${student_id}).`,
      timestamp: log.scanned_at
    });
    
  } catch (err) {
    console.error('Scan QR error:', err);
    return res.status(500).json({
      status: 'DENIED',
      ui_color: 'RED',
      message: 'Internal Server Error processing scan.'
    });
  }
}

module.exports = {
  scanQrCode,
  getCurrentMealWindow
};
