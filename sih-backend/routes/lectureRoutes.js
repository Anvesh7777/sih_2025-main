// routes/lectureRoutes.js
const express = require('express');
const router = express.Router();
const { getLecturesByDate } = require('../controllers/lectureController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, isAdmin, getLecturesByDate);

module.exports = router;