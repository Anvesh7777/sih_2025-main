// models/Result.js
const mongoose = require('mongoose');

// Schema for a single subject's result
const subjectResultSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  grade: { type: String, required: true },
  credits: { type: Number, required: true },
});

// Main schema for a semester's result
const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student',
  },
  semester: {
    type: Number,
    required: true,
  },
  subjects: [subjectResultSchema], // Array of subject results
  sgpa: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;