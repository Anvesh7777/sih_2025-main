// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['E-Book', 'Notes', 'Video'], required: true },
  subject: { type: String, required: true },
  link: { type: String }, // For external links like YouTube videos
  filePath: { type: String }, // Cloudinary URL for the uploaded PDF/file
  thumbnailPath: { type: String }, // Cloudinary URL for the cover image
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;