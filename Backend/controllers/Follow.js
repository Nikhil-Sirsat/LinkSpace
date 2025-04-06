
import User from '../models/user.js';
import Follow from '../models/Follow.js';
import redisClient from '../config/redisClient.js';

export const follow = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user._id;

        const user = await User.findOne({ username: username });
        const userId = user._id;

        if (userId.equals(currentUserId)) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        // Check if the user already follows the other user
        const existingFollow = await Follow.findOne({ follower: currentUserId, following: userId });

        if (existingFollow) {
            return res.status(400).json({ message: "You already follow this user" });
        }

        const follow = new Follow({
            follower: currentUserId,
            following: userId
        });

        await follow.save();

        // Update followers and following count
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });
        await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });

        // clear cache
        // follow & unfollow
        await redisClient.del(`${req.params.username}:followers`);
        await redisClient.del(`${req.user.username}:following`);
        // profiles
        await redisClient.del(`Profile:${req.params.username}`);
        await redisClient.del(`Profile:${req.user.username}`);

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const unfollow = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user._id;

        const user = await User.findOne({ username: username });
        const userId = user._id;

        // Check if the user currently follows the other user
        const existingFollow = await Follow.findOne({ follower: currentUserId, following: userId });

        if (!existingFollow) {
            return res.status(400).json({ message: "You do not follow this user" });
        }

        await Follow.findOneAndDelete({ follower: currentUserId, following: userId });

        // Update followers and following count
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });
        await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });

        // clear cache
        // follow & unfollow
        await redisClient.del(`${req.params.username}:followers`);
        await redisClient.del(`${req.user.username}:following`);
        // profiles
        await redisClient.del(`Profile:${req.params.username}`);
        await redisClient.del(`Profile:${req.user.username}`);

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username });
        const userId = await user._id;

        const followers = await Follow.find({ following: userId })
            .populate('follower', "image username name");

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(followers));

        res.status(200).json({ followers: followers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFollowings = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username });
        const userId = await user._id;

        const following = await Follow.find({ follower: userId })
            .populate('following', "image username name");

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(following));

        res.status(200).json({ following: following });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const isFollow = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user._id;

        const user = await User.findOne({ username: username }).select('username name');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = await Follow.exists({ follower: currentUserId, following: user._id });
        res.status(200).json({ isFollowing: !!isFollowing, user });
    } catch (error) {
        res.status(500).json({ message: 'Error Fetching isFollow Status', error: error.message });
    }
}