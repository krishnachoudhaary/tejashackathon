-- ============================================================
-- EventHub Database Schema (MySQL)
-- "Plan Smart. Spend Smart. Celebrate Better."
-- ============================================================

CREATE DATABASE IF NOT EXISTS eventhub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventhub_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CUSTOMER', 'VENDOR', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    city VARCHAR(100) DEFAULT 'Patna',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    business_name VARCHAR(150) NOT NULL,
    category ENUM('Venue', 'Catering', 'Decoration', 'Photography', 'DJ', 'Makeup', 'Event Services') NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    description TEXT,
    starting_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    price_unit VARCHAR(50) DEFAULT 'per event',
    rating DECIMAL(2, 1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(150),
    supported_event_types VARCHAR(255) DEFAULT 'Wedding,Birthday,Engagement,Corporate,Anniversary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Venues Specific Table (For Capacity, Halls & Rooms)
CREATE TABLE IF NOT EXISTS venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL UNIQUE,
    max_capacity INT NOT NULL DEFAULT 300,
    main_hall_capacity INT NOT NULL DEFAULT 200,
    conference_hall_capacity INT DEFAULT 100,
    rooms_available INT NOT NULL DEFAULT 8,
    lawn_available BOOLEAN DEFAULT TRUE,
    parking_capacity INT DEFAULT 50,
    catering_policy ENUM('In-House Only', 'Outside Allowed', 'Both') DEFAULT 'Both',
    ac_available BOOLEAN DEFAULT TRUE,
    facilities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- 4. Vendor Services / Packages Table
CREATE TABLE IF NOT EXISTS vendor_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    price_type VARCHAR(50) DEFAULT 'fixed',
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- 5. Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_name VARCHAR(150) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    guest_count INT NOT NULL DEFAULT 100,
    total_budget DECIMAL(12, 2) NOT NULL,
    allocated_budget DECIMAL(12, 2) DEFAULT 0.00,
    remaining_budget DECIMAL(12, 2) DEFAULT 0.00,
    required_services TEXT,
    status ENUM('PLANNING', 'BOOKED', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Event Vendors Association (Custom Event Plan selections)
CREATE TABLE IF NOT EXISTS event_vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    vendor_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    allocated_price DECIMAL(10, 2) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_category (event_id, category)
);

-- 7. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    event_id INT,
    vendor_id INT NOT NULL,
    event_date DATE NOT NULL,
    service_category VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    advance_amount DECIMAL(10, 2) NOT NULL,
    remaining_amount DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUND_INITIATED', 'REFUNDED') DEFAULT 'PENDING',
    commission_rate DECIMAL(4, 2) DEFAULT 0.10,
    commission_amount DECIMAL(10, 2) DEFAULT 0.00,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type ENUM('ADVANCE', 'REMAINING', 'FULL') DEFAULT 'ADVANCE',
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PAID',
    payment_method VARCHAR(50) DEFAULT 'UPI (Simulated)',
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 9. Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_id INT,
    total_paid DECIMAL(10, 2) NOT NULL,
    platform_cancellation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    refundable_amount DECIMAL(10, 2) NOT NULL,
    refund_status ENUM('REFUND_INITIATED', 'PROCESSING', 'REFUNDED') DEFAULT 'REFUND_INITIATED',
    refund_reference VARCHAR(100) NOT NULL UNIQUE,
    reason TEXT,
    refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_vendors_city_category ON vendors(city, category);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX idx_events_user ON events(user_id);
