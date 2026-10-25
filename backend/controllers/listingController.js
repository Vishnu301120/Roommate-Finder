const Listing = require('../models/Listing');

// @desc   Get all listings with filtering, search & pagination
// @route  GET /api/listings
// @access Public
const getListings = async (req, res) => {
  try {
    const {
      city,
      locality,
      roomType,
      propertyType,
      minRent,
      maxRent,
      preferredGender,
      furnishingStatus,
      amenities,
      keyword,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'active' };

    // City filter (case-insensitive regex)
    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    // Locality filter
    if (locality) {
      query.locality = { $regex: locality, $options: 'i' };
    }

    // Room Type filter
    if (roomType && roomType !== 'All') {
      query.roomType = roomType;
    }

    // Property Type filter
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Gender filter
    if (preferredGender && preferredGender !== 'Any') {
      query.$or = [{ preferredGender }, { preferredGender: 'Any' }];
    }

    // Furnishing Status
    if (furnishingStatus && furnishingStatus !== 'All') {
      query.furnishingStatus = furnishingStatus;
    }

    // Rent range
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    // Amenities (all specified amenities must be present)
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // Keyword search (title, description, locality, city)
    if (keyword) {
      const keywordRegex = { $regex: keyword, $options: 'i' };
      query.$or = [
        { title: keywordRegex },
        { description: keywordRegex },
        { locality: keywordRegex },
        { city: keywordRegex },
      ];
    }

    // Sorting
    let sort = { createdAt: -1 }; // default newest
    if (sortBy === 'rent_asc') {
      sort = { rent: 1 };
    } else if (sortBy === 'rent_desc') {
      sort = { rent: -1 };
    } else if (sortBy === 'views') {
      sort = { views: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .populate('user', 'name avatar gender occupation isVerified email phone')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      listings,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single listing by ID
// @route  GET /api/listings/:id
// @access Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'user',
      'name avatar gender age occupation bio city isVerified lifestyle email phone'
    );

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment views
    listing.views = (listing.views || 0) + 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create new listing
// @route  POST /api/listings
// @access Private
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      roomType,
      rent,
      deposit,
      city,
      locality,
      address,
      furnishingStatus,
      amenities,
      preferredGender,
      preferredOccupation,
      photos,
      rules,
      availableFrom,
    } = req.body;

    const newListing = new Listing({
      user: req.user._id,
      title,
      description,
      propertyType,
      roomType,
      rent: Number(rent),
      deposit: Number(deposit) || 0,
      city,
      locality,
      address: address || '',
      furnishingStatus: furnishingStatus || 'Fully Furnished',
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(a => a.trim()) : []),
      preferredGender: preferredGender || 'Any',
      preferredOccupation: preferredOccupation || 'Any',
      photos: photos && photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
      ],
      rules: Array.isArray(rules) ? rules : (rules ? rules.split('\n').map(r => r.trim()).filter(Boolean) : []),
      availableFrom: availableFrom || Date.now(),
    });

    const savedListing = await newListing.save();
    const populated = await savedListing.populate('user', 'name avatar gender occupation isVerified');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update listing
// @route  PUT /api/listings/:id
// @access Private
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership or admin
    if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name avatar gender occupation isVerified');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete listing
// @route  DELETE /api/listings/:id
// @access Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current user's listings
// @route  GET /api/listings/my/listings
// @access Private
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Upload photos for listing
// @route  POST /api/listings/upload
// @access Private
const uploadListingPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const urls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  uploadListingPhotos,
};
