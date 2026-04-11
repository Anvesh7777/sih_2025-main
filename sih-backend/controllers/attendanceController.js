const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const Student = require('../models/Students');
const Lecture = require('../models/Lecture');

/**
 * @desc Helper: Sync student attendance % and risk score
 */
const updateStudentRiskAndAttendance = async (studentId) => {
    const student = await Student.findById(studentId);
    if (!student) return;

    // 1. Calculate Attendance %
    if (student.totalClassesHeld > 0) {
        student.attendancePercentage = (student.classesAttended / student.totalClassesHeld) * 100;
    }

    // 2. Calculate Risk (40% Att, 40% CGPA, 20% Fees)
    const attRisk = 100 - student.attendancePercentage;
    const cgpaRisk = Math.max(0, (10 - (student.cgpa || 0)) * 10);
    const feeRisk = student.feesPaid ? 0 : 100;
    
    student.riskScore = Math.round((attRisk * 0.4) + (cgpaRisk * 0.4) + (feeRisk * 0.2));
    await student.save();
};

// @desc    Generate QR & Increment "Total Classes" for branch
// @route   POST /api/attendance/generate-qr
const generateQrToken = async (req, res) => {
  const { subject, durationInMinutes = 10 } = req.body;
  
  // Professional addition: Get branch from the admin's profile or request
  const branch = req.student.branch; 

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lecture = await Lecture.create({
      subject,
      branch,
      date: today,
      createdBy: req.student._id,
    });

    // Increment total classes for everyone in this branch (The "Absent" logic)
    await Student.updateMany(
        { branch: branch, role: 'student' },
        { $inc: { totalClassesHeld: 1 } }
    );

    // Update risk scores for everyone in branch because their % just dropped
    const branchStudents = await Student.find({ branch: branch, role: 'student' });
    for (const s of branchStudents) {
        await updateStudentRiskAndAttendance(s._id);
    }

    const qrToken = jwt.sign({ subject, branch, lectureId: lecture._id }, process.env.JWT_SECRET, {
      expiresIn: `${durationInMinutes}m`,
    });
    
    res.status(200).json({ qrToken, lectureId: lecture._id });
  } catch (error) {
    res.status(500).json({ message: 'Error generating session' });
  }
};

// @desc    Mark attendance by scanning QR
// @route   POST /api/attendance/mark
const markAttendance = async (req, res) => {
  const { qrToken } = req.body;
  if (!qrToken) return res.status(400).json({ message: 'QR Token is required' });

  try {
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    const existingAttendance = await Attendance.findOne({
      student: req.student._id,
      lecture: decoded.lectureId,
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already logged for this session.' });
    }

    await Attendance.create({
      student: req.student._id,
      lecture: decoded.lectureId,
      subject: decoded.subject,
      date: new Date().setHours(0,0,0,0),
      status: 'Present',
    });

    await Student.findByIdAndUpdate(req.student._id, { $inc: { classesAttended: 1 } });
    await updateStudentRiskAndAttendance(req.student._id);

    res.status(201).json({ message: `Successfully checked into ${decoded.subject}` });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// @desc    Get my attendance records
const getMyAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({ student: req.student._id }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin Reconciliation
const reconcileAttendance = async (req, res) => {
    const { lectureId } = req.body;
    try {
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found.' });
        
        const branchStudents = await Student.find({ branch: lecture.branch, role: 'student' });
        
        for (const s of branchStudents) {
            const record = await Attendance.findOne({ student: s._id, lecture: lectureId });
            if (!record) {
                await Attendance.create({
                    student: s._id,
                    lecture: lectureId,
                    subject: lecture.subject,
                    date: lecture.date,
                    status: 'Absent',
                });
                await updateStudentRiskAndAttendance(s._id);
            }
        }
        res.status(200).json({ message: `Reconciliation for ${lecture.subject} complete.` });
    } catch (error) {
        res.status(500).json({ message: 'Reconciliation error' });
    }
};

// @desc    Get all records for a date/subject
const getAllRecordsByDate = async (req, res) => {
    const { date, subject } = req.query;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    try {
        const records = await Attendance.find({
            date: { $gte: targetDate, $lt: nextDay },
            subject: subject,
        }).populate('student', 'name enrollmentNumber');
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all lectures for a specific date
const getLecturesByDate = async (req, res) => {
    const { date } = req.query;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    try {
        const lectures = await Lecture.find({ date: { $gte: targetDate, $lt: nextDay } });
        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { 
    generateQrToken, 
    markAttendance, 
    getMyAttendance, 
    reconcileAttendance, 
    getAllRecordsByDate,
    getLecturesByDate
};