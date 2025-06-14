const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
