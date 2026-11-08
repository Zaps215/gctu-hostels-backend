// middleware/adminAuth.js
const verifyAdminSecret = (req, res, next) => {
    const adminSecret = req.headers['x-admin-secret'];

    // Check if the header matches your environment variable secret
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({
            success: false,
            error: 'Forbidden: Invalid or missing admin authorization secret.'
        });
    }

    next();
};

module.exports = verifyAdminSecret;