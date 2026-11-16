const assert = require('node:assert/strict');
const { afterEach, beforeEach, test } = require('node:test');

process.env.OTP_SECRET = 'test-only-otp-secret';

const OTP = require('../models/OTP');
const { consumeOtp, hashOtp, isValidOtpCode, OTP_MAX_ATTEMPTS } = require('../utils/otpSecurity');

const originalMethods = {
    findOne: OTP.findOne,
    findOneAndUpdate: OTP.findOneAndUpdate,
    updateOne: OTP.updateOne
};

let record;

function matchesRecord(query) {
    if (!record) return false;

    return Object.entries(query).every(([key, expected]) => {
        if (key === 'expiresAt') return record.expiresAt > expected.$gt;
        if (key === 'attempts') return record.attempts < expected.$lt;
        return record[key] === expected;
    });
}

beforeEach(() => {
    record = {
        _id: 'otp-test-id',
        email: 'student@example.com',
        purpose: 'signup',
        codeHash: hashOtp('student@example.com', 'signup', '123456'),
        expiresAt: new Date(Date.now() + 60_000),
        used: false,
        attempts: 0
    };

    OTP.findOne = async query => matchesRecord(query) ? { ...record } : null;
    OTP.updateOne = async (query, update) => {
        if (!matchesRecord(query)) return { matchedCount: 0 };
        record.attempts += update.$inc.attempts;
        return { matchedCount: 1 };
    };
    OTP.findOneAndUpdate = async (query, update) => {
        if (!matchesRecord(query)) return null;
        Object.assign(record, update.$set);
        return { ...record };
    };
});

afterEach(() => {
    OTP.findOne = originalMethods.findOne;
    OTP.findOneAndUpdate = originalMethods.findOneAndUpdate;
    OTP.updateOne = originalMethods.updateOne;
});

test('OTP hashes are scoped to email and purpose', () => {
    const digest = hashOtp('student@example.com', 'signup', '123456');

    assert.match(digest, /^[a-f0-9]{64}$/);
    assert.notEqual(digest, hashOtp('other@example.com', 'signup', '123456'));
    assert.notEqual(digest, hashOtp('student@example.com', 'password-reset', '123456'));
    assert.equal(isValidOtpCode('123456'), true);
    assert.equal(isValidOtpCode('12345'), false);
    assert.equal(isValidOtpCode('123456x'), false);
});

test('wrong guesses increment attempts and the fifth guess exhausts the OTP', async () => {
    for (let attempt = 1; attempt <= OTP_MAX_ATTEMPTS; attempt += 1) {
        assert.equal(await consumeOtp(record.email, record.purpose, '654321'), false);
        assert.equal(record.attempts, attempt);
    }

    assert.equal(await consumeOtp(record.email, record.purpose, '123456'), false);
    assert.equal(record.used, false);
});

test('a valid OTP is consumed once and cannot be replayed', async () => {
    assert.equal(await consumeOtp(record.email, record.purpose, '123456'), true);
    assert.equal(record.used, true);
    assert.equal(await consumeOtp(record.email, record.purpose, '123456'), false);
});

test('an OTP cannot be used for a different purpose', async () => {
    assert.equal(await consumeOtp(record.email, 'password-reset', '123456'), false);
    assert.equal(record.used, false);
    assert.equal(record.attempts, 0);
});
