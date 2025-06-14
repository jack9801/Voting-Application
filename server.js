const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
const cors = require("cors");

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
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(bodyParser.json());

// API Routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
