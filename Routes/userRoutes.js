const express = require('express');
const router = express.Router();
const User = require('./../model/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const { Parser } = require('json2csv');

// Helper function to check for Admin role
const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user && user.role === 'Admin';
    } catch (err) {
        return false;
    }
};

// POST /signup - User Registration
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    const adminUser = await User.findOne({ role: 'Admin' });
    if (data.role === 'Admin' && adminUser) {
      return res.status(400).json({ message: 'An Admin account already exists.' });
    }

    if (!/^\d{12}$/.test(data.aadharcardNumber)) {
      return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits.' });
    }

    const existingUser = await User.findOne({ aadharcardNumber: data.aadharcardNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this Aadhar number already exists.' });
    }

    const existingMobile = await User.findOne({ mobile: data.mobile });
    if (existingMobile) {
      return res.status(400).json({ error: 'This mobile number is already in use.' });
    }

    const newUser = new User(data);
    const response = await newUser.save();

    const payload = { id: response.id };
    const token = generateToken(payload);

    res.status(201).json({
      message: 'User created successfully',
      token: token,
      user: { role: response.role }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error saving user.' });
  }
});

// POST /login - User Login
router.post('/login', async (req, res) => {
    try {
        const { aadharcardNumber, password } = req.body;
        if (!aadharcardNumber || !password) {
            return res.status(400).json({ message: 'Please provide both Aadhar number and password.' });
        }
        const user = await User.findOne({ aadharcardNumber: aadharcardNumber });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid Aadhar number or password.' });
        }
        const payload = { id: user.id };
        const token = generateToken(payload);
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: { role: user.role }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error, message: 'Error logging in user.' });
    }
});

// GET /profile - Get User Profile
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.userData.id;
        const user = await User.findById(userId, '-password');
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /profile/password - Change User Password
router.post('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.userData.id;
        
        // **THE FIX: Changed 'NewPassword' to 'newPassword' to match the frontend**
        const { currentPassword, newPassword } = req.body; 

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new password are required.' });
        }
        const user = await User.findById(userId);
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid Current Password' });
        }
        user.password = newPassword; // The pre-save hook in user.js will hash this
        await user.save();
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /voters - Fetch all voters (Admin Only)
router.get('/voters', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.userData.id))) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const voters = await User.find({ role: 'voter' }, '-password');
        res.status(200).json({ voters });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /voters/download - Download voter list as CSV (Admin Only)
router.get('/voters/download', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.userData.id))) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const voters = await User.find({ role: 'voter' }).select('name email aadharcardNumber mobile age isvoted').lean();
        
        if (voters.length === 0) {
            return res.status(404).send('No voter data to export.');
        }

        const fields = ['name', 'email', 'aadharcardNumber', 'mobile', 'age', 'isvoted'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(voters);

        res.header('Content-Type', 'text/csv');
        res.attachment("voters-list.csv");
        return res.send(csv);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error during file export.' });
    }
});

module.exports = router;