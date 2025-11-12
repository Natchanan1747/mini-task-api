-- ใช้ฐานข้อมูลที่กำหนดใน docker-compose (MYSQL_DATABASE)
-- ไม่จำเป็นต้องมีคำสั่ง 'CREATE DATABASE' หรือ 'USE' ที่นี่

-- ตาราง Users (Users Table)
CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'premium', 'admin') NOT NULL DEFAULT 'user',
    isPremium BOOLEAN NOT NULL DEFAULT FALSE,
    subscriptionExpiry DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Tasks (Tasks Table)
CREATE TABLE IF NOT EXISTS Tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in progress', 'completed') NOT NULL DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'low',
    ownerId VARCHAR(255) NOT NULL,
    assignedTo VARCHAR(255),
    isPublic BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (ownerId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES Users(id) ON DELETE SET NULL
);