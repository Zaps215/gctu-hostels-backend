// middleware/auth.js

const isAuthenticated = (req, res, next) => {
    if (req && req.session && req.session.userId) {
        return next();
    }

    // Keep the exact error message your frontend expects
    return res.status(401).json({ error: 'Not authenticated' });
};

module.exports = isAuthenticated;