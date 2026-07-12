// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hostel_hub_key_2026';

// Role Codes helper for Staff Default Password
const ROLE_CODES = {
  ADMIN: 'ADM',
  ACCOUNTANT: 'ACT',
  WARDEN: 'WDN',
  WATCHMAN: 'WCH'
};

// ----------------------------------------------------
// ALGORITHMIC HELPERS
// ----------------------------------------------------

/**
 * Format string according to 3-character name rules.
 * Spaces removed, uppercase, padded with 'X' if shorter than 3 chars.
 */
function cleanNameForPassword(name) {
  const cleaned = name.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length >= 3) {
    return cleaned.substring(0, 3);
  }
  return cleaned.padEnd(3, 'X');
}

/**
 * Formula A: Student User ID
 * Format: [BlockID][RegistrationDay][RegistrationMonth][RegistrationYear][3-DigitDailyAscendingSerialNumber]
 * Example: M1 + 12 + 07 + 26 + 001 => M1120726001
 */
async function calculateStudentId(blockId, regDateStr) {
  const regDate = new Date(regDateStr);
  const day = String(regDate.getDate()).padStart(2, '0');
  const month = String(regDate.getMonth() + 1).padStart(2, '0');
  const year = String(regDate.getFullYear()).substring(2); // Last 2 digits

  // Query database for count of registrations in this block on this date
  const dateOnlyStr = regDate.toISOString().split('T')[0];
  const activeCount = await db.getStudentsCountForDateAndHostel(blockId, dateOnlyStr);
  const nextSerialNum = String(activeCount + 1).padStart(3, '0');

  return `${blockId}${day}${month}${year}${nextSerialNum}`;
}

/**
 * Formula B: Student Default Password
 * Format: [First 3 Letters of Student Name in Uppercase, Spaces Removed] + "@" + [Date of Birth in DDMMYYYY format]
 * Example: MOH@27052004
 */
function calculateStudentDefaultPassword(fullName, dobStr) {
  const namePart = cleanNameForPassword(fullName);
  
  const dob = new Date(dobStr);
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = String(dob.getFullYear());

  return `${namePart}@${day}${month}${year}`;
}

/**
 * Formula C: Staff Default Password
 * Format: [RoleCode] + [First 3 Letters of Staff Name in Uppercase, Spaces Removed] + [Hiring Year]
 * Example: ACTSUR2026
 */
function calculateStaffDefaultPassword(role, fullName, hiringYear) {
  const roleCode = ROLE_CODES[role.toUpperCase()];
  if (!roleCode) {
    throw new Error(`Invalid role for staff password generation: ${role}`);
  }
  const namePart = cleanNameForPassword(fullName);
  return `${roleCode}${namePart}${hiringYear}`;
}

// ----------------------------------------------------
// ROUTE CONTROLLERS
// ----------------------------------------------------

// Student Login controller
async function studentLogin(req, res) {
  try {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
      return res.status(400).json({ status: 'ERROR', message: 'Student ID and Password are required' });
    }

    const student = await db.getStudentById(student_id);
    if (!student) {
      return res.status(401).json({ status: 'ERROR', message: 'Authentication Failed: Invalid Student ID or Password' });
    }

    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return res.status(401).json({ status: 'ERROR', message: 'Authentication Failed: Invalid Student ID or Password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: student.student_id,
        name: student.full_name,
        role: 'STUDENT',
        hostel_id: student.hostel_id,
        room_number: student.room_number
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Student Authenticated Successfully',
      token,
      redirect: '/dashboards/student.html'
    });
  } catch (err) {
    console.error('Student Login error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
  }
}

// Staff Login controller
async function staffLogin(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ status: 'ERROR', message: 'Username/Email/Staff ID and Password are required' });
    }

    // Fetch user from DB
    let user = null;
    if (identifier.toUpperCase().startsWith('GL') || identifier.toUpperCase().startsWith('M1') || identifier.toUpperCase().startsWith('M2') || identifier.toUpperCase().startsWith('M3')) {
      // Looks like a Staff ID
      user = await db.getStaffUserById(identifier);
    } else {
      // Username or Email
      user = await db.getStaffUserByUsernameOrEmail(identifier);
    }

    if (!user) {
      return res.status(401).json({ status: 'ERROR', message: 'Authentication Failed: Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ status: 'ERROR', message: 'Authentication Failed: Invalid Credentials' });
    }

    // Strict validation check:
    // Admin (GLADM001) -> Corporate Mail ID or username only
    // Accountant, Warden, Watchman -> Staff ID string only
    let redirectUrl = '';
    
    switch (user.user_role) {
      case 'ADMIN':
        // Must log in with email or username (i.e. not the raw ID GLADM001)
        if (identifier === 'GLADM001') {
          return res.status(400).json({
            status: 'ERROR',
            message: 'Admin Authentication Restriction: Global Admin must log in using Corporate Mail ID or Username, not Staff ID.'
          });
        }
        redirectUrl = '/dashboards/admin.html';
        break;

      case 'ACCOUNTANT':
        if (identifier !== user.user_id) {
          return res.status(400).json({
            status: 'ERROR',
            message: 'Accountant Authentication Restriction: Central Accountant must log in using their unique Staff ID string.'
          });
        }
        redirectUrl = '/dashboards/accountant.html';
        break;

      case 'WARDEN':
        if (identifier !== user.user_id) {
          return res.status(400).json({
            status: 'ERROR',
            message: 'Warden Authentication Restriction: Local Warden must log in using their unique Staff ID string.'
          });
        }
        redirectUrl = '/dashboards/warden.html';
        break;

      case 'WATCHMAN':
        if (identifier !== user.user_id) {
          return res.status(400).json({
            status: 'ERROR',
            message: 'Watchman Authentication Restriction: Local Watchman must log in using their unique Staff ID string.'
          });
        }
        redirectUrl = '/dashboards/watchman.html';
        break;

      default:
        return res.status(403).json({ status: 'ERROR', message: 'Access Denied: Invalid Corporate Personnel Node' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        role: user.user_role,
        assigned_hostel: user.assigned_hostel
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Staff Authenticated Successfully',
      token,
      redirect: redirectUrl
    });
  } catch (err) {
    console.error('Staff Login error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
  }
}

module.exports = {
  studentLogin,
  staffLogin,
  calculateStudentId,
  calculateStudentDefaultPassword,
  calculateStaffDefaultPassword
};
