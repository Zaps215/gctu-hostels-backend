const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const isAuthenticated = require('../middleware/auth');
const MAX_PAGE_SIZE = 50;
const MAX_SEARCH_LENGTH = 100;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const requireManager = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.session.userId, 'role');
  } catch (error) {
    console.error('Error verifying hostel manager access:', error);
    return res.status(500).json({ success: false, error: 'Unable to verify manager access.' });
  }

  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  if (user.role !== 'manager') {
    return res.status(403).json({ success: false, error: 'Only hostel managers can manage listings.' });
  }

  return next();
};

const editableFields = [
  'name',
  'university',
  'ownershipType',
  'genderCategory',
  'location',
  'distanceFromCampus',
  'price',
  'description',
  'paymentTerm',
  'roomTypesAvailable',
  'coverImage',
  'amenities',
  'isAvailable',
  'contactPhone',
  'officialUrl'
];

function getEditableFields(body) {
  return Object.fromEntries(
    editableFields
      .filter(field => Object.hasOwn(body, field))
      .map(field => [field, body[field]])
  );
}

// GET /api/hostels - Fetch all hostels with optional query filters
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const { search, gender, maxPrice, sort, university } = req.query;
    if (search !== undefined && (typeof search !== 'string' || search.length > MAX_SEARCH_LENGTH)) {
      return res.status(400).json({ success: false, error: 'Search must be a string of at most 100 characters.' });
    }
    if (gender !== undefined && (typeof gender !== 'string' || !['All', 'Male', 'Female', 'Mixed'].includes(gender))) {
      return res.status(400).json({ success: false, error: 'Invalid gender filter.' });
    }
    if (university !== undefined && (typeof university !== 'string' || !['GCTU', 'UG', 'UPSA', 'Other'].includes(university))) {
      return res.status(400).json({ success: false, error: 'Invalid university filter.' });
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      if (typeof maxPrice !== 'string' || !Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0) {
        return res.status(400).json({ success: false, error: 'Maximum price must be a non-negative number.' });
      }
    }

    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const requestedLimit = req.query.limit === undefined ? MAX_PAGE_SIZE : Number(req.query.limit);
    if (!Number.isSafeInteger(page) || page < 1 ||
        !Number.isSafeInteger(requestedLimit) || requestedLimit < 1) {
      return res.status(400).json({ success: false, error: 'Page and limit must be positive integers.' });
    }
    const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip)) {
      return res.status(400).json({ success: false, error: 'Requested page is out of range.' });
    }

    let query = { university: university || 'GCTU' };

    if (gender && gender !== 'All') {
      query.genderCategory = gender;
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      query.price = { $lte: Number(maxPrice) };
    }

    if (search?.trim()) {
      const literalSearch = escapeRegex(search.trim());
      query.$or = [
        { name: { $regex: literalSearch, $options: 'i' } },
        { location: { $regex: literalSearch, $options: 'i' } }
      ];
    }

    let hostelsQuery = Hostel.find(query);

    if (sort === 'price-asc') {
      hostelsQuery = hostelsQuery.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      hostelsQuery = hostelsQuery.sort({ price: -1 });
    } else {
      hostelsQuery = hostelsQuery.sort({ createdAt: -1 });
    }

    const [hostels, totalCount] = await Promise.all([
      hostelsQuery.skip(skip).limit(limit).exec(),
      Hostel.countDocuments(query)
    ]);
    res.status(200).json({
      success: true,
      count: hostels.length,
      data: hostels,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ success: false, error: 'Server error fetching hostels' });
  }
});

// GET /api/hostels/mine - List the authenticated manager's own listings
router.get('/mine', isAuthenticated, requireManager, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const hostels = await Hostel.find({ owner: req.session.userId }).sort({ updatedAt: -1 }).exec();
    res.status(200).json({ success: true, count: hostels.length, data: hostels });
  } catch (error) {
    console.error('Error fetching manager listings:', error);
    res.status(500).json({ success: false, error: 'Server error fetching your listings.' });
  }
});

// GET /api/hostels/mine/:id - Fetch one listing owned by the authenticated manager
router.get('/mine/:id', isAuthenticated, requireManager, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ _id: req.params.id, owner: req.session.userId });
    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found.' });
    }
    res.set('Cache-Control', 'no-store');
    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    console.error('Error fetching manager listing:', error);
    res.status(400).json({ success: false, error: 'Invalid hostel ID.' });
  }
});

// GET /api/hostels/:id - Fetch single hostel details
router.get('/:id', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found' });
    }
    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    console.error('Error fetching hostel details:', error);
    res.status(500).json({ success: false, error: 'Invalid ID or Server Error' });
  }
});

// POST /api/hostels - Create a listing owned by the authenticated manager
router.post('/', isAuthenticated, requireManager, async (req, res) => {
  try {
    const hostel = await Hostel.create({
      ...getEditableFields(req.body),
      owner: req.session.userId
    });
    res.status(201).json({ success: true, data: hostel });
  } catch (error) {
    console.error('Error creating hostel:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/hostels/:id - Update only a listing owned by the authenticated manager
router.put('/:id', isAuthenticated, requireManager, async (req, res) => {
  try {
    const updates = getEditableFields(req.body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'Provide at least one valid hostel field to update.' });
    }

    const hostel = await Hostel.findOne({ _id: req.params.id, owner: req.session.userId });
    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found.' });
    }

    Object.assign(hostel, updates);
    await hostel.save();
    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    console.error('Error updating hostel:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/hostels/:id - Delete only a listing owned by the authenticated manager
router.delete('/:id', isAuthenticated, requireManager, async (req, res) => {
  try {
    const hostel = await Hostel.findOneAndDelete({ _id: req.params.id, owner: req.session.userId });
    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found.' });
    }
    res.status(200).json({ success: true, message: 'Hostel listing deleted.' });
  } catch (error) {
    console.error('Error deleting hostel:', error);
    res.status(400).json({ success: false, error: 'Invalid hostel ID.' });
  }
});

module.exports = router;