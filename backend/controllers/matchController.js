const MatchRequest = require('../models/MatchRequest');
const User = require('../models/User');

// @desc   Send a roommate match / connect request
// @route  POST /api/matches
// @access Private
const sendMatchRequest = async (req, res) => {
  try {
    const { receiverId, listingId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a roommate request to yourself' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if an existing request already exists
    const existing = await MatchRequest.findOne({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ message: 'You are already connected with this user!' });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ message: 'A request is already pending with this user.' });
      }
      // If previously rejected, allow re-requesting
      existing.status = 'pending';
      existing.sender = req.user._id;
      existing.receiver = receiverId;
      existing.message = message || existing.message;
      if (listingId) existing.listing = listingId;
      await existing.save();
      const populated = await existing.populate('receiver', 'name avatar occupation city');
      return res.json(populated);
    }

    const request = new MatchRequest({
      sender: req.user._id,
      receiver: receiverId,
      listing: listingId || null,
      message: message || 'Hi! I saw your profile/listing and would love to connect!',
    });

    const saved = await request.save();
    const populated = await saved.populate([
      { path: 'receiver', select: 'name avatar occupation city email phone' },
      { path: 'listing', select: 'title rent locality city' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get received match requests
// @route  GET /api/matches/received
// @access Private
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await MatchRequest.find({ receiver: req.user._id })
      .populate('sender', 'name avatar gender occupation city locality budgetMin budgetMax lifestyle bio phone email')
      .populate('listing', 'title rent roomType locality city photos')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get sent match requests
// @route  GET /api/matches/sent
// @access Private
const getSentRequests = async (req, res) => {
  try {
    const requests = await MatchRequest.find({ sender: req.user._id })
      .populate('receiver', 'name avatar gender occupation city locality budgetMin budgetMax lifestyle bio phone email')
      .populate('listing', 'title rent roomType locality city photos')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Accept or Reject a match request
// @route  PUT /api/matches/:id/status
// @access Private
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either accepted or rejected' });
    }

    const request = await MatchRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only receiver can accept or reject
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    request.status = status;
    const updated = await request.save();

    const populated = await updated.populate([
      { path: 'sender', select: 'name avatar gender occupation city bio phone email' },
      { path: 'receiver', select: 'name avatar gender occupation city bio phone email' },
      { path: 'listing', select: 'title rent locality city' },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all accepted connections (mutual roommates/matches)
// @route  GET /api/matches/connections
// @access Private
const getMyConnections = async (req, res) => {
  try {
    const acceptedRequests = await MatchRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: 'accepted',
    })
      .populate('sender', 'name avatar gender occupation city locality bio phone email isVerified')
      .populate('receiver', 'name avatar gender occupation city locality bio phone email isVerified')
      .populate('listing', 'title rent roomType locality city photos')
      .sort({ updatedAt: -1 });

    // Map to connected user objects
    const connections = acceptedRequests.map((reqItem) => {
      const isSender = reqItem.sender._id.toString() === req.user._id.toString();
      const connectedUser = isSender ? reqItem.receiver : reqItem.sender;
      return {
        requestId: reqItem._id,
        connection: connectedUser,
        listing: reqItem.listing,
        connectedAt: reqItem.updatedAt,
      };
    });

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMatchRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  getMyConnections,
};
