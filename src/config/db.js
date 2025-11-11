const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ฟังก์ชันสำหรับทดสอบการเชื่อมต่อ
const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1); // ออกจากโปรแกรมถ้าต่อ DB ไม่ได้
  }
};

module.exports = { pool, testConnection };