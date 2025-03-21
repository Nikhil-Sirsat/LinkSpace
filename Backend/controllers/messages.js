
import Message from '../models/messages.js';
import { encrypt, decrypt } from '../Encrypt&Decrypt/encryption.js';

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

    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message', error: error.message });
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
    } catch (error) {
        console.error('Error deleting messages:', error);
        res.status(500).json({ message: 'Error Deleteing-Chat History', error: error.message });
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

        // Decrypt content only if it exists, otherwise keep it null
        const decryptedMessages = messages.map((msg) => ({
            ...msg.toObject(), // Convert Mongoose document to plain JavaScript object
            content: msg.content ? decrypt(msg.content) : null, // Decrypt if content exists, else keep it null
        }));

        res.json({ messages: decryptedMessages });
    } catch (error) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Error Fetching Messages', error: error.message });
    }
};

export const postMsg = async (req, res) => {
    try {
        const { sender, receiver, content, post, story, timestamp } = req.body;

        // Validate the request body
        if (!sender || !receiver) {
            return res.status(400).json({ message: 'Invalid request. Sender & receiver are required.' });
        }

        const encryptedContent = encrypt(content);

        // Create and save the new message
        const newMsg = new Message({
            sender,
            receiver,
            content: encryptedContent,
            post: post || null,
            story: story || null,
            timestamp,
        });
        await newMsg.save();

        // Populate based on what exist (post or story)
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

        // Decrypt the content before sending back (for response purposes)
        populatedMessage.content = decrypt(encryptedContent);

        res.status(201).json({ newMsg: populatedMessage, message: 'Message Saved Successfully' });
    } catch (error) {
        console.error('An Error Occurred while Saving New Message:', error.message);
        res.status(500).json({ message: 'Error Sending Message', error: error.message });
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
        console.error('Error Marking isRead True : ', error);
        res.status(500).json({ message: 'Error Reading Messages', error: error.message });
    }
};