const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');
const { checkTaskAccess, checkPremiumFeature } = require('../middleware/abac');

// v1 Routes
// ใช้ authenticate กับทุก route ในไฟล์นี้
router.use(authenticate); // Middleware ตรวจสอบ token สำหรับทุก route ด้านล่างนี้

router.post('/', checkPremiumFeature, taskController.createTask); // POST /api/v1/tasks [cite: 97]
router.get('/', taskController.getTasks); // GET /api/v1/tasks [cite: 100]
router.get('/:id', checkTaskAccess('read'), taskController.getTaskById); // GET /api/v1/tasks/:id [cite: 105]
router.put('/:id', checkTaskAccess('write'), taskController.updateTask); // PUT /api/v1/tasks/:id [cite: 108]
router.patch('/:id/status', checkTaskAccess('write'), taskController.updateTaskStatus); // PATCH /api/v1/tasks/:id/status [cite: 112]
router.delete('/:id', checkTaskAccess('write'), taskController.deleteTask); // DELETE /api/v1/tasks/:id [cite: 115]

module.exports = router;