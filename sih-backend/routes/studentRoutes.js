const express = require('express');
const router = express.Router();

const { 
    registerStudent, 
    loginStudent, 
    getStudentProfile,
    updateStudentProfile,
    getHighRiskStudents,
    sendRiskAlert,
    getAdminStats
} = require('../controllers/studentController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Admin Only
router.route('/high-risk').get(protect, isAdmin, getHighRiskStudents);
router.route('/:id/send-risk-alert').post(protect, isAdmin, sendRiskAlert);

// Shared/Protected
router.route('/profile')
    .get(protect, getStudentProfile)
    .put(protect, updateStudentProfile);

router.get('/admin-stats', protect, isAdmin, getHighRiskStudents); // Use your existing high-risk or create a new stats one

module.exports = router;