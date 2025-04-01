import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import drawingRouter from './routers/drawingRouter.js'; 

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173' // Match client's URL
}));

app.use(express.json({ limit: '10mb' })); 

// Routes
app.use('/api/drawings', drawingRouter); // NEW ROUTE

// Database Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);