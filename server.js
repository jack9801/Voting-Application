const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');
const adminRoutes = require('./Routes/admin.js'); // 1. Import the admin routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
const cors = require("cors");

const allowedOrigins = [
  "https://voting-application-gules.vercel.app",
  "https://voting-application-git-main-jack9801s-projects.vercel.app",
  "https://voting-app-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(bodyParser.json());

// API Routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);
app.use('/admin', adminRoutes); // 2. Use the admin routes with the '/admin' prefix

// API 404 Not Found Middleware - This will catch any API calls that don't match the routes above
app.use('/api', (req, res, next) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});