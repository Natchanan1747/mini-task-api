const express = require('express');
const router = express.Router();
const { publicLimiter, apiLimiter } = require('../middleware/rateLimiter');

const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const userRoutes = require('./userRoutes');

// v1
// Public routes (ไม่ต้อง authenticate)
router.use('/v1/auth', publicLimiter, authRoutes);

// Protected routes (ต้อง authenticate)
router.use('/v1/tasks', apiLimiter, taskRoutes);
router.use('/v1/users', apiLimiter, userRoutes);

// v2 (จะมาในสัปดาห์ที่ 3 [cite: 348])
// router.use('/v2/tasks', ...);

module.exports = router;