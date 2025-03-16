

import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isRead: { type: Boolean, default: false },
    content: { type: String },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },  // Reference to the shared post
    story: { type: Schema.Types.ObjectId, ref: 'Story' },
    timestamp: { type: Date, default: Date.now },
});

// Define indexes
messageSchema.index({ sender: 1, receiver: 1, isRead: 1 }); // Compound index
messageSchema.index({ timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
