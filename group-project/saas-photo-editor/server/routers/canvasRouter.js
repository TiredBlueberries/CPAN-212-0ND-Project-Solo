import express from 'express';
import Canvas from '../models/Canvas.js';


const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const canvas = await Canvas.create({
      user: req.user.userId,
      ...req.body
    });
    res.status(201).json(canvas);
  } catch (error) {
    res.status(400).json({ message: 'Error saving canvas' });
  }
});

router.get('/', async (req, res) => {
  try {
    const canvases = await Canvas.find({ user: req.user.userId });
    res.json(canvases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching canvases' });
  }
});


export default router;