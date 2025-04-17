import mongoose from "mongoose";

const drawingSchema = new mongoose.Schema({
  imageData: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled'
  }
}, { timestamps: true });

export default mongoose.model('Drawing', drawingSchema);