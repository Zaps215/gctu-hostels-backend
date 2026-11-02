const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const isAuthenticated = require('../middleware/auth');

// GET /api/hostels - Fetch all hostels with optional query filters
router.get('/', async (req, res) => {
  try {
    const { search, gender, maxPrice, sort, university } = req.query;
    let query = { university: university || 'GCTU' };

    if (gender && gender !== 'All') {
      query.genderCategory = gender;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
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

    const hostels = await hostelsQuery.exec();
    res.status(200).json({ success: true, count: hostels.length, data: hostels });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ success: false, error: 'Server error fetching hostels' });
  }
});

// GET /api/hostels/:id - Fetch single hostel details
router.get('/:id', async (req, res) => {
  try {
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

// POST /api/hostels - Admin seeding or registration endpoint
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json({ success: true, data: hostel });
  } catch (error) {
    console.error('Error creating hostel:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;