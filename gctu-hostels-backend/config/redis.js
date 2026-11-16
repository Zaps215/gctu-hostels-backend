const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || (
    process.env.NODE_ENV === 'production' ? undefined : 'redis://127.0.0.1:6379'
);

if (!redisUrl) {
    throw new Error('REDIS_URL must be configured in production.');
}

if (process.env.NODE_ENV === 'production' && new URL(redisUrl).protocol !== 'rediss:') {
    throw new Error('REDIS_URL must use TLS (rediss://) in production.');
}

const redisClient = createClient({ url: redisUrl });

redisClient.on('error', error => {
    console.error('Redis client error:', error);
});

redisClient.on('ready', () => {
    console.log('Connected to Redis');
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

module.exports = { connectRedis, redisClient };
