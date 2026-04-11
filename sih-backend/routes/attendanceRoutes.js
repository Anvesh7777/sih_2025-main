const express = require('express');
const router = express.Router();
const { 
    generateQrToken, 
    markAttendance, 
    getMyAttendance, 
    reconcileAttendance, 
    getAllRecordsByDate, 
    getLecturesByDate 
} = require('../controllers/attendanceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- Admin Only Routes ---
// These require a valid token AND the 'admin' role
router.post('/generate-qr', protect, isAdmin, generateQrToken);
router.post('/reconcile', protect, isAdmin, reconcileAttendance);
router.get('/all', protect, isAdmin, getAllRecordsByDate);
router.get('/lectures', protect, isAdmin, getLecturesByDate);

// --- Student Only Routes ---
// These only require a valid token
router.post('/mark', protect, markAttendance);
router.get('/my-attendance', protect, getMyAttendance);

module.exports = router;