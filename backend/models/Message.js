import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  username: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
