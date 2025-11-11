const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// v1 Routes [cite: 96]
router.post('/', taskController.createTask); // POST /api/v1/tasks [cite: 97]
router.get('/', taskController.getTasks); // GET /api/v1/tasks [cite: 100]
router.get('/:id', taskController.getTaskById); // GET /api/v1/tasks/:id [cite: 105]
router.put('/:id', taskController.updateTask); // PUT /api/v1/tasks/:id [cite: 108]
router.patch('/:id/status', taskController.updateTaskStatus); // PATCH /api/v1/tasks/:id/status [cite: 112]
router.delete('/:id', taskController.deleteTask); // DELETE /api/v1/tasks/:id [cite: 115]

module.exports = router;