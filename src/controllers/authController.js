const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const { ValidationError, UnauthorizedError } = require('../utils/errors');

// Register
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return next(new ValidationError('Email, password, and name are required'));
    }

    // (เราจะเพิ่มการเช็ค Email ซ้ำในสัปดาห์ที่ 3 [cite: 180, 188])
    const newUser = await User.create(email, password, name);

    // (สัปดาห์ที่ 1 ยังไม่คืน Token [cite: 226])
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    // (ถ้า DB error จาก email ซ้ำ)
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new ValidationError('This email is already registered', { email: 'Email already in use' }));
    }
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError('Email and password are required'));
    }

    // 1. หา user ด้วย email
    const user = await User.findByEmail(email);
    if (!user) {
      // (เพื่อความปลอดภัย, ไม่ควรบอกว่า "user not found")
      return next(new UnauthorizedError('Invalid credentials'));
    }

    // 2. ตรวจสอบรหัสผ่าน 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new UnauthorizedError('Invalid credentials'));
    }

    // 3. สร้าง Tokens 
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    // (ในระบบจริง ควรเก็บ refreshToken ไว้ใน DB เพื่อ revoke ได้)

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};