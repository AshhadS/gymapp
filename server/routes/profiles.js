import express from 'express';
import authMiddleware from '../middleware/auth.js';
import ClientProfile from '../models/ClientProfile.js';
import TrainerProfile from '../models/TrainerProfile.js';
import User from '../models/User.js'; // Needed to link profile back to user

const router = express.Router();

// @route   POST api/profiles/client
// @desc    Create or update client profile
// @access  Private (Clients only)
router.post('/client', authMiddleware, async (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ msg: 'Access denied. Only clients can create client profiles.' });
  }

  const { fullName, age, gender, weight, height } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    fullName,
    age,
    gender,
    weight,
    height,
  };

  try {
    let profile = await ClientProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await ClientProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true } // Return the updated document
      );
      return res.json(profile);
    }

    // Create new profile
    profile = new ClientProfile(profileFields);
    await profile.save();

    // Optionally: Link profile ID back to User model
    await User.findByIdAndUpdate(req.user.id, { clientProfile: profile._id });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profiles/trainer
// @desc    Create or update trainer profile
// @access  Private (Trainers only)
router.post('/trainer', authMiddleware, async (req, res) => {
  if (req.user.role !== 'trainer') {
     return res.status(403).json({ msg: 'Access denied. Only trainers can create trainer profiles.' });
  }

  const { bio, specializations, certifications, methodology, availability, profilePictureUrl } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    bio,
    specializations,
    certifications, // Assuming certifications is an array of strings or handled text
    methodology,
    availability,
    profilePictureUrl // Assuming URL is provided if picture is uploaded elsewhere
  };

  try {
    let profile = await TrainerProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await TrainerProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
       return res.json(profile);
    }

    // Create new profile
    profile = new TrainerProfile(profileFields);
    await profile.save();

     // Optionally: Link profile ID back to User model
    await User.findByIdAndUpdate(req.user.id, { trainerProfile: profile._id });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles/me
// @desc    Get current user's profile (client or trainer)
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    let profile;
    if (req.user.role === 'client') {
      profile = await ClientProfile.findOne({ user: req.user.id }).populate('user', ['username', 'role']); // Populate user details
    } else if (req.user.role === 'trainer') {
      profile = await TrainerProfile.findOne({ user: req.user.id }).populate('user', ['username', 'role']); // Populate user details
    } else {
      return res.status(400).json({ msg: 'Invalid user role' });
    }

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
