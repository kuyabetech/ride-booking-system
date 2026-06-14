-- database/schema.sql

CREATE DATABASE IF NOT EXISTS ride_booking_system;
USE ride_booking_system;

-- Users table (common for all roles)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'user', 'driver') DEFAULT 'user',
    profile_picture VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Drivers table
CREATE TABLE drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    driver_license VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_trips INT DEFAULT 0,
    status ENUM('available', 'busy', 'offline', 'on_break') DEFAULT 'offline',
    current_latitude DECIMAL(10,8),
    current_longitude DECIMAL(11,8),
    joining_date DATE NOT NULL,
    emergency_contact VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status)
);

-- Vehicles table
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    make VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    capacity INT NOT NULL,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(30),
    insurance_expiry DATE NOT NULL,
    fitness_expiry DATE NOT NULL,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    current_driver_id INT,
    last_maintenance DATE,
    next_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    INDEX idx_status (status)
);

-- Bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    driver_id INT,
    vehicle_id INT,
    pickup_location TEXT NOT NULL,
    pickup_latitude DECIMAL(10,8),
    pickup_longitude DECIMAL(11,8),
    dropoff_location TEXT NOT NULL,
    dropoff_latitude DECIMAL(10,8),
    dropoff_longitude DECIMAL(11,8),
    scheduled_time DATETIME NOT NULL,
    distance_km DECIMAL(10,2),
    duration_minutes INT,
    fare_amount DECIMAL(10,2),
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    INDEX idx_status (status),
    INDEX idx_scheduled_time (scheduled_time),
    INDEX idx_user (user_id)
);

-- Ride history table
CREATE TABLE ride_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT UNIQUE,
    start_time DATETIME,
    end_time DATETIME,
    actual_distance DECIMAL(10,2),
    actual_duration INT,
    driver_rating INT CHECK (driver_rating >= 1 AND driver_rating <= 5),
    user_rating INT CHECK (user_rating >= 1 AND user_rating <= 5),
    driver_feedback TEXT,
    user_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id VARCHAR(50) UNIQUE NOT NULL,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'wallet') DEFAULT 'cash',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_payment_status (payment_status)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking', 'system', 'payment', 'reminder') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
);

-- Activity logs table (for audit trail)
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_action (user_id, action),
    INDEX idx_created_at (created_at)
);

-- Schedule conflicts table
CREATE TABLE schedule_conflicts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    driver_id INT,
    vehicle_id INT,
    conflict_type ENUM('driver', 'vehicle', 'time') NOT NULL,
    scheduled_time DATETIME NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Driver applications tracking
CREATE TABLE driver_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT UNIQUE NOT NULL,
    years_of_experience INT,
    preferred_areas TEXT,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    account_name VARCHAR(100),
    license_photo_url VARCHAR(255),
    profile_photo_url VARCHAR(255),
    medical_certificate_url VARCHAR(255),
    training_certificate_url VARCHAR(255),
    status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected') DEFAULT 'draft',
    submitted_at DATETIME,
    reviewed_by INT,
    reviewed_at DATETIME,
    rejection_reason TEXT,
    reviewer_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- Driver-vehicle assignment history
CREATE TABLE driver_vehicle_assignment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at DATETIME NOT NULL,
    assigned_until DATETIME,
    status ENUM('active', 'ended') DEFAULT 'active',
    end_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_driver_status (driver_id, status),
    INDEX idx_vehicle_status (vehicle_id, status)
);

-- Insert sample admin user (password: Admin@123)
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone, role, email_verified) 
VALUES ('ADMIN001', 'admin@waziriumaru.edu.ng', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'System', 'Admin', '+234800000000', 'admin', TRUE);

-- Insert sample drivers
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone, role, email_verified) VALUES
('DRV001', 'driver1@waziriumaru.edu.ng', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'John', 'Doe', '+234801234567', 'driver', TRUE),
('DRV002', 'driver2@waziriumaru.edu.ng', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Jane', 'Smith', '+234802345678', 'driver', TRUE);

INSERT INTO drivers (user_id, driver_license, license_expiry, status, joining_date) VALUES
(2, 'DL123456', '2025-12-31', 'available', '2024-01-01'),
(3, 'DL234567', '2025-12-31', 'available', '2024-01-01');

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_number, model, make, year, capacity, plate_number, color, insurance_expiry, fitness_expiry, status) VALUES
('V001', 'Camry', 'Toyota', 2022, 4, 'ABC123', 'Silver', '2025-12-31', '2025-12-31', 'active'),
('V002', 'Accord', 'Honda', 2023, 4, 'DEF456', 'Black', '2025-12-31', '2025-12-31', 'active'),
('V003', 'Sienna', 'Toyota', 2022, 7, 'GHI789', 'White', '2025-12-31', '2025-12-31', 'active');
