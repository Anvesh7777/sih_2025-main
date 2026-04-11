const Result = require('../models/Result');

const gradeToPoints = (grade) => {
  const gradeMap = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
  return gradeMap[grade.toUpperCase()] || 0;
};

const addResult = async (req, res) => {
  const { studentId, semester, subjects } = req.body;
  if (!studentId || !semester || !subjects || subjects.length === 0) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }
  try {
    let totalCredits = 0;
    let weightedPoints = 0;
    subjects.forEach(sub => {
      totalCredits += sub.credits;
      weightedPoints += gradeToPoints(sub.grade) * sub.credits;
    });
    const sgpa = totalCredits > 0 ? (weightedPoints / totalCredits) : 0;
    const result = await Result.create({
      student: studentId,
      semester,
      subjects,
      sgpa: sgpa.toFixed(2),
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.student._id }).sort({ semester: 1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addResult, getMyResults };