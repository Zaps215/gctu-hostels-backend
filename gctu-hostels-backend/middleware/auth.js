// middleware/auth.js

const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
    res.set('Cache-Control', 'no-store');

    if (!req?.session?.userId || !Number.isInteger(req.session.authVersion)) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = await User.findById(req.session.userId).select('+sessionVersion');
        if (!user || (user.sessionVersion || 0) !== req.session.authVersion) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = isAuthenticated;