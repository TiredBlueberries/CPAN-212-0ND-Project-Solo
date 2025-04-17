import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routers/authRouter.js';
import canvasRouter from './routers/canvasRouter.js';
import drawingRouter from './routers/drawingRouter.js';
import { verifyToken } from './middlewares/auth.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/canvases', verifyToken, canvasRouter);
app.use('/api/drawings', verifyToken, drawingRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Database and Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));