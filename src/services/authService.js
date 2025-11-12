// src/services/auth.service.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  // สร้าง Access Token: 15 นาที [cite: 210]
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium
    }, // Payload [cite: 211-215]
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' } // [cite: 210]
  );
};

const generateRefreshToken = (user) => {
  // สร้าง Refresh Token: 7 วัน [cite: 218]
  return jwt.sign(
    {
      userId: user.id,
      // (เราจะยังไม่ทำ tokenId ในขั้นตอนนี้เพื่อให้ง่าย) [cite: 221]
    }, // Payload [cite: 219-220]
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // [cite: 218]
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};