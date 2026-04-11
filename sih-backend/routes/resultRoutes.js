// routes/resultRoutes.js
const express = require('express');
const router = express.Router();
const { addResult, getMyResults } = require('../controllers/resultController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Admin Only Route: To add a new result for a student
router.route('/add').post(protect, isAdmin, addResult);

// Student Only Route: To get their own results
router.route('/my-results').get(protect, getMyResults);

module.exports = router;