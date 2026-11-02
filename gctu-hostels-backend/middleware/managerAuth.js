const User = require('../models/User');

async function isManager(req, res, next) {
    try {
        const user = await User.findById(req.session.userId).select('role');
        if (!user || user.role !== 'manager') {
            return res.status(403).json({ success: false, error: 'Manager access required' });
        }

        return next();
    } catch (error) {
        console.error('Manager authorization error:', error);
        return res.status(500).json({ success: false, error: 'Unable to verify manager access' });
    }
}

module.exports = isManager;
