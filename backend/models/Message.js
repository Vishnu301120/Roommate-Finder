const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
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
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helper function to generate conversationId from two user IDs consistently
messageSchema.statics.getConversationId = function (userId1, userId2) {
  const sorted = [userId1.toString(), userId2.toString()].sort();
  return `${sorted[0]}_${sorted[1]}`;
};

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
