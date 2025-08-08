const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require("cors");

const db = require('./db');
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "https://voting-application-gules.vercel.app",
  "https://voting-application-git-main-jack9801s-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all necessary methods
  credentials: true
}));

// Handle pre-flight requests for all routes
app.options('*', cors()); 

app.use(bodyParser.json());

// API Routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// API 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});