const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');
const app=express();
require('dotenv').config();
app.use(bodyParser.json());
const PORT = 3000;
app.get('/', async(req,res)=>{
    res.send('welcome to the server');
});
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
