-- MySQL/TiDB Database Schema for CorticoExpense
-- TiDB Cloud SQL Console Instructions:
-- 1. First run: CREATE DATABASE IF NOT EXISTS cortico_expense;
-- 2. Then run: USE cortico_expense;
-- 3. Then run the table creation statements below one by one

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Employee',
  title VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(50),
  budget DECIMAL(12, 2) DEFAULT 0,
  spent DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Expenses table (no foreign keys for TiDB compatibility)
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget requests table (no foreign keys for TiDB compatibility)
CREATE TABLE IF NOT EXISTS budget_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  requested_amount DECIMAL(12, 2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_amount DECIMAL(12, 2),
  reviewed_by INT,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity log table (no foreign keys for TiDB compatibility)
CREATE TABLE IF NOT EXISTS activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action_type VARCHAR(100) NOT NULL,
  action VARCHAR(255) NOT NULL,
  details VARCHAR(255),
  amount DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default employer account
-- Email: employer@company.com
-- Password: Password123
INSERT INTO users (first_name, last_name, email, password, role, title, department)
VALUES (
  'Admin',
  'Employer',
  'employer@company.com',
  '$2b$10$OAUrdf3UGRku1qtMm5SXNuKqaqHWKrxA.TOu9ctVYy1PJXhGgq8wK',
  'Employer',
  'Administrator',
  'Management'
);
