const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_roommatefinder2026_modernmern');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found or account deactivated' });
      }

      if (user.isBanned) {
        return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_roommatefinder2026_modernmern');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore token failure for optional authentication
      req.user = null;
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
