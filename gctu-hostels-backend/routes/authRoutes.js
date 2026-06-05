const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require('../config/email');
const validatePassword = require('../utils/passwordValidator');


router.post('/send-otp', async (req, res) => {
    try{
    const { email, fullName, username, password } = req.body;
	if (!email || !fullName || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
        return res.status(400).json({ error: passwordCheck.errors[0] });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email });
    await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

const emailHtml = `
    <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to GCTU StudentHostels!</h2>
        <p>Your OTP code is:</p>
        <h1 style="color: #f4a261;">${code}</h1>
        <p>This code expires in 10 minutes.</p>
    </div>
`;

    const emailResult = await sendEmail(email, 'Verify Your Email - GCTU StudentHostels', emailHtml);
	if (!emailResult.success) {
        return res.status(500).json({ error: 'Failed to send OTP email' });
    }
        req.session.tempSignup = { fullName, username, email, password };
	res.json({ message: 'OTP sent to your email' });
	} catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

//verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email and code are required' });
        }

        //FID VALID OTP
        const otpRecord = await OTP.findOne({
            email,
            code,
            expiresAt: { $gt: new Date() },
            used: false
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP code' });
        }

        //MATCH OTP
        otpRecord.used = true;
        await otpRecord.save();

        //GET TEMPORARY SIGNUP DATA FROM SESSION
        const { fullName, username, password } = req.session.tempSignup || {};

        if (!fullName || !username || !password) {
            return res.status(400).json({ error: 'Signup session expired. Please try again.' });
        }

        // Create user (password will be hashed by pre-save middleware)
        const user = new User({ fullName, username, email, password });
        await user.save();

        //CLEAR TEMP DATA
        delete req.session.tempSignup;

        res.status(201).json({
            message: 'Account created successfully! Please login.',
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//signup route
router.post('/signup', async (req, res) => {
        const { fullName, username, email, password } = req.body;
            if (!fullName || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
        const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });
        if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
    }
        const user = new User({
        fullName,
        username,
        email,
        password
    });
        await user.save();
            res.status(201).json({
        message: 'User created successfully',
        user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email
        }
    });
    });

    //login route
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: '...' });
        try {
            const user = await User.findOne({ username });
            if (!user) return res.status(401).json({ error: 'User not found' });
            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(401).json({ error: 'Password is Incorrect' });
            req.session.userId = user._id;
            res.json({ message: 'Login successful', user: { id: user._id, fullName: user.fullName, username: user.username, email: user.email } });
            } catch (error) { console.error(error); res.status(500).json({ error: 'Server error during login' }); 
        }
        });
        router.post('/logout', async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Logout failed' });
            }
            res.json({ message: 'Logout successful' });
        });
    });

    ///me route
    router.get('/me', async (req, res) => {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try{
             console.log('Looking for user with ID:', req.session.userId);
            const user = await User.findById(req.session.userId).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({user});
        } catch (error) {
            console.error('Error in /me:', error);
            res.status(500).json({ error: 'Server error'});
        }
    });

    


    // Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email' });
        }
        
        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Delete old OTPs for this email
        await OTP.deleteMany({ email });
        
        // Save new OTP (expires in 10 minutes)
        await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
        
        // Send email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Your OTP code is:</p>
                <h1 style="color: #f4a261;">${code}</h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `;
        
        const emailResult = await sendEmail(email, 'Reset Your Password - GCTU StudentHostels', emailHtml);
        
        if (!emailResult.success) {
            return res.status(500).json({ error: 'Failed to send reset email' });
        }
        
        res.json({ message: 'Reset code sent to your email' });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Password - Set new password (after OTP verification)
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Validate new password strength
        const passwordCheck = validatePassword(newPassword);
        if (!passwordCheck.isValid) {
            return res.status(400).json({ error: passwordCheck.errors[0] });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Password reset successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify Reset OTP (separate page flow)
router.post('/verify-reset-otp', async (req, res) => {
    try {
        const { email, code } = req.body;
        
        if (!email || !code) {
            return res.status(400).json({ error: 'Email and code are required' });
        }
        
        const otpRecord = await OTP.findOne({
            email,
            code,
            expiresAt: { $gt: new Date() },
            used: false
        });
        
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }
        
        // Mark OTP as used
        otpRecord.used = true;
        await otpRecord.save();
        
        res.json({ message: 'OTP verified successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

console.log('Routes registered:', router.stack.map(r => r.route?.path).filter(Boolean));
    module.exports = router;