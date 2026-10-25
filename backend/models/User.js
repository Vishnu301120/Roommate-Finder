const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-Binary', 'Other', 'Not Specified'],
      default: 'Not Specified',
    },
    age: {
      type: Number,
      min: 18,
      max: 99,
      default: 23,
    },
    occupation: {
      type: String,
      enum: ['Student', 'Working Professional', 'Freelancer', 'Entrepreneur', 'Other'],
      default: 'Working Professional',
    },
    bio: {
      type: String,
      default: 'Looking for a neat and friendly roommate to share an apartment.',
    },
    city: {
      type: String,
      required: [true, 'Please provide your city'],
      trim: true,
      default: 'Bengaluru',
    },
    locality: {
      type: String,
      default: 'Koramangala',
    },
    budgetMin: {
      type: Number,
      default: 5000,
    },
    budgetMax: {
      type: Number,
      default: 18000,
    },
    lookingFor: {
      type: String,
      enum: ['roommate', 'room', 'both'],
      default: 'both',
    },
    lifestyle: {
      smoking: {
        type: String,
        enum: ['No', 'Occasionally', 'Regularly'],
        default: 'No',
      },
      drinking: {
        type: String,
        enum: ['No', 'Socially', 'Regularly'],
        default: 'Socially',
      },
      foodDiet: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'],
        default: 'Non-Vegetarian',
      },
      sleepSchedule: {
        type: String,
        enum: ['Early Bird', 'Night Owl', 'Flexible'],
        default: 'Flexible',
      },
      pets: {
        type: String,
        enum: ['No Pets', 'Dog Lover', 'Cat Lover', 'Pet Friendly'],
        default: 'Pet Friendly',
      },
      partyHabits: {
        type: String,
        enum: ['Quiet & Calm', 'Weekends Only', 'Social & Fun'],
        default: 'Weekends Only',
      },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
