
import Post from '../models/posts.js';
import Follow from '../models/Follow.js';
import User from '../models/user.js';
import Notification from '../models/Notification.js';
import redisClient from '../config/redisClient.js';
import analyzeImage from '../Utils/postAnalysis.js';

export const createPost = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File not uploaded' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Form data is empty' });
    }


    const { caption, taggedUsers } = req.body;
    const io = req.app.get('io'); // Get the io instance from the app

    // console.log(req.file);
    // console.log(req.body);

    try {
        // Create a new post with the owner and tagged users
        const newPost = new Post({
            caption,
            owner: req.user._id,
            taggedUsers
        });

        let url = req.file.path;
        let filename = req.file.filename;

        // Analyze if the Image is SAFE || NOT
        const nsfwScore = await analyzeImage(url);
        if (nsfwScore > 0.5) {
            return res.status(400).json({ error: 'Image contains inappropriate or violent content.' });
        }

        newPost.imageUrl = { url, filename }

        // Save the post
        const savedPost = await newPost.save();

        // Update the tagged users' `taggedInPosts` field
        if (taggedUsers && taggedUsers.length > 0) {
            await User.updateMany(
                { _id: { $in: taggedUsers } },
                { $push: { taggedInPosts: savedPost._id } }
            );

            // Send notifications to all tagged users
            for (const taggedUserId of taggedUsers) {
                const newNotification = new Notification({
                    senderId: req.user._id,
                    receiverId: taggedUserId,
                    message: `${req.user.username} tagged you in a post`,
                    type: 'tagged',
                    postId: savedPost._id,
                });

                await newNotification.save();

                // Emit 'sendNotification' event to the tagged user
                io.to(taggedUserId).emit('sendNotification', newNotification);
            }
        }

        res.status(201).json({ post: savedPost, message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const trendingPosts = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query; // Default to page 1, 10 posts per page
        const skip = (page - 1) * limit;

        // Fetch trending posts directly using likeCount and createdAt for sorting
        const posts = await Post.find()
            .sort({ likeCount: -1, createdAt: -1 }) // Trending by likes, then by creation date
            .skip(skip)
            .limit(Number(limit))
            .select(' imageUrl createdAt likeCount'); // Select only needed fields

        // Check if there are more posts to load
        const totalPosts = await Post.countDocuments();
        const hasMore = skip + posts.length < totalPosts;

        res.status(200).json({ trendingPosts: posts, hasMore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getHomePostFeed = async (req, res) => {
    try {

        // Query Data Base
        const currentUserId = req.user._id;

        // Find the users that the current user is following
        const followingUsers = await Follow.find({ follower: currentUserId }).select('following');

        // Extract the array of user IDs the current user is following
        const followingIds = followingUsers.map(follow => follow.following);

        // Find the 5 most recent posts created by users the current user is following
        const posts = await Post.find({ owner: { $in: followingIds } })
            .sort({ createdAt: -1 })  // Sort by createdAt in descending order (most recent first)
            .limit(5)                 // Limit to 5 posts
            .populate('owner', 'image username')
            .populate({
                path: "taggedUsers", // The field to populate
                select: "username" // Select the fields you need
            })        // Optionally, populate the owner field with user info
            .exec();

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(posts));

        res.status(200).json({ posts: posts });
    } catch (error) {
        console.error('Error in fetching Home feed');
        res.status(500).json({ message: `Error fetching posts: ${error.message}` });
    }
};

export const getTaggedPosts = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all posts where the userId is in the taggedUsers array
        const posts = await Post.find({ taggedUsers: userId }).select('imageUrl likeCount');

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(posts));

        // Return the posts
        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Internal Server Error : ${error.message}` });
    }
};

export const showPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
            .populate({
                path: "comments", populate: {
                    path: "author",
                    select: "image username"
                },
            })
            .populate("owner", "image username")
            .populate({
                path: "taggedUsers",
                select: "username"
            });

        if (!post) {
            return res.status(404).json({ message: 'Post Not Found' });
        }

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(post));

        res.status(200).json({ post: post, message: 'post found successfully' });
    } catch (error) {
        console.error('An Error occured While fetching a post : ', error.message);
        res.status(500).json({ message: `Internal Server Error : ${error.message}` });
    }
};

export const delPost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post Not Found' });
        }

        // clear cache
        redisClient.del(`${req.params.id}`);

        res.status(200).json({ message: 'Post Deleted Successfully' });
    } catch (error) {
        console.error('An Error occured while deleting a post : ', error.message);
        res.status(500).json({ message: `Error Deleting Post : ${error.message}` });
    }
};

export const postSuggestions = async (req, res) => {
    try {
        // Fetch random posts using aggregation
        const suggPosts = await Post.aggregate([{ $sample: { size: 10 } }]);

        // Manually populate the 'owner' and 'taggedUsers' fields
        const populatedPosts = await Post.populate(suggPosts, [
            { path: "owner", select: "image username" },
            { path: "taggedUsers", select: "username" }
        ]);

        res.status(200).json({ posts: populatedPosts, message: 'got suggested posts successfully' });
    } catch (error) {
        console.error('Error Fetching Post Suggestion : ', error.message);
        res.status(500).json({ message: `Error Fetching Suggested Posts : ${error.message}` });
    }
};