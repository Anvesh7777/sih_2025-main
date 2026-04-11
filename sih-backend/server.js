const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Force load .env from the absolute root of this folder
dotenv.config({ path: path.join(__dirname, '.env') });

// Diagnostic - You will see this in the terminal
console.log("------------------------------------");
console.log("JWT_SECRET STATUS:", process.env.JWT_SECRET ? "LOADED ✅" : "MISSING ❌");
console.log("------------------------------------");

connectDB();
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));