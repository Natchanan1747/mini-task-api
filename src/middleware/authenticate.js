// src/middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // 1. ดึง token จาก header [cite: 227]
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    // 401 Unauthorized (ไม่มี token) [cite: 185]
    return res.status(401).json({ 
      error: { code: 'UNAUTHORIZED', message: 'Access token is required' } 
    });
  }

  // 2. ตรวจสอบ token
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // 3. ถ้าผ่าน, เพิ่มข้อมูล user ไปยัง request [cite: 233]
    req.user = payload; // payload คือ { userId, email, role, ... }
    next();

  } catch (error) {
    // 401 Unauthorized (token หมดอายุ หรือไม่ถูกต้อง) [cite: 185]
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: { code: 'TOKEN_EXPIRED', message: 'Access token has expired' } 
      });
    }
    return res.status(401).json({ 
      error: { code: 'INVALID_TOKEN', message: 'Invalid access token' } 
    });
  }
};

module.exports = authenticate;