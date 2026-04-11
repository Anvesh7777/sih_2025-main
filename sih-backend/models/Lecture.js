const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  branch: { type: String, required: true }, // Added branch to target specific students
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' }
}, { timestamps: true });

const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;