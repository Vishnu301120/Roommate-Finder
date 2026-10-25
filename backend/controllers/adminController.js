const User = require('../models/User');
const Listing = require('../models/Listing');
const Report = require('../models/Report');
const MatchRequest = require('../models/MatchRequest');
const Message = require('../models/Message');

// @desc   Get admin dashboard statistics
// @route  GET /api/admin/stats
// @access Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    const totalMatches = await MatchRequest.countDocuments({ status: 'accepted' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const totalMessages = await Message.countDocuments();

    // Top cities distribution
    const cityAgg = await Listing.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalUsers,
      totalListings,
      activeListings,
      totalMatches,
      pendingReports,
      totalMessages,
      cityDistribution: cityAgg,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all users for admin management
// @route  GET /api/admin/users
// @access Private/Admin
const getAllUsersAdmin = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      const regex = { $regex: search, $options: 'i' };
      query.$or = [{ name: regex }, { email: regex }, { city: regex }];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Toggle user ban status
// @route  PUT /api/admin/users/:id/ban
// @access Private/Admin
const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot ban an admin user' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      user: { _id: user._id, name: user.name, isBanned: user.isBanned },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Toggle user verified badge
// @route  PUT /api/admin/users/:id/verify
// @access Private/Admin
const toggleUserVerify = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({
      message: `User verification status set to ${user.isVerified}`,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin delete listing
// @route  DELETE /api/admin/listings/:id
// @access Private/Admin
const deleteListingAdmin = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsersAdmin,
  toggleUserBan,
  toggleUserVerify,
  deleteListingAdmin,
};
