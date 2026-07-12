-- HostelHub PostgreSQL DDL Schema

-- 1. Hostels Table
CREATE TABLE IF NOT EXISTS hostels (
    hostel_id VARCHAR(5) PRIMARY KEY,
    hostel_name VARCHAR(100) NOT NULL,
    total_rooms INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Central Kitchen Assets Table
CREATE TABLE IF NOT EXISTS central_kitchen_assets (
    asset_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(100) UNIQUE NOT NULL,
    stock_quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    alert_threshold_kg NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Staff Users Table
CREATE TABLE IF NOT EXISTS staff_users (
    user_id VARCHAR(10) PRIMARY KEY, -- e.g., GLADM001, GLACT001, M1WDN001, M1WCH001
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('ADMIN', 'ACCOUNTANT', 'WARDEN', 'WATCHMAN')),
    assigned_hostel VARCHAR(5) REFERENCES hostels(hostel_id) ON DELETE SET NULL,
    monthly_salary NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(15) PRIMARY KEY, -- ID algorithm: [BlockID][RegistrationDay][RegistrationMonth][RegistrationYear][3-DigitDailyAscendingSerialNumber]
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hostel_id VARCHAR(5) REFERENCES hostels(hostel_id) ON DELETE RESTRICT,
    room_number VARCHAR(10) NOT NULL,
    fee_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    current_status VARCHAR(15) NOT NULL DEFAULT 'INSIDE' CHECK (current_status IN ('INSIDE', 'OUTSIDE', 'ON_LEAVE')),
    dob DATE NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Mess Attendance Logs Table (Centralized Mess Tracker)
CREATE TABLE IF NOT EXISTS mess_attendance_logs (
    log_id SERIAL PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    hostel_id VARCHAR(5) NOT NULL REFERENCES hostels(hostel_id) ON DELETE RESTRICT,
    meal_window VARCHAR(15) NOT NULL CHECK (meal_window IN ('MORNING', 'AFTERNOON', 'EVENING')),
    scanned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for preventing duplicate scans: One-Meal, One-Scan restriction per student per day
CREATE UNIQUE INDEX IF NOT EXISTS unique_student_meal_date 
ON mess_attendance_logs (student_id, meal_window, (CAST(scanned_at AS DATE)));

-- Index for scanning logs sorting & lookup
CREATE INDEX IF NOT EXISTS idx_mess_scanned_at ON mess_attendance_logs(scanned_at);

-- 6. Gate Check-In/Check-Out Logs Table
CREATE TABLE IF NOT EXISTS gate_logs (
    log_id SERIAL PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    hostel_id VARCHAR(5) NOT NULL REFERENCES hostels(hostel_id) ON DELETE RESTRICT,
    action_type VARCHAR(10) NOT NULL CHECK (action_type IN ('IN', 'OUT')),
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    watchman_id VARCHAR(10) NOT NULL REFERENCES staff_users(user_id) ON DELETE RESTRICT
);

-- Index for gate logs tracking
CREATE INDEX IF NOT EXISTS idx_gate_logged_at ON gate_logs(logged_at);
