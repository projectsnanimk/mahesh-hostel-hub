// public/js/db-helper.js

// ----------------------------------------------------
// DATABASE SEED DATA
// ----------------------------------------------------
const DEFAULT_HOSTELS = [
  { hostel_id: 'M1', hostel_name: 'M1 Residential Block', total_rooms: 120 },
  { hostel_id: 'M2', hostel_name: 'M2 Residential Block', total_rooms: 120 },
  { hostel_id: 'M3', hostel_name: 'M3 Residential Block', total_rooms: 120 }
];

const DEFAULT_ASSETS = [
  { asset_id: 1, ingredient_name: 'Rice', stock_quantity_kg: 500.00, alert_threshold_kg: 100.00 },
  { asset_id: 2, ingredient_name: 'Wheat Flour', stock_quantity_kg: 400.00, alert_threshold_kg: 80.00 },
  { asset_id: 3, ingredient_name: 'Dal (Lentils)', stock_quantity_kg: 250.00, alert_threshold_kg: 50.00 },
  { asset_id: 4, ingredient_name: 'Cooking Oil', stock_quantity_kg: 150.00, alert_threshold_kg: 30.00 },
  { asset_id: 5, ingredient_name: 'Vegetables (Mixed)', stock_quantity_kg: 100.00, alert_threshold_kg: 40.00 },
  { asset_id: 6, ingredient_name: 'Milk', stock_quantity_kg: 120.00, alert_threshold_kg: 25.00 },
  { asset_id: 7, ingredient_name: 'Sugar', stock_quantity_kg: 80.00, alert_threshold_kg: 20.00 },
  { asset_id: 8, ingredient_name: 'Salt', stock_quantity_kg: 50.00, alert_threshold_kg: 10.00 }
];

const DEFAULT_STAFF = [
  { user_id: 'GLADM001', username: 'admin', email: 'admin@hostelhub.com', password: 'ADMGLO2026', user_role: 'ADMIN', assigned_hostel: null, monthly_salary: 150000.00 },
  { user_id: 'GLACT001', username: 'suresh_acct', email: 'suresh@hostelhub.com', password: 'ACTSUR2026', user_role: 'ACCOUNTANT', assigned_hostel: null, monthly_salary: 60000.00 },
  { user_id: 'M1WDN001', username: 'm1warden', email: 'm1warden@hostelhub.com', password: 'WDNM1W2026', user_role: 'WARDEN', assigned_hostel: 'M1', monthly_salary: 45000.00 },
  { user_id: 'M2WDN001', username: 'm2warden', email: 'm2warden@hostelhub.com', password: 'WDNM2W2026', user_role: 'WARDEN', assigned_hostel: 'M2', monthly_salary: 45000.00 },
  { user_id: 'M3WDN001', username: 'm3warden', email: 'm3warden@hostelhub.com', password: 'WDNM3W2026', user_role: 'WARDEN', assigned_hostel: 'M3', monthly_salary: 45000.00 },
  { user_id: 'M1WCH001', username: 'm1watchman', email: 'm1watchman@hostelhub.com', password: 'WCHM1W2026', user_role: 'WATCHMAN', assigned_hostel: 'M1', monthly_salary: 25000.00 },
  { user_id: 'M2WCH001', username: 'm2watchman', email: 'm2watchman@hostelhub.com', password: 'WCHM2W2026', user_role: 'WATCHMAN', assigned_hostel: 'M2', monthly_salary: 25000.00 },
  { user_id: 'M3WCH001', username: 'm3watchman', email: 'm3watchman@hostelhub.com', password: 'WCHM3W2026', user_role: 'WATCHMAN', assigned_hostel: 'M3', monthly_salary: 25000.00 }
];

const DEFAULT_STUDENTS = [
  { student_id: 'M1120726001', full_name: 'MOHAN KRISHNA', password: 'MOH@27052004', hostel_id: 'M1', room_number: '101A', fee_balance: 4500.00, current_status: 'INSIDE', dob: '2004-05-27', registration_date: '2026-07-12' },
  { student_id: 'M2120726001', full_name: 'RAHUL SHARMA', password: 'RAH@15092005', hostel_id: 'M2', room_number: '204B', fee_balance: 0.00, current_status: 'INSIDE', dob: '2005-09-15', registration_date: '2026-07-12' },
  { student_id: 'M3120726001', full_name: 'AN SHARMA', password: 'ANX@01122004', hostel_id: 'M3', room_number: '302C', fee_balance: 12000.00, current_status: 'OUTSIDE', dob: '2004-12-01', registration_date: '2026-07-12' }
];

// Initialize localStorage DB if empty
function initStorageDb() {
  if (!localStorage.getItem('hostelhub_db')) {
    const db = {
      hostels: DEFAULT_HOSTELS,
      central_kitchen_assets: DEFAULT_ASSETS,
      staff_users: DEFAULT_STAFF,
      students: DEFAULT_STUDENTS,
      mess_attendance_logs: [],
      gate_logs: []
    };
    localStorage.setItem('hostelhub_db', JSON.stringify(db));
  }
}

// Load DB from Storage
function getDb() {
  initStorageDb();
  return JSON.parse(localStorage.getItem('hostelhub_db'));
}

// Save DB to Storage
function saveDb(db) {
  localStorage.setItem('hostelhub_db', JSON.stringify(db));
}

// Helper to determine the current meal window based on local time
function getSystemMealWindow(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 6 && hour < 10) return 'MORNING';
  if (hour >= 12 && hour < 15) return 'AFTERNOON';
  if (hour >= 18 && hour < 21) return 'EVENING';
  return null;
}

// ----------------------------------------------------
// ALGORITHMIC HELPERS
// ----------------------------------------------------
function cleanNameForPassword(name) {
  const cleaned = name.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length >= 3) return cleaned.substring(0, 3);
  return cleaned.padEnd(3, 'X');
}

// Formula A: Generate Student User ID
function generateStudentId(blockId, regDateStr) {
  const dbState = getDb();
  const regDate = new Date(regDateStr);
  const day = String(regDate.getDate()).padStart(2, '0');
  const month = String(regDate.getMonth() + 1).padStart(2, '0');
  const year = String(regDate.getFullYear()).substring(2);

  // Count existing students registered on the same date in this block
  const dateOnlyStr = regDate.toISOString().split('T')[0];
  const count = dbState.students.filter(s => 
    s.hostel_id === blockId && 
    new Date(s.registration_date).toISOString().split('T')[0] === dateOnlyStr
  ).length;

  const nextSerialNum = String(count + 1).padStart(3, '0');
  return `${blockId}${day}${month}${year}${nextSerialNum}`;
}

// Formula B: Generate Student Default Password
function generateStudentDefaultPassword(fullName, dobStr) {
  const namePart = cleanNameForPassword(fullName);
  const dob = new Date(dobStr);
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = String(dob.getFullYear());
  return `${namePart}@${day}${month}${year}`;
}

// ----------------------------------------------------
// DB CORE API METHODS
// ----------------------------------------------------
const db = {
  // Authentication checking
  authenticateStudent: (studentId, password) => {
    const dbState = getDb();
    const student = dbState.students.find(s => s.student_id.toUpperCase() === studentId.toUpperCase());
    if (student && student.password === password) {
      return student;
    }
    return null;
  },

  authenticateStaff: (identifier, password) => {
    const dbState = getDb();
    let staff = null;
    
    // Check if logging in via Staff ID or Email/Username
    if (identifier.toUpperCase().startsWith('GL') || identifier.toUpperCase().startsWith('M1') || identifier.toUpperCase().startsWith('M2') || identifier.toUpperCase().startsWith('M3')) {
      staff = dbState.staff_users.find(u => u.user_id.toUpperCase() === identifier.toUpperCase());
    } else {
      staff = dbState.staff_users.find(u => 
        u.username.toLowerCase() === identifier.toLowerCase() || 
        u.email.toLowerCase() === identifier.toLowerCase()
      );
    }

    if (staff && staff.password === password) {
      return staff;
    }
    return null;
  },

  // Student Profile details
  getStudentById: (studentId) => {
    const dbState = getDb();
    return dbState.students.find(s => s.student_id.toUpperCase() === studentId.toUpperCase()) || null;
  },

  getStudents: () => {
    return getDb().students;
  },

  createStudent: (fullName, hostelId, roomNumber, feeBalance, dob) => {
    const dbState = getDb();
    const todayStr = new Date().toISOString().split('T')[0];
    
    const student_id = generateStudentId(hostelId, todayStr);
    const defaultPassword = generateStudentDefaultPassword(fullName, dob);

    const newStudent = {
      student_id,
      full_name: fullName,
      password: defaultPassword,
      hostel_id: hostelId,
      room_number: roomNumber,
      fee_balance: parseFloat(feeBalance),
      current_status: 'INSIDE',
      dob,
      registration_date: todayStr
    };

    dbState.students.push(newStudent);
    saveDb(dbState);
    return newStudent;
  },

  updateStudent: (studentId, roomNumber, feeBalance, currentStatus) => {
    const dbState = getDb();
    const student = dbState.students.find(s => s.student_id === studentId);
    if (student) {
      if (roomNumber !== undefined) student.room_number = roomNumber;
      if (feeBalance !== undefined) student.fee_balance = parseFloat(feeBalance);
      if (currentStatus !== undefined) student.current_status = currentStatus;
      saveDb(dbState);
      return student;
    }
    return null;
  },

  deleteStudent: (studentId) => {
    const dbState = getDb();
    const index = dbState.students.findIndex(s => s.student_id === studentId);
    if (index !== -1) {
      dbState.students.splice(index, 1);
      saveDb(dbState);
      return true;
    }
    return false;
  },

  // Scan module operations
  scanQr: (qrToken, wardenHostel) => {
    const dbState = getDb();
    
    // Parse QR string
    let qrData;
    try {
      qrData = JSON.parse(qrToken);
    } catch(e) {
      return { status: 'DENIED', ui_color: 'RED', message: 'Scan Rejected: Unreadable QR code payload.' };
    }

    const { student_id, meal_window, timestamp } = qrData;
    const student = dbState.students.find(s => s.student_id === student_id);

    if (!student) {
      return { status: 'DENIED', ui_color: 'RED', message: `Fraud Alert: Student '${student_id}' does not exist.` };
    }

    // Warden Block lock validation
    if (wardenHostel && student.hostel_id.toUpperCase() !== wardenHostel.toUpperCase()) {
      return { 
        status: 'DENIED', 
        ui_color: 'RED', 
        message: `Security Violation: Warden is locked to Block ${wardenHostel}. Cannot scan Student from Block ${student.hostel_id}.`
      };
    }

    // Check QR expiration (30 seconds)
    const drift = Math.abs(Date.now() - timestamp);
    if (drift > 30000) {
      return { status: 'DENIED', ui_color: 'RED', message: 'Verification Failure: QR Code has expired. Auto-refreshes every 30 seconds.' };
    }

    // Verify meal window matches live schedule
    const activeWindow = getSystemMealWindow();
    if (!activeWindow) {
      return { status: 'DENIED', ui_color: 'RED', message: 'Scan Denied: Central Kitchen is closed. No active meal window.' };
    }

    if (meal_window.toUpperCase() !== activeWindow) {
      return { 
        status: 'DENIED', 
        ui_color: 'RED', 
        message: `Fraud Alert: QR slot '${meal_window}' does not match live window '${activeWindow}'.`
      };
    }

    // Check for duplicates today
    const todayStr = new Date().toDateString();
    const hasAlreadyScanned = dbState.mess_attendance_logs.find(log => 
      log.student_id === student_id && 
      log.meal_window === activeWindow && 
      new Date(log.scanned_at).toDateString() === todayStr
    );

    if (hasAlreadyScanned) {
      const timeStr = new Date(hasAlreadyScanned.scanned_at).toLocaleTimeString();
      return { 
        status: 'DENIED', 
        ui_color: 'RED', 
        message: `Fraud Alert! Already scanned for this meal at ${timeStr}.` 
      };
    }

    // Record verified portion
    const newLog = {
      log_id: dbState.mess_attendance_logs.length + 1,
      student_id,
      hostel_id: student.hostel_id,
      meal_window: activeWindow,
      scanned_at: new Date().toISOString()
    };

    dbState.mess_attendance_logs.push(newLog);
    saveDb(dbState);

    return { 
      status: 'SUCCESS', 
      ui_color: 'GREEN', 
      message: `Scan Verified! Portion allocated for student ${student.full_name} (${student_id}).`,
      timestamp: newLog.scanned_at
    };
  },

  // Central Kitchen Metrics Aggregator
  getKitchenMetrics: () => {
    const dbState = getDb();
    const todayStr = new Date().toDateString();
    const activeWindow = getSystemMealWindow() || 'AFTERNOON';

    // Compute headcount served
    const headcount = { M1: 0, M2: 0, M3: 0, total: 0 };
    dbState.mess_attendance_logs.forEach(log => {
      if (log.meal_window === activeWindow && new Date(log.scanned_at).toDateString() === todayStr) {
        if (headcount[log.hostel_id] !== undefined) {
          headcount[log.hostel_id]++;
          headcount.total++;
        }
      }
    });

    // Check inventory stock warning buffers
    const assetsWithAlerts = dbState.central_kitchen_assets.map(asset => {
      const stock = parseFloat(asset.stock_quantity_kg);
      const threshold = parseFloat(asset.alert_threshold_kg);
      return {
        ...asset,
        stock_quantity_kg: stock,
        alert_threshold_kg: threshold,
        low_stock_alert: stock < threshold
      };
    });

    return {
      active_meal_window: activeWindow,
      date: new Date().toISOString().split('T')[0],
      headcount,
      inventory: assetsWithAlerts
    };
  },

  updateKitchenStock: (ingredientName, quantityKg) => {
    const dbState = getDb();
    const asset = dbState.central_kitchen_assets.find(a => a.ingredient_name.toLowerCase() === ingredientName.toLowerCase());
    if (asset) {
      asset.stock_quantity_kg = parseFloat(quantityKg);
      saveDb(dbState);
      return asset;
    }
    return null;
  },

  // Watchman operations
  addGateLog: (studentId, actionType, watchmanId, watchmanHostel) => {
    const dbState = getDb();
    const student = dbState.students.find(s => s.student_id === studentId);
    
    if (!student) {
      return { status: 'ERROR', message: `Student '${studentId}' does not exist.` };
    }

    // Scope lock check
    if (watchmanHostel && student.hostel_id.toUpperCase() !== watchmanHostel.toUpperCase()) {
      return { 
        status: 'ERROR', 
        message: `Security Scope Violation: Watchman is locked to Block ${watchmanHostel} gate. Cannot log entries for Block ${student.hostel_id}.`
      };
    }

    const logEntry = {
      log_id: dbState.gate_logs.length + 1,
      student_id: student.student_id,
      student_name: student.full_name,
      hostel_id: student.hostel_id,
      action_type: actionType,
      watchman_id: watchmanId,
      logged_at: new Date().toISOString()
    };

    dbState.gate_logs.push(logEntry);
    
    // Update student state status
    student.current_status = actionType === 'IN' ? 'INSIDE' : 'OUTSIDE';
    
    saveDb(dbState);
    return { status: 'SUCCESS', data: logEntry };
  },

  getGateLogs: (watchmanHostel) => {
    const dbState = getDb();
    let logs = [...dbState.gate_logs].sort((a,b) => new Date(b.logged_at) - new Date(a.logged_at));
    
    if (watchmanHostel) {
      logs = logs.filter(log => log.hostel_id === watchmanHostel);
    }
    return logs;
  }
};

// Bootstrap database initialization
initStorageDb();
window.HostelHubDB = db;
