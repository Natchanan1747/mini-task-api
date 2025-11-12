// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// ล็อกทุก route ในนี้
router.use(authenticate);

// /api/v1/users/me (สำหรับ user ทุกคน) [cite: 85]
router.get('/me', userController.getMe);
// (PUT /me และ DELETE /me จะเพิ่มทีหลัง) [cite: 88, 90]

// /api/v1/users (สำหรับ admin เท่านั้น) [cite: 94, 263]
router.get('/', authorize(['admin']), userController.listUsers);

module.exports = router;