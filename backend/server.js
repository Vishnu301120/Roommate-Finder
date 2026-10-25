require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const connectDB = require('./config/db');
const Message = require('./models/Message');

// Route imports
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Pass io to express app so controllers can access via req.app.get('io')
app.set('io', io);

// Global Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), app: 'Roommate Finder API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io Real-Time Event Handlers
const onlineUsers = new Map(); // userId -> Set of socketIds

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // User registers their online presence
  socket.on('register_user', (userId) => {
    if (!userId) return;
    socket.userId = userId;
    socket.join(userId);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast updated list of online user IDs
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // User joins a specific conversation channel
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Handle incoming real-time message
  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, content } = data;
      if (!senderId || !receiverId || !content) return;

      const conversationId = Message.getConversationId(senderId, receiverId);

      const newMsg = new Message({
        conversationId,
        sender: senderId,
        receiver: receiverId,
        content: content.trim(),
      });

      const savedMsg = await newMsg.save();
      const populatedMsg = await savedMsg.populate([
        { path: 'sender', select: 'name avatar' },
        { path: 'receiver', select: 'name avatar' },
      ]);

      // Emit to receiver's private room and conversation room
      io.to(receiverId).emit('receive_message', populatedMsg);
      io.to(conversationId).emit('receive_message', populatedMsg);

      // Confirm back to sender
      socket.emit('message_sent', populatedMsg);
    } catch (err) {
      console.error('Socket send_message error:', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicators
  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('user_typing', { userId: senderId });
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('user_stop_typing', { userId: senderId });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.userId && onlineUsers.has(socket.userId)) {
      const userSockets = onlineUsers.get(socket.userId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(socket.userId);
      }
      io.emit('online_users', Array.from(onlineUsers.keys()));
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot find ${req.originalUrl} on this server` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Roommate Finder Server running on port ${PORT}`);
});
