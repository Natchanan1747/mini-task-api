// src/controllers/user.controller.js
// (เราจะสร้าง Model เพิ่ม)

// GET /api/v1/users [cite: 93]
exports.listUsers = async (req, res, next) => {
  // (Logic ดึง user ทั้งหมดจาก DB... เราจะข้ามไปก่อน)
  res.status(200).json({ message: 'List of all users (admin only)' });
};

// GET /api/v1/users/me [cite: 85]
exports.getMe = async (req, res, next) => {
  // (Logic ดึงข้อมูล req.user.userId จาก DB)
  res.status(200).json({ message: 'My profile data', user: req.user });
};