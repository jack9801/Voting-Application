const mongoose = require('mongoose');
const mongoDburl='mongodb://localhost:27017/voting';
mongoose.connect(mongoDburl);
const db=mongoose.connection;
db.on('connected', () => {
    console.log('Connected to MongoDB');
});
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});
// export the connection
module.exports = db;
