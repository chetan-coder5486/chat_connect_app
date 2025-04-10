import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// Generate random 6-digit code
function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create Room
router.post('/create', async (req, res) => {
  let code;
  let room;

  do {
    code = generateRoomCode();
    const existing = await Room.findOne({ roomCode: code });
    if (!existing) {
      room = new Room({ roomCode: code, messages: [] });
      await room.save();
    }
  } while (!room);

  res.status(201).json({ roomCode: code });
});

// Join Room
router.get('/join/:code', async (req, res) => {
  const { code } = req.params;
  const room = await Room.findOne({ roomCode: code });

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  res.status(200).json({ roomCode: room.roomCode });
});

export default router;
