// server/db.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let useFallback = false;
let pool = null;

// Initialize PostgreSQL Connection Pool if possible
try {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hostelhub';
  pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 2000 // 2 seconds timeout to fail fast
  });
  console.log('Connecting to PostgreSQL database...');
} catch (err) {
  console.warn('PostgreSQL configuration error. Initializing in fallback mode.', err.message);
  useFallback = true;
}

// In-Memory Database State for Fallback Mode
const dbMemory = {
  hostels: [
    { hostel_id: 'M1', hostel_name: 'M1 Residential Block', total_rooms: 120 },
    { hostel_id: 'M2', hostel_name: 'M2 Residential Block', total_rooms: 120 },
    { hostel_id: 'M3', hostel_name: 'M3 Residential Block', total_rooms: 120 }
  ],
  central_kitchen_assets: [
    { asset_id: 1, ingredient_name: 'Rice', stock_quantity_kg: 500.00, alert_threshold_kg: 100.00 },
    { asset_id: 2, ingredient_name: 'Wheat Flour', stock_quantity_kg: 400.00, alert_threshold_kg: 80.00 },
    { asset_id: 3, ingredient_name: 'Dal (Lentils)', stock_quantity_kg: 250.00, alert_threshold_kg: 50.00 },
    { asset_id: 4, ingredient_name: 'Cooking Oil', stock_quantity_kg: 150.00, alert_threshold_kg: 30.00 },
    { asset_id: 5, ingredient_name: 'Vegetables (Mixed)', stock_quantity_kg: 100.00, alert_threshold_kg: 40.00 },
    { asset_id: 6, ingredient_name: 'Milk', stock_quantity_kg: 120.00, alert_threshold_kg: 25.00 },
    { asset_id: 7, ingredient_name: 'Sugar', stock_quantity_kg: 80.00, alert_threshold_kg: 20.00 },
    { asset_id: 8, ingredient_name: 'Salt', stock_quantity_kg: 50.00, alert_threshold_kg: 10.00 }
  ],
  staff_users: [],
  students: [],
  mess_attendance_logs: [],
  gate_logs: []
};

// Seed default users in memory (passwords correspond to rules)
async function seedMemoryDb() {
  const salt = await bcrypt.genSalt(10);
  
  // Default staff accounts
  const staffSeeds = [
    {
      user_id: 'GLADM001',
      username: 'admin',
      email: 'admin@hostelhub.com',
      password: 'ADMGLO2026', // ADMIN + GLO(BAL ADMIN) + 2026
      user_role: 'ADMIN',
      assigned_hostel: null,
      monthly_salary: 150000.00
    },
    {
      user_id: 'GLACT001',
      username: 'suresh_acct',
      email: 'suresh@hostelhub.com',
      password: 'ACTSUR2026', // ACT + SUR(ESH KUMAR) + 2026
      user_role: 'ACCOUNTANT',
      assigned_hostel: null,
      monthly_salary: 60000.00
    },
    {
      user_id: 'M1WDN001',
      username: 'm1warden',
      email: 'm1warden@hostelhub.com',
      password: 'WDNM1W2026', // WDN + M1W(ARDEN) + 2026
      user_role: 'WARDEN',
      assigned_hostel: 'M1',
      monthly_salary: 45000.00
    },
    {
      user_id: 'M2WDN001',
      username: 'm2warden',
      email: 'm2warden@hostelhub.com',
      password: 'WDNM2W2026', // WDN + M2W(ARDEN) + 2026
      user_role: 'WARDEN',
      assigned_hostel: 'M2',
      monthly_salary: 45000.00
    },
    {
      user_id: 'M3WDN001',
      username: 'm3warden',
      email: 'm3warden@hostelhub.com',
      password: 'WDNM3W2026', // WDN + M3W(ARDEN) + 2026
      user_role: 'WARDEN',
      assigned_hostel: 'M3',
      monthly_salary: 45000.00
    },
    {
      user_id: 'M1WCH001',
      username: 'm1watchman',
      email: 'm1watchman@hostelhub.com',
      password: 'WCHM1W2026', // WCH + M1W(ATCHMAN) + 2026
      user_role: 'WATCHMAN',
      assigned_hostel: 'M1',
      monthly_salary: 25000.00
    },
    {
      user_id: 'M2WCH001',
      username: 'm2watchman',
      email: 'm2watchman@hostelhub.com',
      password: 'WCHM2W2026', // WCH + M2W(ATCHMAN) + 2026
      user_role: 'WATCHMAN',
      assigned_hostel: 'M2',
      monthly_salary: 25000.00
    },
    {
      user_id: 'M3WCH001',
      username: 'm3watchman',
      email: 'm3watchman@hostelhub.com',
      password: 'WCHM3W2026', // WCH + M3W(ATCHMAN) + 2026
      user_role: 'WATCHMAN',
      assigned_hostel: 'M3',
      monthly_salary: 25000.00
    }
  ];

  for (const s of staffSeeds) {
    const password_hash = await bcrypt.hash(s.password, salt);
    dbMemory.staff_users.push({
      user_id: s.user_id,
      username: s.username,
      email: s.email,
      password_hash,
      user_role: s.user_role,
      assigned_hostel: s.assigned_hostel,
      monthly_salary: s.monthly_salary,
      created_at: new Date()
    });
  }

  // Initial Students
  const studentSeeds = [
    {
      student_id: 'M1120726001',
      full_name: 'MOHAN KRISHNA',
      password: 'MOH@27052004',
      hostel_id: 'M1',
      room_number: '101A',
      fee_balance: 4500.00,
      current_status: 'INSIDE',
      dob: '2004-05-27',
      registration_date: '2026-07-12'
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
      registration_date: '2026-07-12'
    },
    {
      student_id: 'M3120726001',
      full_name: 'AN SHARMA', // Short name edge case: AN becomes ANX -> ANX@01122004
      password: 'ANX@01122004',
      hostel_id: 'M3',
      room_number: '302C',
      fee_balance: 12000.00,
      current_status: 'OUTSIDE',
      dob: '2004-12-01',
      registration_date: '2026-07-12'
    }
  ];

  for (const s of studentSeeds) {
    const password_hash = await bcrypt.hash(s.password, salt);
    dbMemory.students.push({
      student_id: s.student_id,
      full_name: s.full_name,
      password_hash,
      hostel_id: s.hostel_id,
      room_number: s.room_number,
      fee_balance: s.fee_balance,
      current_status: s.current_status,
      dob: new Date(s.dob),
      registration_date: new Date(s.registration_date),
      created_at: new Date()
    });
  }

  console.log('In-memory database seeded successfully with default accounts.');
}

// Check database connection and verify postgres compatibility
const initDb = async () => {
  if (useFallback) {
    await seedMemoryDb();
    return;
  }
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PostgreSQL database connected successfully. Host Time:', res.rows[0].now);
  } catch (err) {
    console.warn('PostgreSQL database offline. Falling back to dynamic In-Memory DB Mode.');
    useFallback = true;
    await seedMemoryDb();
  }
};

// Repository API
const db = {
  initDb,
  isFallback: () => useFallback,

  // HOSTELS
  getHostels: async () => {
    if (useFallback) return dbMemory.hostels;
    const res = await pool.query('SELECT * FROM hostels');
    return res.rows;
  },

  // CENTRAL KITCHEN ASSETS
  getKitchenAssets: async () => {
    if (useFallback) return dbMemory.central_kitchen_assets;
    const res = await pool.query('SELECT * FROM central_kitchen_assets ORDER BY ingredient_name');
    return res.rows;
  },

  updateKitchenAssetStock: async (ingredientName, quantityKg) => {
    if (useFallback) {
      const asset = dbMemory.central_kitchen_assets.find(a => a.ingredient_name.toLowerCase() === ingredientName.toLowerCase());
      if (asset) {
        asset.stock_quantity_kg = parseFloat(quantityKg);
        return asset;
      }
      return null;
    }
    const res = await pool.query(
      'UPDATE central_kitchen_assets SET stock_quantity_kg = $2, last_updated = CURRENT_TIMESTAMP WHERE ingredient_name = $1 RETURNING *',
      [ingredientName, quantityKg]
    );
    return res.rows[0];
  },

  // STAFF USERS
  getStaffUserById: async (userId) => {
    if (useFallback) {
      return dbMemory.staff_users.find(u => u.user_id.toUpperCase() === userId.toUpperCase()) || null;
    }
    const res = await pool.query('SELECT * FROM staff_users WHERE user_id = $1', [userId]);
    return res.rows[0] || null;
  },

  getStaffUserByUsernameOrEmail: async (identifier) => {
    if (useFallback) {
      return dbMemory.staff_users.find(u => 
        u.username.toLowerCase() === identifier.toLowerCase() || 
        u.email.toLowerCase() === identifier.toLowerCase()
      ) || null;
    }
    const res = await pool.query('SELECT * FROM staff_users WHERE username = $1 OR email = $1', [identifier]);
    return res.rows[0] || null;
  },

  getAllStaff: async () => {
    if (useFallback) return dbMemory.staff_users;
    const res = await pool.query('SELECT * FROM staff_users ORDER BY user_id');
    return res.rows;
  },

  createStaff: async (staffData) => {
    const { user_id, username, email, password_hash, user_role, assigned_hostel, monthly_salary } = staffData;
    if (useFallback) {
      const existing = dbMemory.staff_users.find(u => u.user_id === user_id || u.username === username || u.email === email);
      if (existing) throw new Error('Staff ID, username or email already exists.');
      const newStaff = {
        user_id, username, email, password_hash, user_role, assigned_hostel, monthly_salary, created_at: new Date()
      };
      dbMemory.staff_users.push(newStaff);
      return newStaff;
    }
    const res = await pool.query(
      `INSERT INTO staff_users (user_id, username, email, password_hash, user_role, assigned_hostel, monthly_salary) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, username, email, password_hash, user_role, assigned_hostel, monthly_salary]
    );
    return res.rows[0];
  },

  updateStaff: async (userId, staffData) => {
    const { username, email, user_role, assigned_hostel, monthly_salary } = staffData;
    if (useFallback) {
      const idx = dbMemory.staff_users.findIndex(u => u.user_id === userId);
      if (idx === -1) return null;
      dbMemory.staff_users[idx] = {
        ...dbMemory.staff_users[idx],
        username, email, user_role, assigned_hostel, monthly_salary
      };
      return dbMemory.staff_users[idx];
    }
    const res = await pool.query(
      `UPDATE staff_users 
       SET username = $2, email = $3, user_role = $4, assigned_hostel = $5, monthly_salary = $6 
       WHERE user_id = $1 RETURNING *`,
      [userId, username, email, user_role, assigned_hostel, monthly_salary]
    );
    return res.rows[0];
  },

  deleteStaff: async (userId) => {
    if (useFallback) {
      const idx = dbMemory.staff_users.findIndex(u => u.user_id === userId);
      if (idx === -1) return false;
      dbMemory.staff_users.splice(idx, 1);
      return true;
    }
    const res = await pool.query('DELETE FROM staff_users WHERE user_id = $1', [userId]);
    return res.rowCount > 0;
  },

  // STUDENTS
  getStudentById: async (studentId) => {
    if (useFallback) {
      return dbMemory.students.find(s => s.student_id.toUpperCase() === studentId.toUpperCase()) || null;
    }
    const res = await pool.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
    return res.rows[0] || null;
  },

  getStudents: async () => {
    if (useFallback) return dbMemory.students;
    const res = await pool.query('SELECT * FROM students ORDER BY student_id');
    return res.rows;
  },

  createStudent: async (studentData) => {
    const { student_id, full_name, password_hash, hostel_id, room_number, fee_balance, current_status, dob, registration_date } = studentData;
    if (useFallback) {
      const existing = dbMemory.students.find(s => s.student_id === student_id);
      if (existing) throw new Error('Student ID already exists.');
      const newStudent = {
        student_id,
        full_name,
        password_hash,
        hostel_id,
        room_number,
        fee_balance: parseFloat(fee_balance),
        current_status: current_status || 'INSIDE',
        dob: new Date(dob),
        registration_date: new Date(registration_date),
        created_at: new Date()
      };
      dbMemory.students.push(newStudent);
      return newStudent;
    }
    const res = await pool.query(
      `INSERT INTO students (student_id, full_name, password_hash, hostel_id, room_number, fee_balance, current_status, dob, registration_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [student_id, full_name, password_hash, hostel_id, room_number, fee_balance, current_status || 'INSIDE', dob, registration_date]
    );
    return res.rows[0];
  },

  updateStudentStatus: async (studentId, status) => {
    if (useFallback) {
      const student = dbMemory.students.find(s => s.student_id === studentId);
      if (student) {
        student.current_status = status;
        return student;
      }
      return null;
    }
    const res = await pool.query(
      'UPDATE students SET current_status = $2 WHERE student_id = $1 RETURNING *',
      [studentId, status]
    );
    return res.rows[0];
  },

  updateStudentFeeBalance: async (studentId, feeBalance) => {
    if (useFallback) {
      const student = dbMemory.students.find(s => s.student_id === studentId);
      if (student) {
        student.fee_balance = parseFloat(feeBalance);
        return student;
      }
      return null;
    }
    const res = await pool.query(
      'UPDATE students SET fee_balance = $2 WHERE student_id = $1 RETURNING *',
      [studentId, feeBalance]
    );
    return res.rows[0];
  },

  deleteStudent: async (studentId) => {
    if (useFallback) {
      const idx = dbMemory.students.findIndex(s => s.student_id === studentId);
      if (idx === -1) return false;
      dbMemory.students.splice(idx, 1);
      return true;
    }
    const res = await pool.query('DELETE FROM students WHERE student_id = $1', [studentId]);
    return res.rowCount > 0;
  },

  getStudentsCountForDateAndHostel: async (hostelId, dateStr) => {
    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23,59,59,999);
    
    if (useFallback) {
      return dbMemory.students.filter(s => 
        s.hostel_id === hostelId && 
        s.registration_date >= startOfDay && 
        s.registration_date <= endOfDay
      ).length;
    }
    const res = await pool.query(
      'SELECT COUNT(*) FROM students WHERE hostel_id = $1 AND registration_date = $2',
      [hostelId, dateStr]
    );
    return parseInt(res.rows[0].count);
  },

  // MESS LOGS & SCANS
  checkDuplicateMessScan: async (studentId, mealWindow, dateStr) => {
    if (useFallback) {
      const checkDate = new Date(dateStr).toDateString();
      return dbMemory.mess_attendance_logs.find(log => 
        log.student_id === studentId && 
        log.meal_window === mealWindow && 
        new Date(log.scanned_at).toDateString() === checkDate
      ) || null;
    }
    const res = await pool.query(
      'SELECT * FROM mess_attendance_logs WHERE student_id = $1 AND meal_window = $2 AND CAST(scanned_at AS DATE) = $3',
      [studentId, mealWindow, dateStr]
    );
    return res.rows[0] || null;
  },

  addMessLog: async (studentId, hostelId, mealWindow, scannedAt) => {
    const timestamp = scannedAt ? new Date(scannedAt) : new Date();
    if (useFallback) {
      const checkDate = timestamp.toDateString();
      const duplicate = dbMemory.mess_attendance_logs.find(log => 
        log.student_id === studentId && 
        log.meal_window === mealWindow && 
        new Date(log.scanned_at).toDateString() === checkDate
      );
      if (duplicate) {
        const err = new Error('duplicate key value violates unique constraint');
        err.code = '23505'; // PostgreSQL unique constraint violation error code
        throw err;
      }
      const log = {
        log_id: dbMemory.mess_attendance_logs.length + 1,
        student_id,
        hostel_id,
        meal_window,
        scanned_at: timestamp
      };
      dbMemory.mess_attendance_logs.push(log);
      return log;
    }
    const res = await pool.query(
      'INSERT INTO mess_attendance_logs (student_id, hostel_id, meal_window, scanned_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [studentId, hostelId, mealWindow, timestamp]
    );
    return res.rows[0];
  },

  getLiveMessHeadcount: async (mealWindow, dateStr) => {
    if (useFallback) {
      const checkDate = new Date(dateStr).toDateString();
      const counts = { M1: 0, M2: 0, M3: 0 };
      dbMemory.mess_attendance_logs.forEach(log => {
        if (log.meal_window === mealWindow && new Date(log.scanned_at).toDateString() === checkDate) {
          if (counts[log.hostel_id] !== undefined) {
            counts[log.hostel_id]++;
          }
        }
      });
      return Object.keys(counts).map(key => ({ hostel_id: key, portion_count: counts[key] }));
    }
    const res = await pool.query(
      `SELECT hostel_id, COUNT(*) as portion_count 
       FROM mess_attendance_logs 
       WHERE meal_window = $1 AND CAST(scanned_at AS DATE) = $2 
       GROUP BY hostel_id`,
      [mealWindow, dateStr]
    );
    return res.rows;
  },

  getRecentMessLogs: async (limit = 10) => {
    if (useFallback) {
      return [...dbMemory.mess_attendance_logs]
        .sort((a,b) => b.scanned_at - a.scanned_at)
        .slice(0, limit)
        .map(log => {
          const student = dbMemory.students.find(s => s.student_id === log.student_id);
          return {
            ...log,
            student_name: student ? student.full_name : 'Unknown Student'
          };
        });
    }
    const res = await pool.query(
      `SELECT m.*, s.full_name as student_name 
       FROM mess_attendance_logs m 
       JOIN students s ON m.student_id = s.student_id 
       ORDER BY m.scanned_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  },

  // GATE LOGS
  addGateLog: async (studentId, hostelId, actionType, watchmanId) => {
    if (useFallback) {
      const log = {
        log_id: dbMemory.gate_logs.length + 1,
        student_id,
        hostel_id,
        action_type,
        watchman_id,
        logged_at: new Date()
      };
      dbMemory.gate_logs.push(log);
      
      // Update student current status
      const student = dbMemory.students.find(s => s.student_id === studentId);
      if (student) {
        student.current_status = actionType === 'IN' ? 'INSIDE' : 'OUTSIDE';
      }
      
      return log;
    }
    
    // Use transaction for PostgreSQL to ensure student status and gate log are synced
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query(
        'INSERT INTO gate_logs (student_id, hostel_id, action_type, watchman_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [studentId, hostelId, actionType, watchmanId]
      );
      
      const newStatus = actionType === 'IN' ? 'INSIDE' : 'OUTSIDE';
      await client.query(
        'UPDATE students SET current_status = $2 WHERE student_id = $1',
        [studentId, newStatus]
      );
      
      await client.query('COMMIT');
      return res.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  getGateLogs: async (limit = 50) => {
    if (useFallback) {
      return [...dbMemory.gate_logs]
        .sort((a,b) => b.logged_at - a.logged_at)
        .slice(0, limit)
        .map(log => {
          const student = dbMemory.students.find(s => s.student_id === log.student_id);
          return {
            ...log,
            student_name: student ? student.full_name : 'Unknown Student'
          };
        });
    }
    const res = await pool.query(
      `SELECT g.*, s.full_name as student_name 
       FROM gate_logs g 
       JOIN students s ON g.student_id = s.student_id 
       ORDER BY g.logged_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  }
};

module.exports = db;
