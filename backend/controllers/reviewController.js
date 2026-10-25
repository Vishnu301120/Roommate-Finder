const Review = require('../models/Review');

// @desc   Create a review for a user or listing
// @route  POST /api/reviews
// @access Private
const createReview = async (req, res) => {
  try {
    const { targetUserId, targetListingId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    if (!targetUserId && !targetListingId) {
      return res.status(400).json({ message: 'Target user or target listing ID must be provided' });
    }

    if (targetUserId && targetUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    const review = new Review({
      reviewer: req.user._id,
      targetUser: targetUserId || null,
      targetListing: targetListingId || null,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const saved = await review.save();
    const populated = await saved.populate('reviewer', 'name avatar city');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get reviews for a listing
// @route  GET /api/reviews/listing/:id
// @access Public
const getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ targetListing: req.params.id })
      .populate('reviewer', 'name avatar city')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
      reviews,
      count: reviews.length,
      averageRating: Number(avgRating),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get reviews for a user
// @route  GET /api/reviews/user/:id
// @access Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ targetUser: req.params.id })
      .populate('reviewer', 'name avatar city')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
      reviews,
      count: reviews.length,
      averageRating: Number(avgRating),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getListingReviews,
  getUserReviews,
};
