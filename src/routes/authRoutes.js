const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // POST /api/v1/auth/register 
// (Login, Refresh, Logout จะมาในสัปดาห์ที่ 2)

module.exports = router;