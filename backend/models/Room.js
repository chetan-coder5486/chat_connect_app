import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  username: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, unique: true },
  messages: [messageSchema]
});

export default mongoose.model('Room', roomSchema);
