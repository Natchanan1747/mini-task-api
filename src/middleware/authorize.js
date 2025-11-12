// src/middleware/authorize.js
const { ForbiddenError } = require('../utils/errors');

// roles คือ array ของ role ที่อนุญาต เช่น ['admin'] หรือ ['user', 'premium']
const authorize = (roles) => { // [cite: 252]
  return (req, res, next) => {
    // (Middleware นี้ต้องทำงาน *หลัง* authenticate)
    if (!req.user || !req.user.role) {
      // เกิดข้อผิดพลาด (ไม่ควรเกิด) กันเหนียว
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) { // [cite: 254]
      // 403 Forbidden (คุณเป็นใครเรารู้ แต่คุณไม่มีสิทธิ์) [cite: 255-257, 186]
      return next(new ForbiddenError('You do not have permission to access this resource'));
    }

    // ถ้าสิทธิ์ถูกต้อง, ไปต่อ
    next(); // [cite: 261]
  };
};

module.exports = authorize;