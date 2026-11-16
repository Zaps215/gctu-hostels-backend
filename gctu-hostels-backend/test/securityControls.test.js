const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const User = require('../models/User');
const isAuthenticated = require('../middleware/auth');
const validatePassword = require('../utils/passwordValidator');

test('authenticated sessions are rejected after their version is revoked', async () => {
    const originalFindById = User.findById;
    const response = {
        headers: {},
        statusCode: 0,
        body: null,
        set(name, value) { this.headers[name] = value; return this; },
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; }
    };
    let continued = false;

    User.findById = () => ({
        select: async () => ({ sessionVersion: 2 })
    });

    try {
        await isAuthenticated(
            { session: { userId: 'user-id', authVersion: 1 } },
            response,
            () => { continued = true; }
        );
    } finally {
        User.findById = originalFindById;
    }

    assert.equal(response.statusCode, 401);
    assert.equal(response.body.error, 'Not authenticated');
    assert.equal(response.headers['Cache-Control'], 'no-store');
    assert.equal(continued, false);
});

test('production Redis URLs must use TLS', () => {
    const result = spawnSync(process.execPath, [
        '-e',
        "require('./config/redis')"
    ], {
        cwd: __dirname + '/..',
        env: {
            ...process.env,
            NODE_ENV: 'production',
            REDIS_URL: 'redis://redis.example.com:6379'
        },
        encoding: 'utf8'
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must use TLS/);
});

test('password validation rejects values bcrypt would truncate', () => {
    assert.equal(validatePassword('Strong!Pass123').isValid, true);
    assert.equal(validatePassword(`Strong!Pass123${'a'.repeat(60)}`).isValid, false);
    assert.equal(validatePassword({}).isValid, false);
});
