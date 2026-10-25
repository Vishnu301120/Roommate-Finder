const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  updateReportStatus,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, createReport);
router.get('/', protect, adminOnly, getAllReports);
router.put('/:id', protect, adminOnly, updateReportStatus);

module.exports = router;
