// src/utils/errors.js

// Error พื้นฐาน
class BaseError extends Error {
  constructor(message, statusCode, code, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details || {};
  }
}

// 400 Bad Request
class ValidationError extends BaseError {
  constructor(message = 'Invalid input data', details) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// 401 Unauthorized
class UnauthorizedError extends BaseError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// 403 Forbidden
class ForbiddenError extends BaseError {
  constructor(message = 'You do not have permission') {
    super(message, 403, 'FORBIDDEN');
  }
}

// 404 Not Found
class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// 429 Too Many Requests
class RateLimitExceededError extends BaseError {
  constructor(message = 'Too many requests') {
    [cite_start]// [cite: 138, 181]
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

module.exports = {
  BaseError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};