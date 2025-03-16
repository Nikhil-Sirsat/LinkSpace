
import mongoose from "mongoose";
import { Schema } from "mongoose";

const SavedPostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    createdAt: { type: Date, default: Date.now },
});

// define indexes
SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

const SavedPost = mongoose.model('SavedPost', SavedPostSchema);
export default SavedPost;
