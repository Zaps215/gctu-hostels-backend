const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const hostelRoutes = require('./routes/hostelRoutes');
require('dotenv').config();

const connectDB = require('./config/db');

//sitemap for gsc
const sitemapRoute = require('./routes/sitemap');

// Connect to database
connectDB();

const app = express();

// SECURITY MIDDLEWARES

//  Set security HTTP headers
app.use(helmet());

// Body parser with size limits to prevent payload DoS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
    if (req.query) {
        Object.defineProperty(req, 'query', {
            value: { ...req.query },
            writable: true,
            configurable: true,
            enumerable: true,
        });
    }
    next();
});

// Prevent NoSQL Injection (strips $, . from inputs)
app.use(mongoSanitize({ replaceWith: '_' }));

//  Prevent HTTP Parameter Pollution
app.use(hpp());


// ==========================================
// STANDARD MIDDLEWARES & CONFIG
// ==========================================


// Required for Render/ Cloud hosting when secure is true.
app.set('trust proxy', 1);

// CORS
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000',
        'http://localhost:5500',
         'http://127.0.0.1:5500', 
        'http://localhost:5000',
         'http://172.30.149.184:5500', 
         'https://gctu-hostels-backend.onrender.com',
    'https://student-hostels.netlify.app' ],
    credentials: true,
     allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));



// Session middleware (FIXED syntax)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //True on live site, false locally
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', //'none' live, 'lax' locally
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ==========================================
// RATE LIMITING
// ==========================================

// Global rate limiter for overall API endpoints
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again later.' }
});

// Strict rate limiter for authentication routes (Brute-Force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 attempts per IP per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

// Apply global rate limiter
app.use(globalLimiter);

// Apply strict rate limiters to sensitive auth paths (matching your /api prefix structure)
app.use('/api/login', authLimiter);
app.use('/api/signup', authLimiter);
app.use('/api/send-otp', authLimiter);
app.use('/api/verify-otp', authLimiter);
app.use('/api/reset-password', authLimiter);

// Debug middleware - check if session is working
app.use((req, res, next) => {
    console.log('🔍 Session ID:', req.sessionID);
    console.log('🔍 Session data:', req.session);
    next();
});


// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/hostels', hostelRoutes);

//sitemap for gsc route
app.use('/', sitemapRoute);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('🔥 Unhandled Server Error:', err.stack);

    // If headers were already sent, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }

    // Send safe JSON response
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'An unexpected error occurred. Please try again later.' 
            : err.message // Show real error only during local development
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});