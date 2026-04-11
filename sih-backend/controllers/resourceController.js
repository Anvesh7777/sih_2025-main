const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find({}).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a new resource
// @route   POST /api/resources/upload
// @access  Private/Admin
const createResource = async (req, res) => {
    const { title, description, category, subject, link } = req.body;
    
    // Check if files were uploaded. req.files will be an object.
    const thumbnail = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;
    const file = req.files && req.files.file ? req.files.file[0] : null;

    if (!title || !description || !category || !subject) {
        return res.status(400).json({ message: "Please fill all required text fields." });
    }

    try {
        const newResource = new Resource({
            title,
            description,
            category,
            subject,
            link: link || '',
            thumbnailPath: thumbnail ? thumbnail.path : '', // URL from Cloudinary
            filePath: file ? file.path : '', // URL from Cloudinary
            uploadedBy: req.student._id,
        });

        const savedResource = await newResource.save();
        res.status(201).json(savedResource);
    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ message: "Server Error while creating resource" });
    }
};

module.exports = { getAllResources, createResource };