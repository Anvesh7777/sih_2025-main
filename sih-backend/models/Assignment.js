const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  branch: { type: String, required: true }, // e.g., 'CS', 'IT'
  dueDate: { type: Date, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' } // Admin ref
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);