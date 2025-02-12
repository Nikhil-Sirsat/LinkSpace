
import { userSchema, PostSchema, commentSchema, storySchema } from '../ShemaValidation/Schema.js';
import redisClient from '../config/redisClient.js';

// validate user
export const validateUser = (req, res, next) => {
    const userData = {
        ...req.body,
        image: req.file ? req.file.path : undefined, // Use `req.file.path` for validation
    };

    let { error } = userSchema.validate(userData);
    if (error) {
        console.log('error in user schema : ', error);
        return res.status(400).json({ error: error.details[0].message });
    } else {
        next();
    }
}

// validate post
export const validatePost = (req, res, next) => {
    // Add `imageUrl` validation based on `req.file`
    const postData = {
        ...req.body,
        imageUrl: req.file ? req.file.path : undefined, // Use `req.file.path` for validation
    };

    let { error } = PostSchema.validate(postData);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    } else {
        next();
    }
};

// validate Story
export const validateStory = (req, res, next) => {
    const storyData = {
        ...req.body,
        mediaUrl: req.file ? req.file.path : undefined, // Use `req.file.path` for validation
    };

    let { error } = storySchema.validate(storyData);
    if (error) {
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