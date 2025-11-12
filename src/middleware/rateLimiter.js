// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const { ForbiddenError } = require('../utils/errors'); // (ควรสร้าง RateLimitExceededError)

// Custom handler เมื่อติดลิมิต [cite: 135-142]
const rateLimitHandler = (req, res, next, options) => {
  return next(new RateLimitExceededError('Too many requests. Try again later.'));
};

// 1. Limiter สำหรับ Public (Register, Login)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 20, // Anonymous: 20 req/15min [cite: 128]
  handler: rateLimitHandler,
  legacyHeaders: false, // ปิด X-RateLimit-*
  standardHeaders: 'draft-7' // เปิด RateLimit-* (ตามมาตรฐานใหม่)
});

// 2. Limiter สำหรับ API (ที่ต้อง authenticate)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  // ⭐️ Dynamic Limit (User vs Premium)
  limit: (req, res) => {
    if (req.user && (req.user.role === 'premium' || req.user.role === 'admin')) {
      return 500; // Premium / Admin: 500 req/15min [cite: 130]
    }
    return 100; // User: 100 req/15min [cite: 129]
  },
  keyGenerator: (req, res) => {
    return req.user.userId; // ใช้ userId เป็น key (ต้องรันหลัง authenticate)
  },
  handler: rateLimitHandler,
  legacyHeaders: false,
  standardHeaders: 'draft-7' // [cite: 131-134] (ชื่อ Header อาจต่างเล็กน้อย)
});

module.exports = { publicLimiter, apiLimiter };