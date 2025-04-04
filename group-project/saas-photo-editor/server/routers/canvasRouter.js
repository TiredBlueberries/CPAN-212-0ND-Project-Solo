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

router.get('/:id', async (req, res) => {
  try {
    const canvas = await Canvas.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    canvas ? res.json(canvas) : res.status(404).json({ message: 'Canvas not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const canvas = await Canvas.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    canvas ? res.json(canvas) : res.status(404).json({ message: 'Canvas not found' });
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const canvas = await Canvas.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    canvas ? res.json({ message: 'Canvas deleted' }) : res.status(404).json({ message: 'Canvas not found' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed' });
  }
});

export default router;