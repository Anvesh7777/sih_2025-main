const express = require('express');
const router = express.Router();
const { getAllResources, createResource } = require('../controllers/resourceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Route to get all resources for a logged-in user
router.route('/').get(protect, getAllResources);

// Route for admins to upload a new resource with files
router.route('/upload').post(
    protect, 
    isAdmin, 
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'file', maxCount: 1 }]), 
    createResource
);

module.exports = router;