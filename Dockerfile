# ใช้ Node.js image เวอร์ชัน 18
FROM node:18-alpine

# ตั้งค่า Working Directory ภายใน Container
WORKDIR /usr/src/app

# Copy package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# Copy โค้ดโปรเจกต์ทั้งหมด
COPY . .

# เปิด Port 5000 (หรือ Port ที่คุณตั้งใจจะใช้)
EXPOSE 5000

# คำสั่งรัน Server เมื่อ Container เริ่มทำงาน
CMD [ "npm", "run", "dev" ]