const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // ติดตั้ง: npm install uuid
const bcrypt = require('bcryptjs');

const User = {
  // สร้าง User (สำหรับ Register)
  create: async (email, password, name) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password [cite: 225, 341]
    const id = uuidv4();
    const sql = `
      INSERT INTO Users (id, email, password, name, role, isPremium)
      VALUES (?, ?, ?, ?, 'user', FALSE)
    `;
    // เราจะยังไม่จัดการเรื่อง email ซ้ำในตอนนี้ (จะไปทำใน Error Handling)
    await pool.query(sql, [id, email, hashedPassword, name]);
    // คืนค่า user ที่สร้างใหม่ (ไม่รวม password)
    return { id, email, name, role: 'user', isPremium: false };
  },

  // หา User ด้วย Email (สำหรับ Login ในสัปดาห์ที่ 2)
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  }
  // ... CRUD อื่นๆ จะตามมา
};

module.exports = User;