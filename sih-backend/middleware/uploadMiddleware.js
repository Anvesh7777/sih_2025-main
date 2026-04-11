const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // This function runs for each uploaded file
    let folderName = 'sih_resources/others';
    let resourceType = 'raw';

    // Check file mimetype to set folder and resource type
    if (file.mimetype.startsWith('image/')) {
      folderName = 'sih_resources/images';
      resourceType = 'image';
    } else if (file.mimetype === 'application/pdf') {
      folderName = 'sih_resources/pdfs';
      resourceType = 'raw';
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      // public_id: file.originalname, // Optional: use original filename
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;