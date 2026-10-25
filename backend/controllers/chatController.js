const Message = require('../models/Message');
const User = require('../models/User');

// @desc   Get message history between current user and target user
// @route  GET /api/chat/:targetUserId
// @access Private
const getConversationMessages = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const conversationId = Message.getConversationId(req.user._id, targetUserId);

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages sent to me as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Send a chat message (REST endpoint alongside Socket.io)
// @route  POST /api/chat
// @access Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content || !content.trim()) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const conversationId = Message.getConversationId(req.user._id, receiverId);

    const message = new Message({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim(),
    });

    const saved = await message.save();
    const populated = await saved.populate([
      { path: 'sender', select: 'name avatar' },
      { path: 'receiver', select: 'name avatar' },
    ]);

    // If socket.io instance is available on app, emit event
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId.toString()).emit('receive_message', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get active chat threads / recent conversations
// @route  GET /api/chat/threads
// @access Private
const getChatThreads = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar city occupation')
      .populate('receiver', 'name avatar city occupation');

    // Group by conversation partner
    const threadMap = new Map();

    messages.forEach((msg) => {
      const partner =
        msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      const partnerId = partner._id.toString();

      if (!threadMap.has(partnerId)) {
        threadMap.set(partnerId, {
          partner,
          lastMessage: msg,
          unreadCount: msg.receiver._id.toString() === userId.toString() && !msg.isRead ? 1 : 0,
        });
      } else {
        if (msg.receiver._id.toString() === userId.toString() && !msg.isRead) {
          const thread = threadMap.get(partnerId);
          thread.unreadCount += 1;
        }
      }
    });

    res.json(Array.from(threadMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversationMessages,
  sendMessage,
  getChatThreads,
};
