const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Task = {
  // สร้าง Task (POST /tasks) [cite: 97]
  create: async (taskData) => {
    const id = uuidv4();
    const { title, description, priority, ownerId, assignedTo, isPublic } = taskData;
    const sql = `
      INSERT INTO Tasks (id, title, description, priority, ownerId, assignedTo, isPublic)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [
      id,
      title,
      description || null,
      priority || 'low',
      ownerId, // ในสัปดาห์ที่ 2 เราจะดึง ownerId จาก req.user
      assignedTo || null,
      isPublic || false
    ]);
    const [rows] = await pool.query('SELECT * FROM Tasks WHERE id = ?', [id]);
    return rows[0];
  },

  // ดึง Task ทั้งหมด (GET /tasks) [cite: 100]
  findAll: async (filters) => {
    // (สัปดาห์ที่ 1: ดึงมาทั้งหมดก่อน, Filtering [cite: 104] จะทำในสัปดาห์ถัดๆ ไป)
    const [rows] = await pool.query('SELECT * FROM Tasks');
    return rows;
  },

  // ดึง Task ด้วย ID (GET /tasks/:id) [cite: 105]
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM Tasks WHERE id = ?', [id]);
    return rows[0];
  },

  // อัปเดต Task (PUT /tasks/:id) [cite: 108]
  update: async (id, taskData) => {
    const { title, description, status, priority, assignedTo, isPublic } = taskData;
    // PUT ต้องอัปเดตทุก field [cite: 111]
    const sql = `
      UPDATE Tasks SET
        title = ?, description = ?, status = ?, priority = ?, assignedTo = ?, isPublic = ?
      WHERE id = ?
    `;
    await pool.query(sql, [title, description, status, priority, assignedTo, isPublic, id]);
    const [rows] = await pool.query('SELECT * FROM Tasks WHERE id = ?', [id]);
    return rows[0];
  },

  // อัปเดต Status (PATCH /tasks/:id/status) [cite: 112]
  updateStatus: async (id, status) => {
    const sql = 'UPDATE Tasks SET status = ? WHERE id = ?';
    await pool.query(sql, [status, id]);
    const [rows] = await pool.query('SELECT * FROM Tasks WHERE id = ?', [id]);
    return rows[0];
  },

  // ลบ Task (DELETE /tasks/:id) [cite: 115]
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM Tasks WHERE id = ?', [id]);
    return result.affectedRows; // คืนค่าจำนวนแถวที่ถูกลบ
  }
};

module.exports = Task;