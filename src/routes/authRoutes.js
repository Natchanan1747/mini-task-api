const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // POST /api/v1/auth/register 
router.post('/login', authController.login); // POST /api/v1/auth/login

module.exports = router;