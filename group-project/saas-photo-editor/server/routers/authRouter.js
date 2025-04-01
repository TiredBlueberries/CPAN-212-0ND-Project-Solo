import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 12)
    });

    res.status(201).json({
      token: generateToken(user),
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user),
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;