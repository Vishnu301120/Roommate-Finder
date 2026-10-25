const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the listing'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description of the property/room'],
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Independent House', 'Villa', 'PG/Hostel', 'Gated Community'],
      default: 'Apartment',
    },
    roomType: {
      type: String,
      enum: ['Single Private Room', 'Shared Room', 'Entire Flat', 'Studio'],
      required: [true, 'Please specify room type'],
    },
    rent: {
      type: Number,
      required: [true, 'Please specify monthly rent'],
    },
    deposit: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Please provide locality/neighborhood'],
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    furnishingStatus: {
      type: String,
      enum: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Fully Furnished',
    },
    amenities: {
      type: [String],
      default: [],
    },
    preferredGender: {
      type: String,
      enum: ['Any', 'Male', 'Female'],
      default: 'Any',
    },
    preferredOccupation: {
      type: String,
      enum: ['Any', 'Working Professional', 'Student'],
      default: 'Any',
    },
    photos: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      ],
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    rules: {
      type: [String],
      default: ['Maintain cleanliness', 'Mutual respect & quiet hours after 11 PM'],
    },
    status: {
      type: String,
      enum: ['active', 'occupied', 'inactive'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
