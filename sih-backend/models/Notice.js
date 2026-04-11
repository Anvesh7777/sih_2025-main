// models/Notice.js

const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Event', 'Scholarship', 'Exam', 'General'], // Sirf in categories mein se ek ho sakti hai
    default: 'General',
  },
  author: {
    type: String, // Hum yahan admin/teacher ka naam store kar sakte hain
    required: true,
  }
}, {
  timestamps: true, // Notice kab bani, yeh automatically add ho jayega
});

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;