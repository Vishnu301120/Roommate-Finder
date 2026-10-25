const Report = require('../models/Report');

// @desc   Submit a report for a user or listing
// @route  POST /api/reports
// @access Private
const createReport = async (req, res) => {
  try {
    const { targetType, targetUserId, targetListingId, reason, description } = req.body;

    if (!targetType || !reason || !description) {
      return res.status(400).json({ message: 'Target type, reason, and description are required' });
    }

    const report = new Report({
      reporter: req.user._id,
      targetType,
      targetUser: targetUserId || null,
      targetListing: targetListingId || null,
      reason,
      description,
    });

    const saved = await report.save();
    res.status(201).json({ message: 'Report submitted successfully. Our safety team will review it.', report: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all reports (Admin only)
// @route  GET /api/reports
// @access Private/Admin
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email avatar')
      .populate('targetUser', 'name email avatar isBanned')
      .populate('targetListing', 'title city locality rent')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update report status (Admin only)
// @route  PUT /api/reports/:id
// @access Private/Admin
const updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    const updated = await report.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  updateReportStatus,
};
