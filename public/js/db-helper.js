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
  { asset_id: 1, ingredient_name: 'Rice', opening_stock: 500.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 100.00, total_capacity: 1000.00, stock_quantity_kg: 500.00, alert_threshold_kg: 100.00 },
  { asset_id: 2, ingredient_name: 'Wheat Flour', opening_stock: 400.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 80.00, total_capacity: 800.00, stock_quantity_kg: 400.00, alert_threshold_kg: 80.00 },
  { asset_id: 3, ingredient_name: 'Dal (Lentils)', opening_stock: 250.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 50.00, total_capacity: 500.00, stock_quantity_kg: 250.00, alert_threshold_kg: 50.00 },
  { asset_id: 4, ingredient_name: 'Cooking Oil', opening_stock: 150.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 30.00, total_capacity: 300.00, stock_quantity_kg: 150.00, alert_threshold_kg: 30.00 },
  { asset_id: 5, ingredient_name: 'Vegetables (Mixed)', opening_stock: 100.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 40.00, total_capacity: 250.00, stock_quantity_kg: 100.00, alert_threshold_kg: 40.00 },
  { asset_id: 6, ingredient_name: 'Milk', opening_stock: 120.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 25.00, total_capacity: 200.00, stock_quantity_kg: 120.00, alert_threshold_kg: 25.00 },
  { asset_id: 7, ingredient_name: 'Sugar', opening_stock: 80.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 20.00, total_capacity: 150.00, stock_quantity_kg: 80.00, alert_threshold_kg: 20.00 },
  { asset_id: 8, ingredient_name: 'Salt', opening_stock: 50.00, today_inward: 0.00, today_issued: 0.00, minimum_threshold: 10.00, total_capacity: 100.00, stock_quantity_kg: 50.00, alert_threshold_kg: 10.00 }
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
  { 
    student_id: 'M1120726001', 
    full_name: 'MOHAN KRISHNA', 
    password: 'MOH@27052004', 
    hostel_id: 'M1', 
    room_number: '101A', 
    fee_balance: 4500.00, 
    current_status: 'INSIDE', 
    dob: '2004-05-27', 
    registration_date: '2026-07-12',
    year: '3',
    parent_name: 'Koteswara Rao',
    blood_group: 'O+',
    aadhar_no: '123456789012',
    student_contact: '9876543210',
    parent_contact: '9876543211',
    email_id: 'mohan.krishna@gmail.com',
    stream: 'B.Tech CSE',
    total_fee: 150000.00,
    full_address: 'Flat 304, Srinivasa Towers, Ameerpet, Hyderabad, Telangana',
    pincode: '500038',
    approval_status: 'APPROVED'
  },
  { 
    student_id: 'M2120726001', 
    full_name: 'RAHUL SHARMA', 
    password: 'RAH@15092005', 
    hostel_id: 'M2', 
    room_number: '204B', 
    fee_balance: 0.00, 
    current_status: 'INSIDE', 
    dob: '2005-09-15', 
    registration_date: '2026-07-12',
    year: '2',
    parent_name: 'Ram Charan Sharma',
    blood_group: 'A+',
    aadhar_no: '987654321098',
    student_contact: '9876543220',
    parent_contact: '9876543221',
    email_id: 'rahul.sharma@gmail.com',
    stream: 'B.Tech ECE',
    total_fee: 140000.00,
    full_address: 'Plot 45, Sector 5, Dwarka, New Delhi',
    pincode: '110075',
    approval_status: 'APPROVED'
  },
  { 
    student_id: 'M3120726001', 
    full_name: 'AN SHARMA', 
    password: 'ANX@01122004', 
    hostel_id: 'M3', 
    room_number: '302C', 
    fee_balance: 12000.00, 
    current_status: 'OUTSIDE', 
    dob: '2004-12-01', 
    registration_date: '2026-07-12',
    year: '4',
    parent_name: 'Devendra Sharma',
    blood_group: 'B+',
    aadhar_no: '456789012345',
    student_contact: '9876543230',
    parent_contact: '9876543231',
    email_id: 'an.sharma@gmail.com',
    stream: 'B.Tech IT',
    total_fee: 160000.00,
    full_address: 'Flat 12B, Green Meadows, Gachibowli, Hyderabad, Telangana',
    pincode: '500032',
    approval_status: 'APPROVED'
  }
];

const DEFAULT_FEEDBACKS = [
  { feedback_id: 1, student_id: 'M1120726001', category: 'Food & Mess Quality', rating: 4, comments: 'The Sunday Biryani was delicious, but please improve the Tuesday breakfast Dosa.', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { feedback_id: 2, student_id: 'M2120726001', category: 'Internet & Wi-Fi', rating: 3, comments: 'Wi-Fi speed is slow in the evening hours between 8 PM to 10 PM.', created_at: new Date(Date.now() - 86400000).toISOString() },
  { feedback_id: 3, student_id: 'M3120726001', category: 'Room Maintenance', rating: 5, comments: 'AC maintenance was completed on time. Friendly support staff!', created_at: new Date().toISOString() }
];

// Initialize localStorage DB if empty or missing keys
function initStorageDb() {
  let db = {};
  const raw = localStorage.getItem('hostelhub_db');
  if (raw) {
    try {
      db = JSON.parse(raw);
    } catch(e) {
      db = {};
    }
  }
  
  let changed = false;
  if (!db.hostels) { db.hostels = DEFAULT_HOSTELS; changed = true; }
  if (!db.central_kitchen_assets || !Array.isArray(db.central_kitchen_assets)) { 
    db.central_kitchen_assets = DEFAULT_ASSETS; 
    changed = true; 
  } else {
    // Filter out any null/undefined entries defensively
    db.central_kitchen_assets = db.central_kitchen_assets.filter(Boolean);
    
    // Migrate existing assets to the new schema
    db.central_kitchen_assets.forEach(asset => {
      if (asset) {
        if (asset.opening_stock === undefined) {
          asset.opening_stock = parseFloat(asset.stock_quantity_kg) || 0;
          asset.today_inward = 0.00;
          asset.today_issued = 0.00;
          asset.minimum_threshold = parseFloat(asset.alert_threshold_kg) || 0;
          asset.total_capacity = parseFloat(asset.alert_threshold_kg) * 10 || 500;
          changed = true;
        }
        if (asset.today_inward === undefined) { asset.today_inward = 0.00; changed = true; }
        if (asset.today_issued === undefined) { asset.today_issued = 0.00; changed = true; }
        if (asset.opening_stock === undefined) { asset.opening_stock = parseFloat(asset.stock_quantity_kg) || 0.00; changed = true; }
        if (asset.minimum_threshold === undefined) { asset.minimum_threshold = parseFloat(asset.alert_threshold_kg) || 0.00; changed = true; }
        if (asset.total_capacity === undefined) { asset.total_capacity = parseFloat(asset.alert_threshold_kg) * 10 || 500.00; changed = true; }
      }
    });
  }
  if (!db.staff_users) { db.staff_users = DEFAULT_STAFF; changed = true; }
  if (!db.students || (db.students.length > 0 && !db.students[0].parent_name)) { db.students = DEFAULT_STUDENTS; changed = true; }
  if (!db.mess_attendance_logs) { db.mess_attendance_logs = []; changed = true; }
  if (!db.gate_logs) { db.gate_logs = []; changed = true; }
  if (!db.feedbacks) { db.feedbacks = DEFAULT_FEEDBACKS; changed = true; }
  
  if (changed || !raw) {
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
  const minute = date.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // BREAKFAST: 7:30 AM - 9:00 AM
  if (timeInMinutes >= 450 && timeInMinutes < 540) {
    return 'MORNING';
  }
  // LUNCH: 11:30 AM - 2:00 PM
  if (timeInMinutes >= 690 && timeInMinutes < 840) {
    return 'AFTERNOON';
  }
  // DINNER: 8:00 PM - 9:00 PM
  if (timeInMinutes >= 1200 && timeInMinutes < 1260) {
    return 'EVENING';
  }
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

  let dateOnlyStr = '';
  try {
    dateOnlyStr = regDate.toISOString().split('T')[0];
  } catch (e) {
    dateOnlyStr = new Date().toISOString().split('T')[0];
  }

  let count = 0;
  if (dbState && dbState.students) {
    dbState.students.forEach(s => {
      if (s.hostel_id === blockId && s.registration_date) {
        try {
          const sDate = new Date(s.registration_date);
          if (!isNaN(sDate.getTime()) && sDate.toISOString().split('T')[0] === dateOnlyStr) {
            count++;
          }
        } catch (e) {
          // ignore parsing error for invalid date in database records
        }
      }
    });
  }

  const nextSerialNum = String(count + 1).padStart(3, '0');
  return `${blockId}${day}${month}${year}${nextSerialNum}`;
}

// Formula B: Generate Student Default Password
function generateStudentDefaultPassword(fullName, dobStr) {
  const namePart = cleanNameForPassword(fullName);
  let day = '01';
  let month = '01';
  let year = '2000';
  if (dobStr) {
    try {
      const dob = new Date(dobStr);
      if (!isNaN(dob.getTime())) {
        day = String(dob.getDate()).padStart(2, '0');
        month = String(dob.getMonth() + 1).padStart(2, '0');
        year = String(dob.getFullYear());
      }
    } catch(e) {}
  }
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
      if (student.approval_status === 'PENDING') {
        throw new Error('PENDING_APPROVAL');
      }
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

  createStudent: (fullName, hostelId, roomNumber, feeBalance, dob, extraData = {}) => {
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
      registration_date: todayStr,
      approval_status: 'PENDING', // Default to pending admin approval
      ...extraData
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

  updateStudentPhoto: (studentId, photoBase64) => {
    const dbState = getDb();
    const student = dbState.students.find(s => s.student_id === studentId);
    if (student) {
      student.photo = photoBase64;
      saveDb(dbState);
      return student;
    }
    return null;
  },

  approveStudent: (studentId) => {
    const dbState = getDb();
    const student = dbState.students.find(s => s.student_id === studentId);
    if (student) {
      student.approval_status = 'APPROVED';
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

    const { student_id, meal_window, date } = qrData;
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

    // Verify QR matches the current date
    const todayStr = new Date().toISOString().split('T')[0];
    if (date !== todayStr) {
      return { status: 'DENIED', ui_color: 'RED', message: `Scan Denied: QR Code is dated '${date}' (Expired). Today is '${todayStr}'.` };
    }

    // Verify meal window matches live schedule (bypass hourly slots check if in demo/testing mode)
    const isDemo = qrData.demo_mode === true;
    const activeWindow = isDemo ? meal_window.toUpperCase() : getSystemMealWindow();
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
    const hasAlreadyScanned = dbState.mess_attendance_logs.find(log => 
      log.student_id === student_id && 
      log.meal_window === activeWindow && 
      new Date(log.scanned_at).toISOString().split('T')[0] === todayStr
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

    // Check inventory stock warning reconciliation buffers
    const assetsWithAlerts = dbState.central_kitchen_assets.filter(Boolean).map(asset => {
      const opening = parseFloat(asset.opening_stock) || 0;
      const inward = parseFloat(asset.today_inward) || 0;
      const issued = parseFloat(asset.today_issued) || 0;
      const available = opening + inward - issued;
      const threshold = parseFloat(asset.minimum_threshold) || parseFloat(asset.alert_threshold_kg) || 0;
      const capacity = parseFloat(asset.total_capacity) || (threshold * 10) || 500;
      
      const safetyPct = Math.min(Math.round((available / capacity) * 100), 100);

      let status = 'HEALTHY';
      if (available <= threshold) {
        status = 'CRITICAL';
      } else if (available <= threshold * 1.15) {
        status = 'WARNING';
      }

      return {
        ...asset,
        opening_stock: opening,
        today_inward: inward,
        today_issued: issued,
        stock_quantity_kg: available,
        alert_threshold_kg: threshold,
        minimum_threshold: threshold,
        total_capacity: capacity,
        safety_percentage: safetyPct,
        alert_status: status,
        low_stock_alert: status === 'CRITICAL'
      };
    });

    return {
      active_meal_window: activeWindow,
      date: new Date().toISOString().split('T')[0],
      headcount,
      inventory: assetsWithAlerts
    };
  },

  checkDailyRollover: (simulatedHour = null, simulatedDateStr = null) => {
    const dbState = getDb();
    const todayStr = simulatedDateStr || new Date().toLocaleDateString('en-CA');
    
    if (dbState.last_rollover_date === todayStr) {
      return false;
    }

    const hour = simulatedHour !== null ? simulatedHour : new Date().getHours();
    if (hour < 6) {
      return false;
    }

    dbState.central_kitchen_assets.filter(Boolean).forEach(asset => {
      const opening = parseFloat(asset.opening_stock) || 0;
      const inward = parseFloat(asset.today_inward) || 0;
      const issued = parseFloat(asset.today_issued) || 0;
      const available = opening + inward - issued;

      asset.opening_stock = available;
      asset.today_inward = 0.00;
      asset.today_issued = 0.00;
      asset.stock_quantity_kg = available;
    });

    dbState.last_rollover_date = todayStr;
    saveDb(dbState);
    return true;
  },

  adjustKitchenAsset: (ingredientName, inwardAdd, issuedSet) => {
    const dbState = getDb();
    const asset = dbState.central_kitchen_assets.find(a => a.ingredient_name.toLowerCase() === ingredientName.toLowerCase());
    if (asset) {
      if (inwardAdd !== undefined && inwardAdd !== null) {
        asset.today_inward = (parseFloat(asset.today_inward) || 0) + parseFloat(inwardAdd);
      }
      if (issuedSet !== undefined && issuedSet !== null) {
        asset.today_issued = parseFloat(issuedSet);
      }
      const available = (parseFloat(asset.opening_stock) || 0) + (parseFloat(asset.today_inward) || 0) - (parseFloat(asset.today_issued) || 0);
      asset.stock_quantity_kg = available;
      
      saveDb(dbState);
      return asset;
    }
    return null;
  },

  updateKitchenStock: (ingredientName, quantityKg) => {
    const dbState = getDb();
    const asset = dbState.central_kitchen_assets.find(a => a.ingredient_name.toLowerCase() === ingredientName.toLowerCase());
    if (asset) {
      asset.opening_stock = parseFloat(quantityKg);
      asset.today_inward = 0.00;
      asset.today_issued = 0.00;
      asset.stock_quantity_kg = parseFloat(quantityKg);
      saveDb(dbState);
      return asset;
    }
    return null;
  },

  addKitchenAsset: (ingredientName, quantityKg, alertThresholdKg) => {
    const dbState = getDb();
    if (!dbState.central_kitchen_assets || !Array.isArray(dbState.central_kitchen_assets)) {
      dbState.central_kitchen_assets = [];
    }
    if (!ingredientName) {
      throw new Error('INVALID_NAME');
    }
    const exists = dbState.central_kitchen_assets.some(a => 
      a && a.ingredient_name && a.ingredient_name.toLowerCase() === ingredientName.trim().toLowerCase()
    );
    if (exists) {
      throw new Error('INGREDIENT_EXISTS');
    }
    const newAsset = {
      asset_id: dbState.central_kitchen_assets.length + 1,
      ingredient_name: ingredientName.trim(),
      opening_stock: parseFloat(quantityKg) || 0.00,
      today_inward: 0.00,
      today_issued: 0.00,
      minimum_threshold: parseFloat(alertThresholdKg) || 10.00,
      total_capacity: (parseFloat(alertThresholdKg) || 10.00) * 10 || 500.00,
      stock_quantity_kg: parseFloat(quantityKg) || 0.00,
      alert_threshold_kg: parseFloat(alertThresholdKg) || 10.00
    };
    dbState.central_kitchen_assets.push(newAsset);
    saveDb(dbState);
    return newAsset;
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
  },

  submitFeedback: (studentId, category, rating, comments) => {
    const dbState = getDb();
    if (!dbState.feedbacks) dbState.feedbacks = [];
    const newFeedback = {
      feedback_id: dbState.feedbacks.length + 1,
      student_id: studentId,
      category: category,
      rating: parseInt(rating),
      comments: comments,
      created_at: new Date().toISOString()
    };
    dbState.feedbacks.push(newFeedback);
    saveDb(dbState);
    return newFeedback;
  },

  getFeedbacks: () => {
    const dbState = getDb();
    if (!dbState.feedbacks) dbState.feedbacks = [];
    return dbState.feedbacks.map(fb => {
      const student = dbState.students.find(s => s.student_id === fb.student_id);
      return {
        ...fb,
        student_name: student ? student.full_name : 'Unknown Student'
      };
    }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

// Bootstrap database initialization
initStorageDb();
window.HostelHubDB = db;
