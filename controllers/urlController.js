const Url = require('../models/Url');
const shortid = require('shortid');
const redisClient = require('../config/redis');

const CACHE_EXPIRATION_TIME = 3600;

exports.shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;
    const baseUrl = process.env.BASE_URL;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const shortUrlCode = shortid.generate();
    const shortUrl = `${baseUrl}/${shortUrlCode}`;

    const url = new Url({ originalUrl, shortUrl });
    await url.save();
    await redisClient.setEx(shortUrlCode, CACHE_EXPIRATION_TIME, originalUrl);

    res.json({ shortUrl });
};

exports.redirectUrl = async (req, res) => {
    const { code } = req.params;
    try {
        const cachedUrl = await redisClient.get(code);
        if (cachedUrl) {
            console.log('Cache hit');
            return res.redirect(cachedUrl);
        }

        console.log('Cache miss');
        const url = await Url.findOne({ shortUrl: `${process.env.BASE_URL}/${code}` });
        console.log( `${process.env.BASE_URL}/${code}`);
        if (url) {
            await redisClient.setEx(code, CACHE_EXPIRATION_TIME, url.originalUrl);
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
