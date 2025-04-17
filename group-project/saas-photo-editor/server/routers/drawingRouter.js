import express from 'express';
import Drawing from '../models/Canvas.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Get all drawings for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const drawings = await Drawing.find({ user: req.user.userId });
    res.json(drawings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drawings' });
  }
});

// Save new drawing
router.post('/', verifyToken, async (req, res) => {
  try {
    const drawing = await Drawing.create({
      imageData: req.body.imageData,
      title: req.body.title || 'Untitled',
      user: req.user.userId
    });
    res.status(201).json(drawing);
  } catch (error) {
    res.status(400).json({ message: 'Error saving drawing' });
  }
});

export default router;