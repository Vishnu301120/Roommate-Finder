const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  uploadAvatar,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateUserProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
