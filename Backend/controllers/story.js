
import Story from '../models/story.js';
import Follow from '../models/Follow.js';
import User from '../models/user.js';
import redisClient from '../config/redisClient.js';
import { moderateText, analyzeImage } from '../Utils/postAnalysis.js';
import { v2 as cloudinary } from 'cloudinary';
import { delImgFromCloud } from '../Utils/Del-Img-from-Cloud.js';

export const postStory = async (req, res) => {

    try {
        const owner = req.user._id;
        const { caption } = req.body;

        // get url & fileName from cloudinary
        let url = req.file.path;
        let filename = req.file.filename;

        // image analysis
        const { status, message } = await analyzeImage(url);

        if (status === false) {
            await delImgFromCloud(url); // Delete the image from Cloudinary
            return res.status(400).json({ error: message });
        }

        // TXT Moderation
        const { isClean, msg } = await moderateText(caption);
        if (isClean === false) {
            await delImgFromCloud(url); // Delete the image from Cloudinary
            return res.status(400).json({ error: msg });
        }

        // Create new story
        const newStory = new Story({ caption, owner });
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

        // add userId to viewers array if it doesn't already exist
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

        // get story
        const story = await Story.findById(id);

        // check story exist
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Extract the public_id from the story URL & delete
        if (story.mediaUrl && story.mediaUrl.url) {
            const prevStoryUrl = story.mediaUrl.url;
            const publicId = prevStoryUrl.split('/').pop().split('.')[0]; // Extract public_id from URL

            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(`LinkSpace_Posts/${publicId}`);
        }

        // Find and delete the story
        await Story.findByIdAndDelete(id);

        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete the story' });
    }
};