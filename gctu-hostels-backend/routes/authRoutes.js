const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const Activity = require('../models/Activity');
const { sendEmail } = require('../config/email');
const validatePassword = require('../utils/passwordValidator');
const isAuthenticated = require('../middleware/auth');

router.post('/send-otp', async (req, res) => {
    try {
        const { email, fullName, username, password } = req.body;

        if (!email || !fullName || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.isValid) {
            return res.status(400).json({ error: passwordCheck.errors[0] });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username: username.trim() }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({ email: normalizedEmail });
        await OTP.create({ email: normalizedEmail, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

        const emailHtml = `
            <div style="font-family: Arial, sans-serif;">
                <h2>Welcome to GCTU StudentHostels!</h2>
                <p>Your OTP code is:</p>
                <h1 style="color: #f4a261;">${code}</h1>
                <p>This code expires in 10 minutes.</p>
            </div>
        `;

        const emailResult = await sendEmail(normalizedEmail, 'Verify Your Email - GCTU StudentHostels', emailHtml);
        if (!emailResult.success) {
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }

        req.session.tempSignup = {
            fullName: fullName.trim(),
            username: username.trim(),
            email: normalizedEmail,
            passwordHash: await bcrypt.hash(password, 12),
            createdAt: Date.now()
        };

        await req.session.save();
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

        const normalizedEmail = email.trim().toLowerCase();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            code,
            expiresAt: { $gt: new Date() },
            used: false
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP code' });
        }

        otpRecord.used = true;
        await otpRecord.save();

        const { fullName, username, passwordHash } = req.session.tempSignup || {};

        if (!fullName || !username || !passwordHash) {
            return res.status(400).json({ error: 'Signup session expired. Please try again.' });
        }

        const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const user = await User.collection.insertOne({
            fullName,
            username,
            email: normalizedEmail,
            password: passwordHash,
            createdAt: new Date()
        });

        delete req.session.tempSignup;

        const createdUser = await User.findById(user.insertedId).select('-password');

        res.status(201).json({
            message: 'Account created successfully! Please login.',
            user: {
                id: createdUser._id,
                fullName: createdUser.fullName,
                username: createdUser.username,
                email: createdUser.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//signup route
router.post('/signup', async (req, res) => {
    return res.status(403).json({
        error: 'Direct signup is disabled. Please complete OTP signup first.'
    });
});

//login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        req.session.regenerate(async (err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.status(500).json({ error: 'Server error during login' });
            }

            req.session.userId = user._id;

            try {
                await Activity.create({ user: user._id, type: 'login' });
            } catch (activityError) {
                console.error('Unable to record successful login activity:', activityError);
            }

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Session save error:', saveErr);
                    return res.status(500).json({ error: 'Server error during login' });
                }

                res.json({
                    message: 'Login successful',
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        username: user.username,
                        email: user.email
                    }
                });
            });
        });
    } catch (error) {
        console.error('Login catch error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});


    router.post('/logout', async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Logout failed' });
            }
            // Explicitly clear the session cookie from the browser
        res.clearCookie('connect.sid', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
            res.json({ message: 'Logout successful' });
        });
    });

// /me route (protected by middleware)
router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error in /me:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
    


    // Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        // Only send a code when the account exists, but always return the same response
        if (user) {
            // Generate 6-digit OTP
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Delete old OTPs for this email
            await OTP.deleteMany({ email: normalizedEmail });

            // Save new OTP (expires in 10 minutes)
            await OTP.create({ email: normalizedEmail, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

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
            await sendEmail(normalizedEmail, 'Reset Your Password - GCTU StudentHostels', emailHtml);
        }
        
        // 🔒 SECURITY FIX: Always return a generic success message, 
        // regardless of whether the email was found or not!
        res.json({ message: 'If an account with that email exists, a password reset code has been sent.' });
        
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

        const normalizedEmail = email.trim().toLowerCase();
        const resetVerifiedAt = req.session.resetVerifiedAt;

        if (!req.session.resetEmail || req.session.resetEmail !== normalizedEmail) {
            return res.status(401).json({ error: 'Please verify the OTP code before resetting your password' });
        }

        if (!resetVerifiedAt || Date.now() - resetVerifiedAt > 10 * 60 * 1000) {
            delete req.session.resetEmail;
            delete req.session.resetVerifiedAt;
            return res.status(401).json({ error: 'Password reset session expired. Please request a new code.' });
        }

        const passwordCheck = validatePassword(newPassword);
        if (!passwordCheck.isValid) {
            return res.status(400).json({ error: passwordCheck.errors[0] });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ error: 'If an account with that email exists, a password reset code has been sent.' });
        }

        user.password = newPassword;
        await user.save();

        delete req.session.resetEmail;
        delete req.session.resetVerifiedAt;

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

        const normalizedEmail = email.trim().toLowerCase();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            code,
            expiresAt: { $gt: new Date() },
            used: false
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        otpRecord.used = true;
        await otpRecord.save();

        req.session.resetEmail = normalizedEmail;
        req.session.resetVerifiedAt = Date.now();

        req.session.save((err) => {
            if (err) {
                console.error('Reset session save error:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json({ message: 'OTP verified successfully' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

console.log('Routes registered:', router.stack.map(r => r.route?.path).filter(Boolean));
    module.exports = router;