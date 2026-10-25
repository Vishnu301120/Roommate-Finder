const express = require('express');
const router = express.Router();
const {
  sendMatchRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  getMyConnections,
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All match routes require authentication

router.post('/', sendMatchRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.put('/:id/status', updateRequestStatus);
router.get('/connections', getMyConnections);

module.exports = router;
