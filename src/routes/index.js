const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const userRoutes = require('./userRoutes');

// v1 [cite: 57]
router.use('/v1/auth', authRoutes);
router.use('/v1/tasks', taskRoutes);
router.use('/v1/users', userRoutes);

// v2 (จะมาในสัปดาห์ที่ 3 [cite: 348])
// router.use('/v2/tasks', ...);

module.exports = router;