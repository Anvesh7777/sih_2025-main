// routes/noticeRoutes.js

const express = require('express');
const router = express.Router();
const { getAllNotices, createNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

// Sabke liye public route - saare notices fetch karne ke liye
router.route('/').get(getAllNotices);

// Sirf logged-in user ke liye protected route - naya notice banane ke liye
router.route('/create').post(protect, createNotice);

module.exports = router;