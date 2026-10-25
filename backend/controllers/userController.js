const User = require('../models/User');

// Helper to calculate lifestyle compatibility % between two users
const calculateCompatibilityScore = (user1, user2) => {
  if (!user1 || !user2 || !user1.lifestyle || !user2.lifestyle) return 75; // baseline

  let score = 50; // base score

  const l1 = user1.lifestyle;
  const l2 = user2.lifestyle;

  // Diet compatibility
  if (l1.foodDiet === l2.foodDiet) score += 10;
  else if (
    (l1.foodDiet === 'Vegetarian' && l2.foodDiet === 'Eggetarian') ||
    (l1.foodDiet === 'Eggetarian' && l2.foodDiet === 'Vegetarian')
  ) {
    score += 7;
  }

  // Sleep schedule compatibility
  if (l1.sleepSchedule === l2.sleepSchedule) score += 12;
  else if (l1.sleepSchedule === 'Flexible' || l2.sleepSchedule === 'Flexible') score += 8;

  // Smoking habits
  if (l1.smoking === l2.smoking) score += 10;
  else if (l1.smoking === 'No' && l2.smoking === 'Regularly') score -= 15;

  // Drinking habits
  if (l1.drinking === l2.drinking) score += 8;

  // Pet friendliness
  if (l1.pets === l2.pets || l1.pets === 'Pet Friendly' || l2.pets === 'Pet Friendly') score += 10;
  else if (l1.pets === 'No Pets' && (l2.pets === 'Dog Lover' || l2.pets === 'Cat Lover')) score -= 10;

  // Party habits
  if (l1.partyHabits === l2.partyHabits) score += 10;

  // Budget overlap
  const maxMin = Math.max(user1.budgetMin || 0, user2.budgetMin || 0);
  const minMax = Math.min(user1.budgetMax || 50000, user2.budgetMax || 50000);
  if (maxMin <= minMax) {
    score += 10; // budgets overlap!
  }

  return Math.min(Math.max(score, 25), 98); // clamp between 25% and 98%
};

// @desc   Get roommate seeker profiles with search, filter & compatibility
// @route  GET /api/users/roommates
// @access Public (or private with optionalAuth)
const getRoommateProfiles = async (req, res) => {
  try {
    const {
      city,
      gender,
      occupation,
      minBudget,
      maxBudget,
      smoking,
      drinking,
      foodDiet,
      sleepSchedule,
      pets,
      lookingFor,
      keyword,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      isBanned: false,
      role: 'user',
    };

    // Don't show current logged-in user in roommate search
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    // City filter
    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    // Gender filter
    if (gender && gender !== 'All' && gender !== 'Any') {
      query.gender = gender;
    }

    // Occupation filter
    if (occupation && occupation !== 'All') {
      query.occupation = occupation;
    }

    // Looking for filter
    if (lookingFor && lookingFor !== 'All') {
      query.lookingFor = { $in: [lookingFor, 'both'] };
    }

    // Budget filtering
    if (minBudget) {
      query.budgetMax = { $gte: Number(minBudget) };
    }
    if (maxBudget) {
      query.budgetMin = { $lte: Number(maxBudget) };
    }

    // Lifestyle filters
    if (smoking && smoking !== 'All') {
      query['lifestyle.smoking'] = smoking;
    }
    if (drinking && drinking !== 'All') {
      query['lifestyle.drinking'] = drinking;
    }
    if (foodDiet && foodDiet !== 'All') {
      query['lifestyle.foodDiet'] = foodDiet;
    }
    if (sleepSchedule && sleepSchedule !== 'All') {
      query['lifestyle.sleepSchedule'] = sleepSchedule;
    }
    if (pets && pets !== 'All') {
      query['lifestyle.pets'] = pets;
    }

    // Keyword search
    if (keyword) {
      const regex = { $regex: keyword, $options: 'i' };
      query.$or = [
        { name: regex },
        { bio: regex },
        { locality: regex },
        { city: regex },
        { occupation: regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);

    let users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // If logged in, calculate compatibility score for each user
    const usersWithScore = users.map((u) => {
      const uObj = u.toObject();
      if (req.user) {
        uObj.compatibilityScore = calculateCompatibilityScore(req.user, u);
      } else {
        uObj.compatibilityScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75; // sample preview for guests
      }
      return uObj;
    });

    res.json({
      users: usersWithScore,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get public profile of a user
// @route  GET /api/users/:id
// @access Public
const getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    if (req.user) {
      userObj.compatibilityScore = calculateCompatibilityScore(req.user, user);
    }

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoommateProfiles,
  getUserProfileById,
  calculateCompatibilityScore,
};
