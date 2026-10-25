const mongoose = require('mongoose');

const matchRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      default: null,
    },
    message: {
      type: String,
      default: 'Hi! I saw your profile/listing and would love to connect to see if we would be a great roommate match!',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending requests between same sender and receiver
matchRequestSchema.index({ sender: 1, receiver: 1, listing: 1 }, { unique: true });

const MatchRequest = mongoose.model('MatchRequest', matchRequestSchema);
module.exports = MatchRequest;
