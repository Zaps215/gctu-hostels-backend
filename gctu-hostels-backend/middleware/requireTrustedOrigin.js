const allowedOrigins = new Set(require('../config/allowedOrigins'));
const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function requireTrustedOrigin(req, res, next) {
    if (!mutatingMethods.has(req.method)) {
        return next();
    }

    const origin = req.get('origin');
    if (!origin && req.method === 'POST' && req.path === '/register-manager') {
        return next();
    }

    if (!origin || !allowedOrigins.has(origin)) {
        return res.status(403).json({ error: 'Request origin is not allowed.' });
    }

    return next();
}

module.exports = requireTrustedOrigin;
