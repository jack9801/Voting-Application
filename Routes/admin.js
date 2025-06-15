// backend/routes/admin.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Party = require('./../model/party');
const Candidate=require('./../model/candidate')
const User = require('./../model/user');
const { jwtAuthMiddleware } = require('../jwt');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

const checkAdminRole = async (userId) => {
  const user = await User.findById(userId);
  return user?.role === 'Admin';
};

router.post('/party', jwtAuthMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const userId = req.user.userData.id;
    if (!(await checkAdminRole(userId))) {
      return res.status(403).json({ message: 'Only admin can create party' });
    }
    const { name, colorTheme, startTime, endTime } = req.body;
    const logo = req.file?.filename;
    const party = new Party({ name, colorTheme, startTime, endTime, logo });
    await party.save();
    res.status(201).json({ message: 'Party created', data: party });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create party' });
  }
});

router.post('/candidate', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.userData.id;
    if (!(await checkAdminRole(userId))) {
      return res.status(403).json({ message: 'Only admin can create candidate' });
    }
    const { name, age, party } = req.body;
    const candidate = new Candidate({ name, age, party });
    await candidate.save();
    res.status(201).json({ message: 'Candidate created', data: candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create candidate' });
  }
});

module.exports = router;
