import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';

// Load environment variables from .env file
dotenv.config();

// --- Environment Variable Checks ---
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}
// -----------------------------------


const app = express();

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB(); // Connect to the database when the server starts
// -------------------------

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Body parser for JSON format

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
