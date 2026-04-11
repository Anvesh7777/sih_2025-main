const jwt = require('jsonwebtoken');
const Student = require('../models/Students');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.student = await Student.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token invalid' });
    }
  }
  if (!token) res.status(401).json({ message: 'No token' });
};

const isAdmin = (req, res, next) => {
  if (req.student && req.student.role === 'admin') next();
  else res.status(403).json({ message: 'Admin access only' });
};

module.exports = { protect, isAdmin };
