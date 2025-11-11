const User = require('../models/user');

// POST /api/v1/auth/register 
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // (เราจะเพิ่มการเช็ค Email ซ้ำในสัปดาห์ที่ 3 [cite: 180, 188])
    const newUser = await User.create(email, password, name);

    // (สัปดาห์ที่ 1 ยังไม่คืน Token [cite: 226])
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    next(error);
  }
};