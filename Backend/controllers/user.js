
import User from '../models/user.js';
import Post from '../models/posts.js';
import Follow from '../models/Follow.js';
import redisClient from '../Utils/redisClient.js';

export const signUp = async (req, res) => {
    try {
        const { username, name, email, age, gender, bio, password } = req.body;
        const newUser = new User({ username, name, email, age, gender, bio });

        let url = req.file.path;
        let filename = req.file.filename;
        newUser.image = { url, filename }


        await User.register(newUser, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
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
        const updateData = req.body;

        const userBeforeUpdate = await User.findById(id);
        if (!userBeforeUpdate) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            user.image = { url, filename }

            await user.save();
        }

        // Check if the update actually changed any data
        if (JSON.stringify(userBeforeUpdate.toObject()) === JSON.stringify(user.toObject())) {
            console.log('User information not updated');
            return res.status(401).json({ message: 'user information not updated ' });
        }

        if (user) {
            return res.status(200).json({ message: 'User Information Updated Successfully' });
        } else {
            return res.status(404).json({ message: 'User Not Found' });
        }

    } catch (error) {
        console.log('Error in try-catch: ', error);
        res.status(500).json({ message: 'An error occurred while updating user information', error: error.message });
    }
};

export const checkPass = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ valid: false });
        }

        user.authenticate(password, (err, user, passwordError) => {
            if (err || passwordError) {
                return res.status(400).json({ valid: false });
            }
            return res.status(200).json({ valid: true });
        });
    } catch (error) {
        console.error('Error checking password:', error);
        res.status(500).json({ valid: false, message: error.message });
    }
};

export const search = async (req, res) => {
    const searchQuery = req.query.q;  // 'q' is the search term from the frontend
    const page = parseInt(req.query.page) || 1;  // Get the page number from query, default to 1
    const limit = parseInt(req.query.limit) || 10;  // Get the limit from query, default to 10

    try {
        // Search for users whose username starts with the search query (case-insensitive)
        const users = await User.find({
            username: { $regex: new RegExp('^' + searchQuery, 'i') }  // 'i' for case-insensitive
        })
            .skip((page - 1) * limit)  // Skip the number of results based on the page
            .limit(limit)  // Limit the result to a set number of users
            .select('username name image followersCount');  // Return only necessary fields

        // Optional: Count the total number of matching users for pagination purposes
        const totalUsers = await User.countDocuments({
            username: { $regex: new RegExp('^' + searchQuery, 'i') }
        });

        res.json({ data: users, hasMore: (page * limit) < totalUsers });  // Determine if there are more users to load

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

        // Find 5 users that the current user does not follow
        const suggestions = await User.find({
            _id: { $nin: [...following, currentUserId] } // Exclude followed users and the current user
        })
            .limit(5) // Limit to 5 users
            .select('username name image followersCount');

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(suggestions));

        res.json({ suggestions: suggestions });
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

        const posts = await Post.find({ owner: user._id }).select('imageUrl');

        // Get followers and following counts
        const followersCount = await Follow.countDocuments({ following: user._id });
        const followingCount = await Follow.countDocuments({ follower: user._id });

        // Check if the current user is following this user
        const isFollowing = await Follow.exists({ follower: currentUserId, following: user._id });

        res.status(200).json({
            user: user,
            posts: posts,
            followersCount: followersCount,
            followingCount: followingCount,
            isFollowing: !!isFollowing,  // Convert to boolean
            message: 'User fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ message: `Error fetching user: ${error.message}` });
    }
};