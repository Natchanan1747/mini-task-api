require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const mainRouter = require('./routes/index'); // (เราจะสร้างไฟล์นี้ใน Step 4)
const errorHandler = require('./middleware/errorHandler'); // (เราจะสร้างไฟล์นี้ใน Step 5)

const app = express();
const PORT = process.env.PORT || 5000;

// ทดสอบการเชื่อมต่อ Database
testConnection();

// Middlewares
app.use(cors());
app.use(express.json()); // สำหรับ Parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Mini Task API!');
});

// API Routes (เราจะย้ายไปไว้ใน /routes)
app.use('/api', mainRouter);

// Basic Error Handling (ต้องอยู่หลัง Routes ทั้งหมด)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});