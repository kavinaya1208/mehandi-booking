CREATE DATABASE mehandi_booking;
USE mehandi_booking;
CREATE TABLE bookings(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
phone VARCHAR (15) NOT NULL,
email VARCHAR (100),
event_date DATE NOT NULL,
event_time TIME NOT NULL,
service VARCHAR(100) NOT NULL,
location VARCHAR(255),
message TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for login
CREATE TABLE users(
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert existing demo user
INSERT INTO users (email, password) VALUES ('admin@gmail.com', 'admin123');

SELECT * From bookings;
