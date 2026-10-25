const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  uploadListingPhotos,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getListings);
router.get('/my/listings', protect, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/upload', protect, upload.array('photos', 6), uploadListingPhotos);

module.exports = router;
