const express = require('express');
const router = express.Router();
const {
  createReview,
  getListingReviews,
  getUserReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/listing/:id', getListingReviews);
router.get('/user/:id', getUserReviews);

module.exports = router;
