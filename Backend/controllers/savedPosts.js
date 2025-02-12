
import SavedPost from '../models/savedPosts.js';
import redisClient from '../config/redisClient.js';

export const save = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.params;

        const existingSavedPost = await SavedPost.findOne({ user: userId, post: postId });

        if (existingSavedPost) {
            return res.status(400).json({ message: 'Post is already saved' });
        }

        const savedPost = new SavedPost({ user: userId, post: postId });
        await savedPost.save();

        // clear cache
        redisClient.del(`saved-posts:${req.user._id}`);

        res.status(200).json({ message: 'Post saved successfully' });
    } catch (error) {
        console.error('An Error occure while saving a Post : ', error.message);
        res.status(500).json({ error: 'Failed to save post' });
    }
};

export const unSave = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.params;
        const existingSavedPost = await SavedPost.findOne({ user: userId, post: postId });

        if (!existingSavedPost) {
            return res.status(400).json({ message: 'Post is not saved' });
        }

        await SavedPost.findOneAndDelete({ user: userId, post: postId });

        // clear cache
        redisClient.del(`saved-posts:${req.user._id}`);

        res.status(200).json({ message: 'Post unsaved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unsave post' });
    }
};

export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const savedPosts = await SavedPost.find({ user: userId }).populate('post', 'imageUrl');

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(savedPosts));

        res.status(200).json({ savedPosts: savedPosts });
    } catch (error) {
        console.error('An Error occured while fetching a saved-posts : ', error.message);
        res.status(500).json({ error: 'Failed to retrieve saved posts' });
    }
};

export const isSave = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const existingSave = await SavedPost.findOne({ user: userId, post: postId });
        res.json({ isSaved: !!existingSave });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};