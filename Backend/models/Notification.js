
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const notificationSchema = new Schema({
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // New field
    type: { type: String, enum: ['like', 'comment', 'follow', 'tagged'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    // related Entity for like and commnet, sharePost, tagged etc.,
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },

    timestamp: { type: Date, default: Date.now }
});

// Define indexes
notificationSchema.index({ senderId: 1, receiverId: 1, isRead: 1 }); // Compound index
notificationSchema.index({ timestamp: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;