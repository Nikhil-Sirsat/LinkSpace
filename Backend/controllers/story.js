
import Story from '../models/story.js';
import Follow from '../models/Follow.js';
import User from '../models/user.js';
import redisClient from '../config/redisClient.js';

export const postStory = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File not uploaded' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Form data is empty' });
    }
    try {
        const owner = req.user._id;
        const { caption } = req.body;

        // Create new story
        const newStory = new Story({ caption, owner });
        let url = req.file.path;
        let filename = req.file.filename;

        newStory.mediaUrl = { url, filename };

        const savedStory = await newStory.save();

        res.status(201).json({ savedStory, message: 'Story posted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post the story' });
    }
};

export const getStoryList = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the list of users the current user is following
        const following = await Follow.find({ follower: userId }).populate('following');

        // Get the IDs of the followed users
        const followingIds = following.map(f => f.following._id);

        // Find stories where the owner is in the list of following users
        const stories = await Story.find({ owner: { $in: followingIds } })
            .populate('owner', 'image username'); // Populate the owner field with user details

        // Map the stories to extract the owner (followed users who have stories)
        const usersWithStories = [...new Set(stories.map(story => story.owner))];

        // Cache the data in Redis
        const cacheKey = res.locals.cacheKey;
        await redisClient.setEx(cacheKey, 120, JSON.stringify(usersWithStories));

        res.status(200).json({ usersWithStories: usersWithStories });
    } catch (error) {
        console.error('An Error occured while fetching users with story');
        res.status(500).json({ error: error.message });
    }
};

export const markView = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user._id;

        // Use $addToSet to add userId to viewers array if it doesn't already exist
        const result = await Story.findByIdAndUpdate(
            storyId,
            { $addToSet: { viewers: userId } }, // Ensures no duplicate entries in viewers array
            { new: true } // Returns the updated document
        );

        if (!result) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json({ message: 'Story marked as viewed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to mark story as viewed' });
    }
};

export const getStory = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'user with the given username not found' });
        }

        const story = await Story.find({ owner: user._id })
            .populate('owner', 'username name image')
            .populate('viewers', 'username name image');

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json({ story, message: 'Story get successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get the story' });
    }
};

export const delStory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the story
        const deletedStory = await Story.findByIdAndDelete(id);

        if (!deletedStory) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete the story' });
    }
};