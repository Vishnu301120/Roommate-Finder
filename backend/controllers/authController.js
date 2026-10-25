const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_roommatefinder2026_modernmern', {
    expiresIn: '30d',
  });
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      age,
      city,
      locality,
      occupation,
      budgetMin,
      budgetMax,
      lookingFor,
      lifestyle,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Default avatar if none provided
    const avatar =
      gender === 'Female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      gender: gender || 'Not Specified',
      age: age || 24,
      city: city || 'Bengaluru',
      locality: locality || 'Koramangala',
      occupation: occupation || 'Working Professional',
      budgetMin: budgetMin || 5000,
      budgetMax: budgetMax || 20000,
      lookingFor: lookingFor || 'both',
      avatar,
      lifestyle: lifestyle || {},
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        gender: user.gender,
        age: user.age,
        city: user.city,
        locality: user.locality,
        occupation: user.occupation,
        budgetMin: user.budgetMin,
        budgetMax: user.budgetMax,
        lookingFor: user.lookingFor,
        lifestyle: user.lifestyle,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Authenticate user & get token
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Account is suspended by administrator.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      gender: user.gender,
      age: user.age,
      city: user.city,
      locality: user.locality,
      occupation: user.occupation,
      bio: user.bio,
      budgetMin: user.budgetMin,
      budgetMax: user.budgetMax,
      lookingFor: user.lookingFor,
      lifestyle: user.lifestyle,
      isVerified: user.isVerified,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current user profile
// @route  GET /api/auth/me
// @access Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.gender = req.body.gender || user.gender;
      user.age = req.body.age || user.age;
      user.occupation = req.body.occupation || user.occupation;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.city = req.body.city || user.city;
      user.locality = req.body.locality !== undefined ? req.body.locality : user.locality;
      user.budgetMin = req.body.budgetMin !== undefined ? req.body.budgetMin : user.budgetMin;
      user.budgetMax = req.body.budgetMax !== undefined ? req.body.budgetMax : user.budgetMax;
      user.lookingFor = req.body.lookingFor || user.lookingFor;

      if (req.body.lifestyle) {
        user.lifestyle = {
          ...user.lifestyle.toObject(),
          ...req.body.lifestyle,
        };
      }

      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        age: updatedUser.age,
        city: updatedUser.city,
        locality: updatedUser.locality,
        occupation: updatedUser.occupation,
        bio: updatedUser.bio,
        budgetMin: updatedUser.budgetMin,
        budgetMax: updatedUser.budgetMax,
        lookingFor: updatedUser.lookingFor,
        lifestyle: updatedUser.lifestyle,
        isVerified: updatedUser.isVerified,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Upload avatar photo
// @route  POST /api/auth/avatar
// @access Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    if (user) {
      user.avatar = avatarUrl;
      await user.save();
      res.json({ avatar: avatarUrl, message: 'Avatar updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  uploadAvatar,
  generateToken,
};
