const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 
        'http://localhost:5000', 'http://172.30.149.184:5500', 'https://gctu-hostels-backend.onrender.com',
    'https://student-hostels.netlify.app' ],
    credentials: true,
     allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// ADD THIS LINE RIGHT HERE 
app.set('trust proxy', 1);

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
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Debug middleware - check if session is working
app.use((req, res, next) => {
    console.log('🔍 Session ID:', req.sessionID);
    console.log('🔍 Session data:', req.session);
    next();
});

// Routes
app.use('/api', require('./routes/authRoutes'));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});