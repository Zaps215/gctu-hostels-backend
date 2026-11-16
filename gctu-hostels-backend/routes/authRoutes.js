const express = require('express');
const bcrypt = require('bcryptjs');
const { randomInt } = require('crypto');
const { consumeOtp, hashOtp, isValidOtpCode } = require('../utils/otpSecurity');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const Activity = require('../models/Activity');
const { sendEmail } = require('../config/email');
const validatePassword = require('../utils/passwordValidator');
const isAuthenticated = require('../middleware/auth');
const verifyAdminSecret = require('../middleware/adminAuth');
const { redisClient } = require('../config/redis');

function saveSession(session) {
    return new Promise((resolve, reject) => {
        session.save(error => error ? reject(error) : resolve());
    });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

// POST /api/register-manager (Admin-only)
router.post('/register-manager', verifyAdminSecret, async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        if (![fullName, username, email, password].every(value => typeof value === 'string' && value.trim())) {
            return res.status(400).json({ success: false, error: 'Full name, username, email, and password are required.' });
        }
        const passwordCheck = validatePassword(password);
        if (!passwordCheck.isValid) {
            return res.status(400).json({ success: false, error: passwordCheck.errors[0] });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();
        // 1. Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
        });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this email or username already exists.' });
        }

        // The User model hashes passwords before saving.
        const newManager = await User.create({
            fullName,
            username: normalizedUsername,
            email: normalizedEmail,
            password,
            role: 'manager', // 🔒 Explicitly enforced by admin route
            isVerified: true // Auto-verify manager accounts created by admin
        });

        res.status(201).json({
            success: true,
            message: 'Manager account created successfully.',
            data: { id: newManager._id, email: newManager.email, role: newManager.role }
        });

    } catch (error) {
        console.error('Error creating manager account:', error);
        res.status(500).json({ success: false, error: 'Server error while creating manager account.' });
    }
});

// 1. Dispatch OTP & Save Role-Based Temp Session
router.post('/send-otp', async (req, res) => {
    try {
        const { email, fullName, username, password, role } = req.body;

        if (![email, fullName, username, password].every(value => typeof value === 'string' && value.trim())) {
            return res.status(400).json({ error: 'All fields are required to process your registration.' });
        }

        if (role === 'manager') {
            return res.status(403).json({ error: 'Manager accounts must be created by an administrator.' });
        }
        if (role && role !== 'student') {
            return res.status(400).json({ error: 'Unsupported account role.' });
        }

        const userRole = 'student';
        const trimmedUsername = username.trim();

        // RBAC Identifier validation
        if (userRole === 'student' && !/^\d+$/.test(trimmedUsername)) {
            return res.status(400).json({ error: 'Please enter a valid GCTU Index Number.' });
        }
        const passwordCheck = validatePassword(password);
        if (!passwordCheck.isValid) {
            return res.status(400).json({ error: passwordCheck.errors[0] });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Security check for existing credentials
        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: trimmedUsername }]
        });

        if (existingUser) {
            const conflictField = existingUser.email === normalizedEmail ? 'email address' : 'Index Number';
            return res.status(409).json({ error: `An account with this ${conflictField} is already registered.` });
        }

        // Generate 6-digit verification code
        const code = randomInt(100000, 1000000).toString();
        const purpose = 'signup';
        await OTP.deleteMany({ email: normalizedEmail, purpose });
        await OTP.create({
            email: normalizedEmail,
            codeHash: hashOtp(normalizedEmail, purpose, code),
            purpose,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.5;">
                <h2 style="color: #2b2d42;">GCTU StudentHostels Verification</h2>
                <p>Hello ${escapeHtml(fullName.trim())},</p>
                <p>Your verification code for <strong>Student Registration</strong> is:</p>
                <h1 style="color: #f4a261; letter-spacing: 3px; background: #f8f9fa; padding: 10px 15px; display: inline-block; border-radius: 6px;">${code}</h1>
                <p>This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
            </div>
        `;

        const emailResult = await sendEmail(normalizedEmail, 'Verify Your Account - GCTU StudentHostels', emailHtml);
        if (!emailResult.success) {
            return res.status(502).json({ error: 'Unable to send verification email. Please check your address and try again.' });
        }

        // Store role-aware payload into temporary session
        req.session.tempSignup = {
            fullName: fullName.trim(),
            username: trimmedUsername,
            email: normalizedEmail,
            passwordHash: await bcrypt.hash(password, 12),
            role: userRole,
            indexNumber: trimmedUsername,
            createdAt: Date.now()
        };

        await saveSession(req.session);
        res.status(200).json({ message: 'A verification code has been dispatched to your email address.' });

    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ error: 'An internal server error occurred while processing your request.' });
    }
});

// 2. Verify OTP & Create Role-Based User Record
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email address and verification code are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!isValidOtpCode(code)) {
            return res.status(400).json({ error: 'The verification code provided is invalid or has expired.' });
        }

        const { fullName, username, passwordHash, role, indexNumber, hostelName } = req.session.tempSignup || {};

        if (!fullName || !username || !passwordHash) {
            return res.status(401).json({ error: 'Your registration session has expired. Please restart the sign-up process.' });
        }
        if (req.session.tempSignup.email !== normalizedEmail) {
            return res.status(401).json({ error: 'This verification code does not match your registration session.' });
        }

        const userRole = role || 'student';
        if (userRole !== 'student') {
            return res.status(403).json({ error: 'Manager accounts must be created by an administrator.' });
        }

        // Secondary collision check before document insertion
        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ error: 'An account with these credentials already exists.' });
        }

        if (!await consumeOtp(normalizedEmail, 'signup', code)) {
            return res.status(400).json({ error: 'The verification code provided is invalid or has expired.' });
        }

        // Create Mongoose user instance safely
        const newUser = new User({
            fullName,
            username,
            email: normalizedEmail,
            password: passwordHash, // Pre-hashed in send-otp
            role: userRole,
            indexNumber: username
        });
        newUser.$locals.passwordAlreadyHashed = true;

        await newUser.save();

        // Clear temporary registration session
        delete req.session.tempSignup;
        await saveSession(req.session);

        res.status(201).json({
            message: 'Account successfully verified and created. You may now proceed to log in.',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                ...(newUser.role === 'student' ? { indexNumber: newUser.indexNumber } : { hostelName: newUser.hostelName })
            }
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ error: 'An internal server error occurred while verifying your account.' });
    }
});

//signup route
router.post('/signup', async (req, res) => {
    return res.status(403).json({
        error: ' Please complete OTP signup first.'
    });
});

//login route
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide your account identifier and password.' });
    }

    try {
        const trimmedIdentifier = username.trim();
        const normalizedEmail = trimmedIdentifier.toLowerCase();
        const expectedRole = role === 'manager' ? 'manager' : 'student';

        // Find user by Email, Username, IndexNumber, or HostelName
        const user = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: trimmedIdentifier },
                { indexNumber: trimmedIdentifier },
                { hostelName: trimmedIdentifier }
            ]
        }).select('+sessionVersion');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials. Please verify your details and try again.' });
        }

        // Enforce role separation (prevent student login on manager portal and vice versa)
        if (user.role !== expectedRole) {
            const portalType = expectedRole === 'manager' ? 'Hostel Manager' : 'Student';
            return res.status(403).json({ error: `This account is not authorized to log in through the ${portalType} portal.` });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials. Please verify your details and try again.' });
        }

        req.session.regenerate(async (err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.status(500).json({ error: 'Server error during login' });
            }

            req.session.userId = user._id;
            req.session.userRole = user.role;
            req.session.authVersion = user.sessionVersion || 0;

            req.session.save(async (saveErr) => {
                if (saveErr) {
                    console.error('Session save error:', saveErr);
                    return res.status(500).json({ error: 'Server error during login' });
                }
                try {
                    await redisClient.sAdd(`user_sessions:${user._id}`, req.sessionID);
                } catch (redisErr) {
                    console.error('Failed to track session in Redis:', redisErr);
                }

                res.status(200).json({
                    message: `Welcome back, ${user.fullName}!`,
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        ...(user.role === 'student' ? { indexNumber: user.indexNumber } : { hostelName: user.hostelName })
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
            const code = randomInt(100000, 1000000).toString();

            const purpose = 'password-reset';
            await OTP.deleteMany({ email: normalizedEmail, purpose });

            // Save new OTP (expires in 10 minutes)
            await OTP.create({
                email: normalizedEmail,
                codeHash: hashOtp(normalizedEmail, purpose, code),
                purpose,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            });

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

        const user = await User.findOne({ email: normalizedEmail }).select('+sessionVersion');
        if (!user) {
            return res.status(404).json({ error: 'If an account with that email exists, a password reset code has been sent.' });
        }

        user.password = newPassword;
        user.sessionVersion = (user.sessionVersion || 0) + 1;
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

        if (!await consumeOtp(normalizedEmail, 'password-reset', code)) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

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

module.exports = router;