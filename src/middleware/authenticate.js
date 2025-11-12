// src/middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UnauthorizedError } = require('../utils/errors');

const authenticate = async (req, res, next) => {
  // 1. ดึง token จาก header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    // 401 Unauthorized (ไม่มี token)
    return next(new UnauthorizedError('Access token is required'));
  }

  // 2. ตรวจสอบ token
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
   // ดึง user ทั้งก้อนจาก DB
    const user = await User.findById(payload.userId); 

    if (!user) {
      return next(new UnauthorizedError('User not found, token is invalid'));
    }

    // ลบ password ออกจาก object ก่อนส่งต่อ
    delete user.password;

    req.user = user; // 👈 ตอนนี้ req.user มีข้อมูลครบ (isPremium, role, subscriptionExpiry)
    next();

  } catch (error) {
    // 401 Unauthorized (token หมดอายุ หรือไม่ถูกต้อง) [cite: 185]
    if (error.name === 'TokenExpiredError') {
        return next(new UnauthorizedError('Access token has expired'));
    }
    return next(new UnauthorizedError('Invalid access token'));
  }
};

module.exports = authenticate;