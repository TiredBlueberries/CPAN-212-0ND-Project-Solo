import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Token generation with user payload
export const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email }, // Payload
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE || '1h' } 
  );
};

// Authentication middleware
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify token
    next(); // Proceed to route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};