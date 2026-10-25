const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsersAdmin,
  toggleUserBan,
  toggleUserVerify,
  deleteListingAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/ban', toggleUserBan);
router.put('/users/:id/verify', toggleUserVerify);
router.delete('/listings/:id', deleteListingAdmin);

module.exports = router;
