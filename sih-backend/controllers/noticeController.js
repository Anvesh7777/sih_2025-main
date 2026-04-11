const Notice = require('../models/Notice');

const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createNotice = async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  try {
    const notice = new Notice({
      title,
      content,
      category,
      author: req.student.name,
    });
    const createdNotice = await notice.save();
    res.status(201).json(createdNotice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAllNotices, createNotice };