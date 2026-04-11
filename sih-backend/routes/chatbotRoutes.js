// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const { askChatbot } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// Protected route for the chatbot
router.route('/ask').post(protect, askChatbot);

module.exports = router;