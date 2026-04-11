// controllers/chatbotController.js
const { getHfResponse } = require('../utils/huggingfaceService');

const askChatbot = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Message is required.' });
    }
    try {
        const reply = await getHfResponse(message);
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ message: "An error occurred in the chatbot." });
    }
};

module.exports = { askChatbot };