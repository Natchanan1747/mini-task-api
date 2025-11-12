// src/controllers/user.controller.js
const User = require('../models/user');
const { NotFoundError } = require('../utils/errors');

// GET /api/v1/users
exports.listUsers = async (req, res, next) => {
    try {
        // (ต้องเพิ่ม User.findAll() ใน model)
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/users/me
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
        return next(new NotFoundError('User not found'));
        }
        delete user.password;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};