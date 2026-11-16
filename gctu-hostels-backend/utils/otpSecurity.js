const { createHmac, timingSafeEqual } = require('crypto');
const OTP = require('../models/OTP');

const OTP_MAX_ATTEMPTS = 5;

function isValidOtpCode(code) {
    return typeof code === 'string' && /^\d{6}$/.test(code.trim());
}

function hashOtp(email, purpose, code) {
    const secret = process.env.OTP_SECRET || process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error('OTP_SECRET or SESSION_SECRET must be configured.');
    }

    return createHmac('sha256', secret)
        .update(`${purpose}\0${email}\0${code.trim()}`)
        .digest('hex');
}

function matchesOtp(code, storedHash, email, purpose) {
    if (!isValidOtpCode(code) || typeof storedHash !== 'string' || !/^[a-f\d]{64}$/i.test(storedHash)) {
        return false;
    }

    const candidateHash = Buffer.from(hashOtp(email, purpose, code), 'hex');
    const savedHash = Buffer.from(storedHash, 'hex');
    return timingSafeEqual(candidateHash, savedHash);
}

async function consumeOtp(email, purpose, code) {
    if (!isValidOtpCode(code)) {
        return false;
    }

    const now = new Date();
    const otpRecord = await OTP.findOne({
        email,
        purpose,
        expiresAt: { $gt: now },
        used: false,
        attempts: { $lt: OTP_MAX_ATTEMPTS }
    });

    if (!otpRecord) {
        return false;
    }

    if (!matchesOtp(code, otpRecord.codeHash, email, purpose)) {
        await OTP.updateOne(
            {
                _id: otpRecord._id,
                used: false,
                expiresAt: { $gt: now },
                attempts: { $lt: OTP_MAX_ATTEMPTS }
            },
            { $inc: { attempts: 1 } }
        );
        return false;
    }

    const consumed = await OTP.findOneAndUpdate(
        {
            _id: otpRecord._id,
            codeHash: otpRecord.codeHash,
            used: false,
            expiresAt: { $gt: new Date() },
            attempts: { $lt: OTP_MAX_ATTEMPTS }
        },
        { $set: { used: true } },
        { new: true }
    );

    return Boolean(consumed);
}

module.exports = { consumeOtp, hashOtp, isValidOtpCode, OTP_MAX_ATTEMPTS };
