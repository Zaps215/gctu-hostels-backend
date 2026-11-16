const mongoose = require('mongoose');


const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    codeHash: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ['signup', 'password-reset']
    },
    attempts: {
        type: Number,
        default: 0,
        min: 0
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    },
    used: {
        type: Boolean,
        default: false
    }
});

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', OTPSchema);