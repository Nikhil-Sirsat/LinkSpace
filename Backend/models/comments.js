
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const commentSchema = new Schema({
    comment: String,
    createdAt: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: "User" },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;