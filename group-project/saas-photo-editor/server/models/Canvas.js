import mongoose from 'mongoose';

const drawingSchema = new mongoose.Schema({
  imageData: {
    type: String, 
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Drawing', drawingSchema);