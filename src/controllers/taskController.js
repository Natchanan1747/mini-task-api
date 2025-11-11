const Task = require('../models/task');

// POST /api/v1/tasks [cite: 97]
exports.createTask = async (req, res, next) => {
  try {
    // (ชั่วคราว: สัปดาห์ที่ 1 เรายังไม่มี Auth  จึงต้องส่ง ownerId มาใน body ก่อน)
    // (ในสัปดาห์ที่ 2 เราจะเปลี่ยนเป็น req.user.id)
    const { title, ownerId } = req.body; 
    if (!title || !ownerId) {
      // (Error Handling พื้นฐาน )
      return res.status(400).json({ message: 'Title and OwnerId are required' });
    }

    const task = await Task.create({ ...req.body, ownerId });
    res.status(201).json(task);
  } catch (error) {
    next(error); // ส่งต่อไปยัง errorHandler
  }
};

// GET /api/v1/tasks [cite: 100]
exports.getTasks = async (req, res, next) => {
  try {
    // (ยังไม่ทำ Filtering [cite: 104] หรือ RBAC/ABAC [cite: 235, 264] ในสัปดาห์นี้)
    const tasks = await Task.findAll(req.query);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks/:id [cite: 105]
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/tasks/:id [cite: 108]
exports.updateTask = async (req, res, next) => {
  try {
    // (ยังไม่ทำ Authorization check [cite: 272] ในสัปดาห์นี้)
    const task = await Task.update(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/tasks/:id/status [cite: 112]
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const task = await Task.updateStatus(req.params.id, status);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    // Endpoint นี้เป็น Idempotent [cite: 114, 159] อยู่แล้ว
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/tasks/:id [cite: 115]
exports.deleteTask = async (req, res, next) => {
  try {
    // (ยังไม่ทำ Authorization check [cite: 272] ในสัปดาห์นี้)
    const affectedRows = await Task.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
};