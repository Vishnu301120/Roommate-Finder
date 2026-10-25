const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['user', 'listing'],
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    targetListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      default: null,
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for reporting'],
      enum: [
        'Fake Profile or Listing',
        'Scam or Fraudulent Activity',
        'Harassment or Offensive Behavior',
        'Inappropriate Photos or Content',
        'Incorrect Pricing or Location',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed information for your report'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
