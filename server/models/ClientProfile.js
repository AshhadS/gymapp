import mongoose from 'mongoose';

const ClientProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user should have only one client profile
  },
  fullName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  weight: {
    type: Number, // Consider units (e.g., kg or lbs) - storing as number assumes consistent unit
    required: true,
  },
  height: {
    type: Number, // Consider units (e.g., cm or inches) - storing as number assumes consistent unit
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ClientProfile', ClientProfileSchema);
