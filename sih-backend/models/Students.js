const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  role: { type: String, default: 'student' }, // student or admin

  // --- ACADEMIC FACTORS FOR ML ---
  cgpa: { type: Number, default: 0 },
  backlogs: { type: Number, default: 0 },
  attendancePercentage: { type: Number, default: 100 },
  
  // --- ENGAGEMENT FACTORS ---
  totalAssignments: { type: Number, default: 0 },
  assignmentsCompleted: { type: Number, default: 0 },
  
  // --- ADMINISTRATIVE FACTORS ---
  feesPaid: { type: Boolean, default: true },
  
  // --- RISK ANALYTICS ---
  riskScore: { type: Number, default: 0 },
  lastRiskUpdate: { type: Date, default: Date.now }
}, { timestamps: true });

// Password hashing
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password verification
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);