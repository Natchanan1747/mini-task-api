// Middleware นี้จะทำงานเมื่อมีการเรียก next(error)
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error ไว้ดูใน console

  // (นี่คือ Error Handling แบบพื้นฐานสำหรับสัปดาห์ที่ 1)
  // (ในสัปดาห์ที่ 3 เราจะปรับปรุงให้เป็น Format ที่กำหนด [cite: 164, 349])

  const statusCode = err.statusCode || 500; // 500 Internal Server Error
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR', // [cite: 167]
      message: message, // [cite: 168]
      path: req.path, // [cite: 172]
      timestamp: new Date().toISOString() // [cite: 171]
    }
  });
};

module.exports = errorHandler;