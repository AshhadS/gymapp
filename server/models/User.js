import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['client', 'trainer'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Link to profile models (optional, can be queried separately)
  clientProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientProfile'
  },
  trainerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainerProfile'
  }
});

export default mongoose.model('User', UserSchema);
