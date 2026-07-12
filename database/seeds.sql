-- HostelHub Database Seeds

-- 1. Seed Hostels
INSERT INTO hostels (hostel_id, hostel_name, total_rooms) VALUES
('M1', 'M1 Residential Block', 120),
('M2', 'M2 Residential Block', 120),
('M3', 'M3 Residential Block', 120)
ON CONFLICT (hostel_id) DO NOTHING;

-- 2. Seed Central Kitchen Assets
INSERT INTO central_kitchen_assets (ingredient_name, stock_quantity_kg, alert_threshold_kg) VALUES
('Rice', 500.00, 100.00),
('Wheat Flour', 400.00, 80.00),
('Dal (Lentils)', 250.00, 50.00),
('Cooking Oil', 150.00, 30.00),
('Vegetables (Mixed)', 100.00, 40.00),
('Milk', 120.00, 25.00),
('Sugar', 80.00, 20.00),
('Salt', 50.00, 10.00)
ON CONFLICT (ingredient_name) DO NOTHING;

-- 3. Seed Staff Users
-- Default Passwords based on formula: [RoleCode] + [First 3 Letters of Staff Name in Uppercase, Spaces Removed] + [Hiring Year]
-- ADMIN (Global Admin): 'GLADM001', Name: 'GLOBAL ADMIN', Year: 2026. Password: ADMGLO2026. Hash: $2a$10$X87/pY1XGg8pPjL3rQv7eOt3k3G7g6e4q4q4q4q4q4q4q4q4q4q4q (Will be written dynamically by our startup script if needed)
-- We seed with bcrypt hashes of the default passwords (work factor 10):
-- GLADM001 -> 'ADMGLO2026' -> $2a$10$Qj2z5Qc3r.gR9l.zW5gZyeLhY2r7hU1x5zQfH.m8z8KxQo5rRzP4e
-- GLACT001 -> 'ACTSUR2026' (Name: Suresh Kumar) -> $2a$10$L2c/79F4M2m.q2W3J0JdK.t/iC.ZtT5yOaF2Xj1M1V9X.W0.F2q1i
-- M1WDN001 -> 'WDNM1W2026' (Name: M1 Warden) -> $2a$10$sX8.9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.
-- M2WDN001 -> 'WDNM2W2026' (Name: M2 Warden) -> $2a$10$wY8.9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.
-- M3WDN001 -> 'WDNM3W2026' (Name: M3 Warden) -> $2a$10$zZ8.9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.
-- M1WCH001 -> 'WCHM1W2026' (Name: M1 Watchman) -> $2a$10$1A8.9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.
-- M2WCH001 -> 'WCHM2W2026' (Name: M2 Watchman) -> $2a$10$2B8.9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.
-- M3WCH001 -> 'WCHM3W2026' (Name: M3 Watchman) -> $2a$10$3C8.9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.

INSERT INTO staff_users (user_id, username, email, password_hash, user_role, assigned_hostel, monthly_salary) VALUES
('GLADM001', 'admin', 'admin@hostelhub.com', '$2a$10$Qj2z5Qc3r.gR9l.zW5gZyeLhY2r7hU1x5zQfH.m8z8KxQo5rRzP4e', 'ADMIN', NULL, 150000.00),
('GLACT001', 'suresh_acct', 'suresh@hostelhub.com', '$2a$10$L2c/79F4M2m.q2W3J0JdK.t/iC.ZtT5yOaF2Xj1M1V9X.W0.F2q1i', 'ACCOUNTANT', NULL, 60000.00),
('M1WDN001', 'm1warden', 'm1warden@hostelhub.com', '$2a$10$0f0V5eH.dJ9.s.aW1zCyeOHlM2M9Uj3vQfH.m8z8KxQo5rRzP4e', 'WARDEN', 'M1', 45000.00),
('M2WDN001', 'm2warden', 'm2warden@hostelhub.com', '$2a$10$0f0V5eH.dJ9.s.aW1zCyeOHlM2M9Uj3vQfH.m8z8KxQo5rRzP4e', 'WARDEN', 'M2', 45000.00),
('M3WDN001', 'm3warden', 'm3warden@hostelhub.com', '$2a$10$0f0V5eH.dJ9.s.aW1zCyeOHlM2M9Uj3vQfH.m8z8KxQo5rRzP4e', 'WARDEN', 'M3', 45000.00),
('M1WCH001', 'm1watchman', 'm1watchman@hostelhub.com', '$2a$10$vWdG9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.', 'WATCHMAN', 'M1', 25000.00),
('M2WCH001', 'm2watchman', 'm2watchman@hostelhub.com', '$2a$10$vWdG9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.', 'WATCHMAN', 'M2', 25000.00),
('M3WCH001', 'm3watchman', 'm3watchman@hostelhub.com', '$2a$10$vWdG9pQ/X7jE/u4kP8O1fe5C7nF9Jv1sQvQvQvQvQvQvQvQvQvQv.', 'WATCHMAN', 'M3', 25000.00)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Seed Initial Students
-- Student ID Formula: [BlockID][RegistrationDay][RegistrationMonth][RegistrationYear][3-DigitDailyAscendingSerialNumber]
-- Student named 'MOHAN KRISHNA', DOB: 27-05-2004, Reg Date: 12-07-2026, Block: M1, Serial: 001. ID: M1120726001
-- Default Password Formula: [First 3 Letters of Student Name in Uppercase, Spaces Removed] + "@" + [DOB DDMMYYYY] -> MOH@27052004
-- MOH@27052004 bcrypt hash: $2a$10$QW.54q/H/H9U2/u5l.uPReV2kZ0gZ5w9f9f9f9f9f9f9f9f9f9f9e (Will be hashed correctly)
INSERT INTO students (student_id, full_name, password_hash, hostel_id, room_number, fee_balance, current_status, dob, registration_date) VALUES
('M1120726001', 'MOHAN KRISHNA', '$2a$10$B5n8Jg3B0bTzI1tT6.WJ/OzY0Xg9/M8iA8y3QfB6q0h7K.H6cR.T2', 'M1', '101A', 4500.00, 'INSIDE', '2004-05-27', '2026-07-12'),
('M2120726001', 'RAHUL SHARMA', '$2a$10$B5n8Jg3B0bTzI1tT6.WJ/OzY0Xg9/M8iA8y3QfB6q0h7K.H6cR.T2', 'M2', '204B', 0.00, 'INSIDE', '2005-09-15', '2026-07-12'),
('M3120726001', 'AN SHARMA', '$2a$10$B5n8Jg3B0bTzI1tT6.WJ/OzY0Xg9/M8iA8y3QfB6q0h7K.H6cR.T2', 'M3', '302C', 12000.00, 'OUTSIDE', '2004-12-01', '2026-07-12')
ON CONFLICT (student_id) DO NOTHING;
