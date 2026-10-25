const express = require('express');
const router = express.Router();
const {
  getRoommateProfiles,
  getUserProfileById,
} = require('../controllers/userController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/roommates', optionalAuth, getRoommateProfiles);
router.get('/:id', optionalAuth, getUserProfileById);

module.exports = router;
