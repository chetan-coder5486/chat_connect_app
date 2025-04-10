import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import roomRoutes from './routes/rooms.js';
import Room from './models/Room.js'; // for storing chat messages

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*', // allow all origins
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/rooms', roomRoutes);

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('🔌 A user connected');

// ✅ NEW JOIN ROOM CODE WITH CHECK
socket.on('join-room', async (roomCode) => {
  const room = await Room.findOne({ roomCode });

  if (room) {
    socket.join(roomCode);
    console.log(`👥 Joined room: ${roomCode}`);
    socket.emit('room-joined', roomCode);
  } else {
    console.log(`❌ Room not found: ${roomCode}`);
    socket.emit('error-room-not-found', roomCode);
  }
});

  // Handle message
  socket.on('chat-message', async ({ roomCode, username, content }) => {
    const message = { username, content, timestamp: new Date() };

    // Save to DB
    await Room.findOneAndUpdate(
      { roomCode },
      { $push: { messages: message } }
    );

    // Send to everyone in room
    io.to(roomCode).emit('chat-message', message);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
});

// Start server
httpServer.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
