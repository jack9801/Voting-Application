const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String
    },
    age: {
        type: Number,
        required: true
    },
    aadharcardNumber:{
        type: String,
        required: true,
        unique: true
    },
    mobile:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type :String,
        enum:['Admin','voter'],
        default: 'voter'    
    },
    isvoted:{
        type: Boolean,
        default: false
    }
});

// Middleware to hash the password before saving the person document

userSchema.pre('save', async function(next) {
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }
    try
{
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
//
userSchema.methods.comparePassword = async function(candidatePassword) {
    // Compare the provided password with the hashed password stored in the database
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch (error) {
        throw error;
    }

};

// export the model
const User = mongoose.model('User', userSchema);
module.exports = User;