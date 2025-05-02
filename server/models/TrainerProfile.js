import mongoose from 'mongoose';

const TrainerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user should have only one trainer profile
  },
  bio: {
    type: String,
    required: true,
  },
  specializations: {
    type: [String], // Array of strings
    required: true,
  },
  certifications: {
    type: [String], // Storing as text for now, file upload requires more setup (e.g., S3)
  },
  methodology: {
    type: String,
  },
  availability: {
    type: String, // Simple text description
  },
  profilePictureUrl: { // Store URL if profile picture is uploaded elsewhere
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('TrainerProfile', TrainerProfileSchema);
