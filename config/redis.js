const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URI || 'redis://127.0.0.1:6379'
});

client.connect()
    .then(() => console.log('Redis client connected'))
    .catch((err) => console.error('Redis connection error:', err));

module.exports = client;
