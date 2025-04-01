import express from 'express';
import Drawing from '../models/Canvas.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const drawing = await Drawing.create({
      imageData: req.body.imageData
    });
    res.status(201).json(drawing);
  } catch (error) {
    res.status(400).json({ message: 'Error saving drawing' });
  }
});

router.get('/', async (req, res) => {
  try {
    const drawings = await Drawing.find().sort({ createdAt: -1 });
    res.json(drawings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drawings' });
  }
});

export default router;