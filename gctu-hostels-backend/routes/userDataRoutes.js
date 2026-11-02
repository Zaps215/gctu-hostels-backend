const express = require('express');
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Favorite = require('../models/Favorite');
const Hostel = require('../models/Hostel');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();
const activityTypes = new Set([
    'viewed_hostel',
    'searched_hostels',
    'opened_contact'
]);

router.use(isAuthenticated);

function normalizeHostelName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function activityMessage(activity) {
    const hostelName = activity.hostel?.name || 'a hostel';

    switch (activity.type) {
        case 'viewed_hostel':
            return `Viewed ${hostelName} page`;
        case 'searched_hostels':
            return `Searched hostels for "${activity.searchTerm}"`;
        case 'opened_contact':
            return `Opened contact options for ${hostelName}`;
        case 'saved_hostel':
            return `Saved ${hostelName} to bookmarked hostels`;
        case 'removed_favorite':
            return `Removed ${hostelName} from saved hostels`;
        case 'login':
            return 'Logged in';
        default:
            return 'Activity recorded';
    }
}

router.get('/dashboard', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');
        const userId = req.session.userId;
        const [favoriteRecords, activityRecords, viewedHostelIds, searchesMade] = await Promise.all([
            Favorite.find({ user: userId })
                .populate('hostel')
                .sort({ createdAt: -1 })
                .lean(),
            Activity.find({ user: userId })
                .populate('hostel', 'name')
                .sort({ createdAt: -1 })
                .limit(50)
                .lean(),
            Activity.distinct('hostel', {
                user: userId,
                type: 'viewed_hostel',
                hostel: { $ne: null }
            }),
            Activity.countDocuments({ user: userId, type: 'searched_hostels' })
        ]);

        const viewedHostels = viewedHostelIds.length
            ? await Hostel.find({ _id: { $in: viewedHostelIds } }).select('name').lean()
            : [];
        const exploredHostelKeys = new Set(viewedHostels.map(hostel =>
            normalizeHostelName(hostel.name) || String(hostel._id)
        ));
        const favorites = favoriteRecords
            .filter(record => record.hostel)
            .map(record => record.hostel);
        const seenHostelViews = new Set();
        const activities = activityRecords
            .filter(activity => {
                if (activity.type !== 'viewed_hostel') return true;
                if (!activity.hostel) return false;

                const hostelKey = normalizeHostelName(activity.hostel.name) || String(activity.hostel._id);
                if (seenHostelViews.has(hostelKey)) return false;
                seenHostelViews.add(hostelKey);
                return true;
            })
            .slice(0, 10)
            .map(activity => ({
                action: activityMessage(activity),
                time: activity.createdAt
            }));

        res.json({
            success: true,
            data: {
                favorites,
                activities,
                stats: {
                    savedHostels: favorites.length,
                    hostelsViewed: exploredHostelKeys.size,
                    searchesMade
                }
            }
        });
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        res.status(500).json({ error: 'Unable to load dashboard data' });
    }
});

router.get('/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.session.userId })
            .populate('hostel')
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: favorites.filter(record => record.hostel).map(record => record.hostel)
        });
    } catch (error) {
        console.error('Error loading saved hostels:', error);
        res.status(500).json({ error: 'Unable to load saved hostels' });
    }
});

router.post('/activity', async (req, res) => {
    try {
        const { type, hostelId, searchTerm } = req.body || {};

        if (!activityTypes.has(type)) {
            return res.status(400).json({ error: 'Unsupported activity type' });
        }

        const activity = {
            user: req.session.userId,
            type
        };

        if (type === 'searched_hostels') {
            if (typeof searchTerm !== 'string' || !searchTerm.trim() || searchTerm.trim().length > 100) {
                return res.status(400).json({ error: 'Search term must be between 1 and 100 characters' });
            }
            activity.searchTerm = searchTerm.trim();
        } else {
            if (!mongoose.isValidObjectId(hostelId)) {
                return res.status(400).json({ error: 'A valid hostel ID is required' });
            }
            const hostelExists = await Hostel.exists({ _id: hostelId });
            if (!hostelExists) {
                return res.status(404).json({ error: 'Hostel not found' });
            }
            activity.hostel = hostelId;
        }

        if (type === 'viewed_hostel') {
            const viewedActivity = await Activity.findOneAndUpdate(
                activity,
                { $setOnInsert: activity },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            return res.status(200).json({ success: true, id: viewedActivity._id });
        }

        const createdActivity = await Activity.create(activity);
        res.status(201).json({ success: true, id: createdActivity._id });
    } catch (error) {
        console.error('Error recording user activity:', error);
        res.status(500).json({ error: 'Unable to record activity' });
    }
});

router.put('/favorites/:hostelId', async (req, res) => {
    try {
        const { hostelId } = req.params;
        if (!mongoose.isValidObjectId(hostelId)) {
            return res.status(400).json({ error: 'Invalid hostel ID' });
        }

        const hostel = await Hostel.findById(hostelId).select('name');
        if (!hostel) {
            return res.status(404).json({ error: 'Hostel not found' });
        }

        const userId = req.session.userId;
        const existing = await Favorite.findOne({ user: userId, hostel: hostelId });
        if (!existing) {
            try {
                await Favorite.create({ user: userId, hostel: hostelId });
                await Activity.create({ user: userId, type: 'saved_hostel', hostel: hostelId });
            } catch (error) {
                if (error.code !== 11000) throw error;
            }
        }

        res.json({ success: true, saved: true });
    } catch (error) {
        console.error('Error saving hostel:', error);
        res.status(500).json({ error: 'Unable to save hostel' });
    }
});

router.delete('/favorites/:hostelId', async (req, res) => {
    try {
        const { hostelId } = req.params;
        if (!mongoose.isValidObjectId(hostelId)) {
            return res.status(400).json({ error: 'Invalid hostel ID' });
        }

        const favorite = await Favorite.findOneAndDelete({
            user: req.session.userId,
            hostel: hostelId
        });

        if (favorite) {
            await Activity.create({
                user: req.session.userId,
                type: 'removed_favorite',
                hostel: hostelId
            });
        }

        res.json({ success: true, saved: false });
    } catch (error) {
        console.error('Error removing saved hostel:', error);
        res.status(500).json({ error: 'Unable to remove saved hostel' });
    }
});

module.exports = router;
