const express = require('express');
const router = express.Router();

// Controller functions ko destructure karke import karo
const { 
    registerStudent, 
    loginStudent, 
    getStudentProfile,
    updateStudentProfile,
    getHighRiskStudents,
    sendRiskAlert,
    getAdminStats
} = require('../controllers/studentController');

// Middleware imports
const { protect, isAdmin } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/students/register
 * @desc    Public route for student registration
 */
router.post('/register', registerStudent);

/**
 * @route   POST /api/students/login
 * @desc    Public route for student/admin login
 */
router.post('/login', loginStudent);

/**
 * @route   GET /api/students/profile
 * @route   PUT /api/students/update
 * @desc    Protected routes for authenticated users (Student/Admin)
 */
router.get('/profile', protect, getStudentProfile);
router.put('/update', protect, updateStudentProfile);

/**
 * @route   GET /api/students/high-risk
 * @desc    Admin only: Get list of students sorted by risk score
 */
router.get('/high-risk', protect, isAdmin, getHighRiskStudents);

/**
 * @route   GET /api/students/admin-stats
 * @desc    Admin only: Get aggregate institutional data for dashboard cards
 */
router.get('/admin-stats', protect, isAdmin, getAdminStats);

/**
 * @route   POST /api/students/:id/send-risk-alert
 * @desc    Admin only: Trigger an alert email to a specific student
 */
router.post('/:id/send-risk-alert', protect, isAdmin, sendRiskAlert);

module.exports = router;