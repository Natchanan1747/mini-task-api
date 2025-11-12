// src/middleware/errorHandler.js
const { BaseError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log error

  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details = {};

  if (err instanceof BaseError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // (ถ้าใช้ library validation เช่น Joi)
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
    // details = ...
  }

  // Format ที่โจทย์ต้องการ
  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: message,
      details: details,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
};

module.exports = errorHandler;