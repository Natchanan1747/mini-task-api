// src/models/idempotency.model.js
const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Idempotency = {
  // ค้นหา Key (ที่ยังไม่หมดอายุ 24 ชม.) [cite: 156]
  findKey: async (userId, key) => {
    const sql = `
      SELECT responseBody FROM IdempotencyKeys
      WHERE userId = ? AND idempotencyKey = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `;
    const [rows] = await pool.query(sql, [userId, key]);
    return rows[0];
  },
  
  // บันทึก Key
  saveKey: async (userId, key, response) => {
    const id = uuidv4();
    const sql = `
      INSERT INTO IdempotencyKeys (id, userId, idempotencyKey, responseBody)
      VALUES (?, ?, ?, ?)
    `;
    // ต้องแปลง JSON เป็น String
    await pool.query(sql, [id, userId, key, JSON.stringify(response)]);
  }
};

module.exports = Idempotency;