
import User from '../models/user.js';
import Post from '../models/posts.js';
import Follow from '../models/Follow.js';
import redisClient from '../config/redisClient.js';
import { moderateText, analyzeImage, extractTextFromImage, } from '../Utils/postAnalysis.js';

export const signUp = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'Profile Picture not uploaded' });
        }

        const { username, name, email, age, gender, bio, password } = req.body;

        // TXT Moderation
        const TXTcheck = await moderateText(username + " " + name + " " + bio);
        if (TXTcheck == true) {
            return res.status(400).json({ error: 'inappropriate or violent content detected' });
        }

        // get url & fileName from cloudinary
        let url = req.file.path;
        let filename = req.file.filename;

        // Analyze if the Image is SAFE || NOT
        const nsfwScore = await analyzeImage(url);
        if (nsfwScore > 0.5) {
            return res.status(400).json({ error: 'Image contains inappropriate or violent content.' });
        }

        // Extract Text from Image 
        const extractedTXT = await extractTextFromImage(url);

        if (!extractedTXT || extractedTXT.trim() === '') {
            console.log("No text extracted from image.");
        } else {
            // extracted txt moderation
            const imgTXT = await moderateText(extractedTXT);
            if (imgTXT == true) {
                return res.status(400).json({ error: 'Image contains inappropriate or violent content.' });
            }
        }

        // new user
        const newUser = new User({ username, name, email, age, gender, bio });
        newUser.image = { url, filename }

        await User.register(newUser, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
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
        const TXTcheck = await moderateText(username + " " + name + " " + bio);
        if (TXTcheck == true) {
            return res.status(400).json({ message: 'inappropriate or violent content detected' });
        }

        // Find user before update
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        // **Check if the username or email already exists (excluding the current user)**
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== id) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== id) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // **Verify password before allowing update**
        const isPasswordValid = await user.authenticate(password);
        if (!isPasswordValid.user) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // **Prepare update object**
        const updateData = { name, username, email, age, gender, bio };

        // **Check if an image is uploaded**
        if (req.file) {

            // get url & fileName from cloudinary
            let url = req.file.path;
            let filename = req.file.filename;

            // Analyze if the Image is SAFE || NOT
            const nsfwScore = await analyzeImage(url);
            if (nsfwScore > 0.5) {
                return res.status(400).json({ message: 'Image contains inappropriate or violent content.' });
            }

            // Extract Text from Image 
            const extractedTXT = await extractTextFromImage(url);

            if (!extractedTXT || extractedTXT.trim() === '') {
                console.log("No text extracted from image.");
            } else {
                // extracted txt moderation
                const imgTXT = await moderateText(extractedTXT);
                if (imgTXT == true) {
                    return res.status(400).json({ message: 'Image contains inappropriate or violent content.' });
                }
            }

            // update image
            updateData.image = { url, filename };
        }

        // **Update the user**
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ message: 'User information updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'An error occurred while updating user information', error: error.message });
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

        res.status(200).json({
            user: user,
            posts: posts,
            followersCount: followersCount,
            followingCount: followingCount,
            isFollowing: !!isFollowing,  // Convert to boolean
            message: 'User fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error Fetching User Profile', error: error.message });
    }
};