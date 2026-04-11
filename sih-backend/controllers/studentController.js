const Student = require('../models/Students');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailService');

/**
 * @desc Helper Function: Calculate Dynamic Risk Score
 */
const calculateRisk = (student) => {
    const attRisk = 100 - (student.attendancePercentage || 0);
    const cgpaRisk = Math.max(0, (10 - (student.cgpa || 0)) * 10);
    const asgnRate = student.totalAssignments > 0 
        ? (student.assignmentsCompleted / student.totalAssignments) 
        : 1;
    const asgnRisk = (1 - asgnRate) * 100;
    const feeRisk = student.feesPaid ? 0 : 100;

    const totalScore = (attRisk * 0.4) + (cgpaRisk * 0.3) + (asgnRisk * 0.2) + (feeRisk * 0.1);
    return Math.min(100, Math.round(totalScore));
};

// Helper to generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register Student
const registerStudent = async (req, res) => {
    const { name, email, password, enrollmentNumber, branch } = req.body;
    try {
        const studentExists = await Student.findOne({ $or: [{ email }, { enrollmentNumber }] });
        if (studentExists) return res.status(400).json({ message: 'User already exists' });

        const student = await Student.create({ name, email, password, enrollmentNumber, branch });
        res.status(201).json({
            _id: student._id,
            name: student.name,
            role: student.role,
            token: generateToken(student._id, student.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// @desc    Login Student
const loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (student && (await student.matchPassword(password))) {
            res.json({
                _id: student._id,
                name: student.name,
                role: student.role,
                token: generateToken(student._id, student.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login Error' });
    }
};

// @desc    Get Profile + Update Risk Score
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student._id).select('-password');
        if (student) {
            student.riskScore = calculateRisk(student);
            await student.save();
            res.json(student);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Fetch error' });
    }
};

/**
 * @desc    Update student profile (Added this back to fix the crash!)
 */
const updateStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student._id);
        if (student) {
            student.name = req.body.name || student.name;
            student.branch = req.body.branch || student.branch;
            
            // Recalculate risk with new data
            student.riskScore = calculateRisk(student);
            const updatedStudent = await student.save();
            
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};

// @desc    Admin: Get High Risk Students
const getHighRiskStudents = async (req, res) => {
    try {
        const { search, branch } = req.query;
        let query = { role: 'student' };
        if (search) {
            query.$or = [{ name: { $regex: search, $options: 'i' } }, { enrollmentNumber: { $regex: search, $options: 'i' } }];
        }
        if (branch && branch !== 'All') query.branch = branch;

        const students = await Student.find(query).select('-password');
        const list = students.map(s => ({ ...s._doc, riskScore: calculateRisk(s) }))
                             .sort((a,b) => b.riskScore - a.riskScore);
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin: Send alert to student
const sendRiskAlert = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Not found' });

        const risk = calculateRisk(student);
        const msg = `Urgent: Your academic risk is ${risk}%. Please contact support.`;

        await Notification.create({ user: student._id, message: msg, link: '/dashboard/profile' });
        res.json({ message: `Alert sent to ${student.name}` });
    } catch (error) {
        res.status(500).json({ message: 'Alert failed' });
    }
};

// @desc    Get Institutional Stats for Admin Dashboard
// @route   GET /api/students/admin-stats
const getAdminStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ role: 'student' });
        const highRiskCount = await Student.countDocuments({ role: 'student', riskScore: { $gt: 50 } });
        
        // Calculate average attendance across college
        const students = await Student.find({ role: 'student' });
        const avgAttendance = students.length > 0 
            ? (students.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / students.length).toFixed(1)
            : 0;

        res.json({
            totalStudents,
            highRiskCount,
            avgAttendance,
            activeLectures: 5 // Static for demo or count from Lecture model
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching stats' });
    }
};

// Add getAdminStats to your module.exports at the bottom!

// Exporting ALL 6 functions now
module.exports = { 
    registerStudent, 
    loginStudent, 
    getStudentProfile, 
    updateStudentProfile, 
    getHighRiskStudents, 
    sendRiskAlert,
    getAdminStats
};