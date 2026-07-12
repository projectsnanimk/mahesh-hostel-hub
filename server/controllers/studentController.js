// server/controllers/studentController.js
const bcrypt = require('bcryptjs');
const db = require('../db');
const {
  calculateStudentId,
  calculateStudentDefaultPassword
} = require('./authController');

// Get Student Profile
async function getStudentProfile(req, res) {
  try {
    // req.user contains decoded student details
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ status: 'ERROR', message: 'Forbidden: Student token required' });
    }

    const student = await db.getStudentById(req.user.id);
    if (!student) {
      return res.status(404).json({ status: 'ERROR', message: 'Student profile not found' });
    }

    // Don't return password hash
    const { password_hash, ...profile } = student;
    return res.status(200).json({ status: 'SUCCESS', data: profile });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
  }
}

// GET all students (Admin and Accountant)
async function getStudentsList(req, res) {
  try {
    const list = await db.getStudents();
    const sanitised = list.map(student => {
      const { password_hash, ...rest } = student;
      return rest;
    });
    return res.status(200).json({ status: 'SUCCESS', data: sanitised });
  } catch (err) {
    console.error('List students error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
  }
}

// POST Create Student (Data entry allowed for both ADMIN and ACCOUNTANT)
async function createStudent(req, res) {
  try {
    const { full_name, hostel_id, room_number, fee_balance, dob } = req.body;

    if (!full_name || !hostel_id || !room_number || fee_balance === undefined || !dob) {
      return res.status(400).json({ status: 'ERROR', message: 'All student data fields are required (full_name, hostel_id, room_number, fee_balance, dob)' });
    }

    // Validate Hostel
    const hostels = await db.getHostels();
    const hostelExists = hostels.some(h => h.hostel_id.toUpperCase() === hostel_id.toUpperCase());
    if (!hostelExists) {
      return res.status(400).json({ status: 'ERROR', message: `Hostel Block ${hostel_id} does not exist.` });
    }

    // 1. Generate Smart Student User ID
    const todayStr = new Date().toISOString().split('T')[0];
    const student_id = await calculateStudentId(hostel_id.toUpperCase(), todayStr);

    // 2. Generate Smart Default Password
    const defaultPassword = calculateStudentDefaultPassword(full_name, dob);
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(defaultPassword, salt);

    const studentData = {
      student_id,
      full_name,
      password_hash,
      hostel_id: hostel_id.toUpperCase(),
      room_number,
      fee_balance,
      current_status: 'INSIDE',
      dob,
      registration_date: todayStr
    };

    const newStudent = await db.createStudent(studentData);
    
    // Return student details + raw password to show the user
    return res.status(201).json({
      status: 'SUCCESS',
      message: 'Student Registered Successfully',
      data: {
        student_id: newStudent.student_id,
        full_name: newStudent.full_name,
        hostel_id: newStudent.hostel_id,
        room_number: newStudent.room_number,
        fee_balance: newStudent.fee_balance,
        dob: newStudent.dob,
        registration_date: newStudent.registration_date,
        generated_credentials: {
          username: newStudent.student_id,
          default_password: defaultPassword
        }
      }
    });

  } catch (err) {
    console.error('Create student error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error registering student' });
  }
}

// PUT Update Student Profile (Blocked for ACCOUNTANT, allowed only for ADMIN)
async function updateStudent(req, res) {
  try {
    if (req.user.role === 'ACCOUNTANT') {
      return res.status(403).json({
        status: 'ERROR',
        message: 'RBAC Access Denied: Central Accountant is strictly blocked from executing UPDATE operations on student registries or financial records.'
      });
    }

    const { id } = req.params;
    const { full_name, room_number, fee_balance, current_status } = req.body;

    const student = await db.getStudentById(id);
    if (!student) {
      return res.status(404).json({ status: 'ERROR', message: `Student '${id}' not found.` });
    }

    // Apply updates
    if (fee_balance !== undefined) {
      await db.updateStudentFeeBalance(id, fee_balance);
    }
    if (current_status !== undefined) {
      await db.updateStudentStatus(id, current_status);
    }

    // Let's retrieve updated student
    const updated = await db.getStudentById(id);
    const { password_hash, ...sanitised } = updated;

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Student Record Updated Successfully',
      data: sanitised
    });
  } catch (err) {
    console.error('Update student error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error updating student' });
  }
}

// DELETE Student Profile (Blocked for ACCOUNTANT, allowed only for ADMIN)
async function deleteStudent(req, res) {
  try {
    if (req.user.role === 'ACCOUNTANT') {
      return res.status(403).json({
        status: 'ERROR',
        message: 'RBAC Access Denied: Central Accountant is strictly blocked from executing DELETE operations on student registries or financial records.'
      });
    }

    const { id } = req.params;
    const deleted = await db.deleteStudent(id);

    if (!deleted) {
      return res.status(404).json({ status: 'ERROR', message: `Student '${id}' not found.` });
    }

    return res.status(200).json({
      status: 'SUCCESS',
      message: `Student record '${id}' successfully purged from registry.`
    });
  } catch (err) {
    console.error('Delete student error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
  }
}

// GET all gate logs (Admin and Watchmen)
async function getGateLogsList(req, res) {
  try {
    const logs = await db.getGateLogs();
    
    // Filter logs if Watchman is scoped to a hostel
    const filtered = req.user.assigned_hostel 
      ? logs.filter(log => log.hostel_id === req.user.assigned_hostel)
      : logs;

    return res.status(200).json({ status: 'SUCCESS', data: filtered });
  } catch (err) {
    console.error('List gate logs error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
  }
}

// POST watchman logs student entry/exit
async function logGateEvent(req, res) {
  try {
    const { student_id, action_type } = req.body;
    const watchmanId = req.user.id;
    const watchmanHostel = req.user.assigned_hostel;

    if (!student_id || !action_type) {
      return res.status(400).json({ status: 'ERROR', message: 'Student ID and Action Type (IN/OUT) are required.' });
    }

    if (action_type !== 'IN' && action_type !== 'OUT') {
      return res.status(400).json({ status: 'ERROR', message: "Action Type must be either 'IN' or 'OUT'." });
    }

    // Fetch Student
    const student = await db.getStudentById(student_id);
    if (!student) {
      return res.status(404).json({ status: 'ERROR', message: `Student '${student_id}' does not exist.` });
    }

    // Enforce Hardware Block Lock: Watchman can only log for their assigned hostel
    if (watchmanHostel && student.hostel_id.toUpperCase() !== watchmanHostel.toUpperCase()) {
      return res.status(403).json({
        status: 'ERROR',
        message: `Security Scope Violation: Watchman is locked to Block ${watchmanHostel} gate. Cannot log entry/exit for Student from Block ${student.hostel_id}.`
      });
    }

    // Log the transaction and update student current_status
    const log = await db.addGateLog(student.student_id, student.hostel_id, action_type, watchmanId);

    return res.status(201).json({
      status: 'SUCCESS',
      message: `Watchman logged check-${action_type.toLowerCase()} for student ${student.full_name}.`,
      data: {
        log_id: log.log_id,
        student_id: log.student_id,
        student_name: student.full_name,
        hostel_id: log.hostel_id,
        action_type: log.action_type,
        logged_at: log.logged_at
      }
    });

  } catch (err) {
    console.error('Log gate event error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error logging gate event' });
  }
}

module.exports = {
  getStudentProfile,
  getStudentsList,
  createStudent,
  updateStudent,
  deleteStudent,
  logGateEvent,
  getGateLogsList
};
