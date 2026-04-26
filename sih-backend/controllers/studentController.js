const axios = require('axios');
const Student = require('../models/Students');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailService');
// const Assignment = require('../models/Assignment');

/**
 * @desc Helper Function: Calculate Dynamic Risk Score (Pre-ML Version)
 * Attendance: 30% | CGPA: 30% | Backlogs: 20% | Assignments: 10% | Fees: 10%
 */
const calculateRisk = (student) => {
    // 1. Attendance Risk (30%)
    const attRisk = 100 - (student.attendancePercentage || 0);

    // 2. Academic Performance Risk (30%)
    // CGPA 10 = 0% risk, CGPA 0 = 100% risk
    const cgpaRisk = Math.max(0, (10 - (student.cgpa || 0)) * 10);

    // 3. Backlog Risk (20%)
    // 1 backlog = 25% backlog risk, 4+ backlogs = 100% backlog risk
    const backlogRisk = Math.min(100, (student.backlogs || 0) * 25);

    // 4. Assignment Engagement Risk (10%)
    const asgnRate = student.totalAssignments > 0 
        ? (student.assignmentsCompleted / student.totalAssignments) 
        : 1;
    const asgnRisk = (1 - asgnRate) * 100;

    // 5. Financial Risk (10%)
    const feeRisk = student.feesPaid ? 0 : 100;

    // Weighted Formula
    const totalScore = (attRisk * 0.3) + (cgpaRisk * 0.3) + (backlogRisk * 0.2) + (asgnRisk * 0.1) + (feeRisk * 0.1);
    
    return Math.min(100, Math.round(totalScore));
};

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
            res.status(401).json({ message: 'Invalid credentials' });
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
            // --- ML API CALL ---
            try {
                const mlResponse = await axios.post('http://localhost:5001/predict', {
                    attendance: student.attendancePercentage,
                    cgpa: student.cgpa,
                    backlogs: student.backlogs,
                    assignments: Math.round((student.assignmentsCompleted / student.totalAssignments) * 100) || 0,
                    fees_paid: student.feesPaid ? 1 : 0
                });

                // ML se aaya hua real score use karo
                student.riskScore = mlResponse.data.ml_risk_score;
                await student.save();
            } catch (mlErr) {
                console.log("ML Service Down, using fallback logic");
                // Agar Python server band hai, toh purana formula use karega
                student.riskScore = calculateRisk(student); 
            }

            res.json(student);
        }
    } catch (error) {
        res.status(500).json({ message: 'Fetch error' });
    }
};

// @desc    Update Student Profile (Used for adding CGPA, Backlogs, etc.)
const updateStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student._id);
        if (student) {
            student.name = req.body.name || student.name;
            student.branch = req.body.branch || student.branch;
            student.cgpa = req.body.cgpa !== undefined ? req.body.cgpa : student.cgpa;
            student.backlogs = req.body.backlogs !== undefined ? req.body.backlogs : student.backlogs;
            student.feesPaid = req.body.feesPaid !== undefined ? req.body.feesPaid : student.feesPaid;
            student.assignmentsCompleted = req.body.assignmentsCompleted !== undefined ? req.body.assignmentsCompleted : student.assignmentsCompleted;
            student.totalAssignments = req.body.totalAssignments !== undefined ? req.body.totalAssignments : student.totalAssignments;

            student.riskScore = calculateRisk(student);
            const updated = await student.save();
            res.json(updated);
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

const sendRiskAlert = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Abhi ke liye sirf response bhej rahe hain
        // Yahan aap apna email service call kar sakte ho (sendEmail)
        res.json({ message: `Alert sent to ${student.name} successfully!` });
    } catch (error) {
        res.status(500).json({ message: 'Error sending alert' });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ role: 'student' });
        const highRiskStudents = await Student.countDocuments({ 
            role: 'student', 
            riskScore: { $gt: 50 } 
        });

        res.json({
            totalStudents,
            highRiskStudents,
            averageAttendance: 85, // Static placeholder for now
            activeSessions: 4
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};





// ... (register, login, getProfile code remains same)

// @desc    Admin: Update Student Academics (CGPA & Backlogs)
// const updateStudentAcademics = async (req, res) => {
//     try {
//         const { studentId, cgpa, backlogs } = req.body;
//         const student = await Student.findById(req.params.id || studentId);
        
//         if (!student) return res.status(404).json({ message: 'Student not found' });

//         student.cgpa = cgpa !== undefined ? cgpa : student.cgpa;
//         student.backlogs = backlogs !== undefined ? backlogs : student.backlogs;
        
//         // ML score update after academic change
//         const updated = await student.save();
//         res.json({ message: "Academic records updated!", student: updated });
//     } catch (error) {
//         res.status(500).json({ message: 'Update failed', error: error.message });
//     }
// };

// @desc    Admin: Publish New Assignment to a Branch
// const postAssignment = async (req, res) => {
//     try {
//         const { branch, title } = req.body;
//         // Logic: Is branch ke saare students ka 'totalAssignments' count +1 kar do
//         const result = await Student.updateMany(
//             { branch: branch, role: 'student' },
//             { $inc: { totalAssignments: 1 } }
//         );
//         res.json({ message: `Assignment "${title}" published to ${branch} branch.`, affected: result.modifiedCount });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to publish assignment' });
//     }
// };

// @desc    Student: Mark Assignment as Completed
// const submitAssignment = async (req, res) => {
//     try {
//         const student = await Student.findById(req.student._id);
//         if (student.assignmentsCompleted < student.totalAssignments) {
//             student.assignmentsCompleted += 1;
//             await student.save();
//             res.json({ message: "Task completed!", completed: student.assignmentsCompleted });
//         } else {
//             res.status(400).json({ message: "All assignments already completed!" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Submission failed' });
//     }
// };

// Existing module.exports mein naye functions add karo


// controllers/studentController.js ke ekdum niche dekho
module.exports = { 
    registerStudent, 
    loginStudent, 
    getStudentProfile, 
    updateStudentProfile, 
    getHighRiskStudents,
    calculateRisk,
    getAdminStats,
    sendRiskAlert,
    // postAssignment,
    // submitAssignment,
    // updateStudentAcademics

};