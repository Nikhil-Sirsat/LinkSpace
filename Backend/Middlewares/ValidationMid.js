
import { userSchema, PostSchema, commentSchema, storySchema } from '../ShemaValidation/Schema.js';
import redisClient from '../config/redisClient.js';
import { delImgFromCloud } from '../Utils/Del-Img-from-Cloud.js';

// validate user
export const validateUser = async (req, res, next) => {

    const userData = {
        ...req.body,
        image: req.file ? req.file.path : req.user.image.url, // Use `req.file.path` for validation
    };

    let { error } = userSchema.validate(userData);
    if (error) {
        if (req.file && req.file.path) {
            await delImgFromCloud(req.file.path); // Delete the image from Cloudinary
        }
        return res.status(400).json({ error: error.details[0].message });
    } else {
        next();
    }
}

// validate post
export const validatePost = async (req, res, next) => {

    if (!req.file.path) {
        return res.status(400).json({ error: 'File not uploaded' });
    }

    // validate post data
    const postData = {
        ...req.body,
        imageUrl: req.file.path, // Use `req.file.path` for validation
    };

    let { error } = PostSchema.validate(postData);
    if (error) {
        await delImgFromCloud(req.file.path); // Delete the image from Cloudinary
        return res.status(400).json({ error: error.details[0].message });
    } else {
        next();
    }
};

// validate Story
export const validateStory = async (req, res, next) => {

    if (!req.file.path) {
        return res.status(400).json({ error: 'File not uploaded' });
    }

    const storyData = {
        ...req.body,
        mediaUrl: req.file.path, // Use `req.file.path` for validation
    };

    let { error } = storySchema.validate(storyData);
    if (error) {
        await delImgFromCloud(req.file.path); // Delete the image from Cloudinary
        return res.status(400).json({ error: error.details[0].message });
    } else {
        next();
    }
};

// validate comment
export const validateComment = (req, res, next) => {
    let { error } = commentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    } else {
        next();
    }
};

// Middleware for caching
export const checkCacheData = (keyBuilder, dataName) => async (req, res, next) => {
    try {
        // Generate the key dynamically if keyBuilder is a function
        const cacheKey = typeof keyBuilder === 'function' ? keyBuilder(req) : keyBuilder;

        // Fetch data from Redis
        const cacheData = await redisClient.get(cacheKey);

        if (cacheData) {
            // console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({
                [dataName]: JSON.parse(cacheData),
                message: `Fetched from Cache: ${dataName}`,
            });
        }

        // console.log(`Cache miss for key: ${cacheKey}`);
        res.locals.cacheKey = cacheKey; // Save the key for later use
        next(); // Proceed to the route logic
    } catch (error) {
        console.error('Redis cache error:', error);
        next(); // Allow the request to proceed even if Redis fails
    }
};