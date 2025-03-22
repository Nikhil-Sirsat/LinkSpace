
import Post from '../models/posts.js';
import Like from '../models/like.js';
import redisClient from '../config/redisClient.js';

export const like = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        // Check if the user already liked the post
        const existingLike = await Like.findOne({ postId, userId });
        if (existingLike) {
            return res.status(400).json({ message: 'Post already liked by user' });
        }

        // Create a new like
        const like = new Like({ postId, userId });
        await like.save();

        // update the like count in the post
        await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

        // clear liked-users cache
        await redisClient.del(`${req.params.id}:LikedUsers`);

        res.status(201).json({ message: 'Post liked successfully', like });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'An error occurred while liking the post' });
    }
};

export const unlike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        // Check if the user has liked the post
        const existingLike = await Like.findOne({ postId, userId });
        if (!existingLike) {
            return res.status(400).json({ message: 'Post not liked by user' });
        }

        // Remove the like
        await Like.deleteOne({ postId, userId });

        // decrement the like count in the post
        await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });

        await redisClient.del(`${req.params.id}:LikedUsers`);

        res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ message: 'An error occurred while unliking the post' });
    }
};

export const isLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const existingLike = await Like.findOne({ postId, userId });
        res.json({ isLiked: !!existingLike });
    } catch (error) {
        res.status(500).json({ message: 'Error getting isLiked Status', error: error.message });
    }
};

export const getLikedUsers = async (req, res) => {
    try {
        const { postId } = req.params;

        // get all likes for the given post
        const likes = await Like.find({ postId }).populate('userId', 'name username image');

        // Extract user data from likes
        const users = likes.map(like => like.userId);

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(users));

        res.status(200).json({ users: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error Fetching Liked Users', error: error.message });
    }
};