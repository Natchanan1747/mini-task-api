// src/middleware/abac.js
const Task = require('../models/task');
const { ForbiddenError, NotFoundError } = require('../utils/errors');

// Middleware สำหรับเช็กสิทธิ์ Read/Write Task [cite: 285]
const checkTaskAccess = (action) => {
  return async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return next(new NotFoundError('Task not found'));
      }
      
      const user = req.user;

      switch (action) {
        case 'read': // [cite: 266]
          const canRead = task.isPublic || // [cite: 268]
                          task.ownerId === user.id || // [cite: 269]
                          task.assignedTo === user.id || // [cite: 270]
                          user.role === 'admin'; // [cite: 271]
          if (canRead) return next();
          break;
        
        case 'write': // [cite: 272]
          const canWrite = task.ownerId === user.id || // [cite: 273]
                           user.role === 'admin';
          if (canWrite) return next();
          break;
      }
      
      return next(new ForbiddenError('You do not have permission for this task'));

    } catch (error) {
      next(error);
    }
  };
};

// Middleware สำหรับเช็กฟีเจอร์ Premium (เช่น สร้าง Task priority 'high')
const checkPremiumFeature = (req, res, next) => {
  const user = req.user;

  // Rule 3: Create High Priority Task [cite: 274]
  if (req.body.priority && req.body.priority === 'high') {
    
    // Admin ทำได้เสมอ [cite: 276]
    if (user.role === 'admin') {
      return next();
    }
    
    // Rule 4: Time-based Access [cite: 277]
    const isSubscriptionActive = user.isPremium && // [cite: 278]
                                 user.subscriptionExpiry && // [cite: 278]
                                 new Date(user.subscriptionExpiry) > new Date(); // [cite: 283]

    if (isSubscriptionActive) { // [cite: 275]
      return next();
    }
    
    return next(new ForbiddenError('Creating high-priority tasks requires a premium subscription'));
  }

  // ถ้าไม่ใช่ priority 'high' ก็ผ่าน
  return next();
};

module.exports = { checkTaskAccess, checkPremiumFeature };