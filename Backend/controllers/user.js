
import User from '../models/user.js';
import Post from '../models/posts.js';
import Follow from '../models/Follow.js';
import redisClient from '../config/redisClient.js';
import { moderateText, analyzeImage } from '../Utils/postAnalysis.js';
import { delImgFromCloud } from '../Utils/Del-Img-from-Cloud.js';

export const signUp = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'Profile Picture not uploaded' });
        }

        const { username, name, email, age, gender, bio, password } = req.body;

        // get url & fileName from cloudinary
        let url = req.file.path;
        let filename = req.file.filename;

        // **Check if the username or email already exists (excluding the current user)**
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            await delImgFromCloud(url); // Delete the image from Cloudinary
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            await delImgFromCloud(url); // Delete the image from Cloudinary
            return res.status(400).json({ error: 'Email already exists' });
        }

        // image analysis
        const { status, message } = await analyzeImage(url);

        if (status === false) {
            await delImgFromCloud(url); // Delete the image from Cloudinary
            return res.status(400).json({ error: message });
        }

        // TXT Moderation
        const { isClean, msg } = await moderateText(username + " " + name + " " + bio);
        if (isClean === false) {
            await delImgFromCloud(url); // Delete the image from Cloudinary
            return res.status(400).json({ error: msg });
        }

        // new user
        const newUser = new User({ username, name, email, age, gender, bio });
        newUser.image = { url, filename }

        await User.register(newUser, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};

export const Login = (req, res) => {
    res.status(200).json({ user: req.user, message: 'Login successful' });
};

export const LogOut = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};

export const protectedRoute = (req, res) => {
    res.status(200).json({ user: req.user, message: 'This is a protected route' });
};

export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, email, password, age, gender, bio } = req.body;

        // TXT Moderation
        const { isClean, msg } = await moderateText(username + " " + name + " " + bio);
        if (isClean === false) {
            if (req.file?.path) { await delImgFromCloud(req.file.path) } // Delete the image from Cloudinary
            return res.status(400).json({ error: msg });
        }

        // Find user before update
        const user = await User.findById(id);
        if (!user) {
            if (req.file?.path) { await delImgFromCloud(req.file.path) } // Delete the image from Cloudinary
            return res.status(404).json({ error: 'User Not Found' });
        }

        // **Check if the username or email already exists (excluding the current user)**
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== id) {
            if (req.file?.path) { await delImgFromCloud(req.file.path) } // Delete the image from Cloudinary
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== id) {
            if (req.file?.path) { await delImgFromCloud(req.file.path) } // Delete the image from Cloudinary
            return res.status(400).json({ error: 'Email already exists' });
        }

        // **Verify password before allowing update**
        const isPasswordValid = await user.authenticate(password);
        if (!isPasswordValid.user) {
            if (req.file?.path) { await delImgFromCloud(req.file.path) } // Delete the image from Cloudinary
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // **Prepare update object**
        const updateData = { name, username, email, age, gender, bio };

        // **Check if an image is uploaded**
        if (req.file) {

            // get url & fileName from cloudinary
            let url = req.file.path;
            let filename = req.file.filename;

            // image analysis
            const { status, message } = await analyzeImage(url);

            if (status === false) {
                await delImgFromCloud(url); // Delete the image from Cloudinary
                return res.status(400).json({ error: message });
            }

            // delete previous image from cloudinary
            if (user.image && user.image.url) {
                const prevImgUrl = user.image.url;
                await delImgFromCloud(prevImgUrl); // Delete the image from Cloudinary
            }

            // update image
            updateData.image = { url, filename };
        }

        // **Update the user**
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        // clear profile cache
        await redisClient.del(`Profile${req.user.username}`);

        return res.status(200).json({ message: 'User information updated successfully' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating user information', error: error.message });
    }
};

export const search = async (req, res) => {
    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        // Search for users whose username starts with the search query (case-insensitive)
        const users = await User.find({
            username: { $regex: new RegExp('^' + searchQuery, 'i') }
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('username name image followersCount');

        const totalUsers = await User.countDocuments({
            username: { $regex: new RegExp('^' + searchQuery, 'i') }
        });

        res.json({ data: users, hasMore: (page * limit) < totalUsers });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const suggested = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Get a list of users the current user already follows
        const following = await Follow.find({ follower: currentUserId }).distinct('following');

        // Find suggested users based on common followings
        const suggestions = await User.aggregate([
            // Exclude the current user and already followed users
            {
                $match: {
                    _id: { $nin: [...following, currentUserId] }
                }
            },
            // Calculate the number of common followings
            {
                $lookup: {
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'follower',
                    as: 'followerData'
                }
            },
            {
                $addFields: {
                    commonFollowings: {
                        $size: {
                            $setIntersection: [
                                '$followerData.following',
                                following
                            ]
                        }
                    }
                }
            },
            // Sort by the highest number of common followings
            { $sort: { commonFollowings: -1 } },
            // Limit to 5 suggestions
            { $limit: 5 },
            // Select the needed fields
            {
                $project: {
                    username: 1,
                    name: 1,
                    image: 1,
                    followersCount: 1,
                    commonFollowings: 1
                }
            }
        ]);

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(suggestions));

        res.json({ suggestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user._id;  // Get the ID of the current user making the request

        const user = await User.findOne({ username: username }).select('image username name followersCount followingCount bio');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.find({ owner: user._id }).select('imageUrl likeCount');

        // Get followers and following counts
        const followersCount = await Follow.countDocuments({ following: user._id });
        const followingCount = await Follow.countDocuments({ follower: user._id });

        // Check if the current user is following this user
        const isFollowing = await Follow.exists({ follower: currentUserId, following: user._id });

        const profile = {
            user: user,
            posts: posts,
            followersCount: followersCount,
            followingCount: followingCount,
            isFollowing: !!isFollowing  // Convert to boolean
        };

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(profile));

        res.status(200).json({
            profile: profile,
            message: 'User fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error Fetching User Profile', error: error.message });
    }
};