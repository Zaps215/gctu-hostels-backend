const mongoose = require('mongoose');


const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    code: {
        type: String,
        required: true
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

module.exports = mongoose.model('OTP', OTPSchema);