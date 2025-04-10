import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

router.post('/', async (req, res) => {
  const newMessage = new Message(req.body);
  const saved = await newMessage.save();
  res.status(201).json(saved);
});

export default router;
