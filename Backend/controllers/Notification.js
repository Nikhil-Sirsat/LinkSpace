
import Notification from "../models/Notification.js";

export const postNotify = async (req, res) => {
    try {
        const { senderId, receiverId, type, message, isRead, postId } = req.body;
        const newNotify = new Notification({ senderId, receiverId, type, message, isRead, postId: postId || null });
        await newNotify.save();
        res.status(201).json({ newNotify: newNotify, message: 'Notification Saved Successfully' });
    } catch (error) {
        console.error('An Error Occured while Saving New Notification : ', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getNotify = async (req, res) => {
    try {
        const userId = req.user._id;

        const allNotifications = await Notification.find({ receiverId: userId })
            .populate('senderId', 'image username')
            .populate('postId', 'imageUrl');

        res.status(200).json({ allNotifications, message: 'Retrive all the notification of the current user' });
    } catch (error) {
        console.log('Error occured while fetching notification : ', error);
        res.status(500).json({ error: 'An error occured while fetching notifications' });
    }
};

export const markIsReadTrue = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

export const delNotify = async (req, res) => {
    try {
        const { notifyId } = req.params;
        const notification = await Notification.findByIdAndDelete(notifyId);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error('Error deleting Notification :', err);
        res.status(500).send('An error occurred while deleting single Notification.');
    }
};