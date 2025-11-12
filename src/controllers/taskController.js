// src/controllers/task.controller.js
const Task = require('../models/task');
const Idempotency = require('../models/idempotency');
const { ValidationError, NotFoundError } = require('../utils/errors');

// POST /api/v1/tasks
exports.createTask = async (req, res, next) => {
  try {
    const idempotencyKey = req.headers['idempotency-key'];
    const ownerId = req.user.userId;

    if (idempotencyKey) {
      const cached = await Idempotency.findKey(ownerId, idempotencyKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached.responseBody));
      }
    }

    const { title } = req.body;
    if (!title) {
      // ⭐️ เปลี่ยน
      return next(new ValidationError('Title is required', { title: 'Title must not be empty' }));
    }

    const task = await Task.create({ ...req.body, ownerId: ownerId });

    if (idempotencyKey) {
      await Idempotency.saveKey(ownerId, idempotencyKey, task);
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks
exports.getTasks = async (req, res, next) => {
  try {
    // (เราจะเพิ่ม logic การ filter/การดึงเฉพาะ task ตัวเองที่นี่)
    // (สำหรับตอนนี้, เราแค่ดึง task ที่ ownerId = req.user.userId)
    const tasks = await Task.findAllByOwner(req.user.userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      // ⭐️ เปลี่ยน
      return next(new NotFoundError('Task not found'));
    }
    // (ABAC middleware (checkTaskAccess) ทำงานไปแล้ว)
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.update(req.params.id, req.body);
    if (!task) {
      // ⭐️ เปลี่ยน
      return next(new NotFoundError('Task not found'));
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/tasks/:id/status
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      // ⭐️ เปลี่ยน
      return next(new ValidationError('Status is required'));
    }
    const task = await Task.updateStatus(req.params.id, status);
    if (!task) {
      // ⭐️ เปลี่ยน
      return next(new NotFoundError('Task not found'));
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const affectedRows = await Task.delete(req.params.id);
    if (affectedRows === 0) {
      // ⭐️ เปลี่ยน
      return next(new NotFoundError('Task not found'));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};