
import Message from '../models/messages.js';

export const getUserHistory = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const chatHistory = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: currentUserId },
                        { receiver: currentUserId }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', currentUserId] },
                            '$receiver',
                            '$sender'
                        ]
                    },
                    lastMessageTimestamp: { $max: '$timestamp' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ['$receiver', currentUserId] }, { $eq: ['$isRead', false] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },
            {
                $project: {
                    _id: '$userInfo._id',
                    name: '$userInfo.name',
                    username: '$userInfo.username',
                    image: '$userInfo.image',
                    lastMessageTimestamp: 1,
                    unreadCount: 1
                }
            },
            {
                $sort: { lastMessageTimestamp: -1 }
            }
        ]);

        res.json({ chatHistory: chatHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const delMsg = async (req, res) => {
    try {
        const { msgId } = req.params;
        const message = await Message.findByIdAndDelete(msgId);

        if (!message) {
            return res.status(404).json({ message: 'message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });

    } catch (err) {
        console.error('Error deleting message:', err);
        res.status(500).send('An error occurred while deleting single message.');
    }
};

export const delChatHistory = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const messages = await Message.deleteMany({
            $or: [
                { sender: req.user._id, receiver: receiverId },
                { sender: receiverId, receiver: req.user._id }
            ]
        });

        if (!messages) {
            return res.status(404).json({ message: 'Messages not found' });
        }

        res.status(200).json({ message: 'Chat history deleted successfully' });
    } catch (err) {
        console.error('Error deleting messages:', err);
        res.status(500).send('An error occurred while fetching messages.');
    }
};

export const getUnreadMsg = async (req, res) => {
    try {
        const receiverId = req.user._id;
        const msgNotify = await Message.find({ receiver: receiverId, isRead: false });
        const unreadCount = msgNotify.length;
        res.json(unreadCount);
    } catch (err) {
        res.status(500).send('An error occurred while fetching all msg-notify.');
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: receiverId },
                { sender: receiverId, receiver: req.user._id }
            ]
        })
            .populate([
                {
                    path: 'post',
                    select: 'imageUrl owner',
                    populate: {
                        path: 'owner',
                        select: 'username image'
                    }
                },
                {
                    path: 'story',
                    select: 'mediaUrl owner',
                    populate: {
                        path: 'owner',
                        select: 'username image'
                    }
                }
            ])
            .sort({ timestamp: 1 });

        res.json({ messages: messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).send('An error occurred while fetching messages.');
    }
};

export const postMsg = async (req, res) => {
    try {
        const { sender, receiver, content, post, story, timestamp } = req.body;

        // Create and save the new message
        const newMsg = new Message({ sender, receiver, content, post: post || null, story: story || null, timestamp });
        await newMsg.save();

        // Populate based on whether it's a post or a story
        const populatedMessage = await Message.findById(newMsg._id)
            .populate(post ? {
                path: 'post',
                select: 'imageUrl owner',
                populate: { path: 'owner', select: 'image username' }
            } : {
                path: 'story',
                select: 'mediaUrl owner',
                populate: { path: 'owner', select: 'username image' }
            });

        console.log(populatedMessage);

        res.status(201).json({ newMsg: populatedMessage, message: 'Message Saved Successfully' });
    } catch (error) {
        console.error('An Error Occurred while Saving New Message:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const markIsReadTrue = async (req, res) => {
    try {
        const receiverId = req.user._id;
        const { senderId } = req.body;

        // Update all messages from sender to receiver where isRead is false
        const result = await Message.updateMany(
            { sender: senderId, receiver: receiverId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: 'Marked as Read' });

    } catch (error) {
        console.error('An Error Occured while Marking isRead True : ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};