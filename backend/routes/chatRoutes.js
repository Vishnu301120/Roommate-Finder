const express = require('express');
const router = express.Router();
const {
  getConversationMessages,
  sendMessage,
  getChatThreads,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/threads', getChatThreads);
router.get('/:targetUserId', getConversationMessages);
router.post('/', sendMessage);

module.exports = router;
