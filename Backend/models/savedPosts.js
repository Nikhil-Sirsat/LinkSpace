
import mongoose from "mongoose";
import { Schema } from "mongoose";

const SavedPostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    createdAt: { type: Date, default: Date.now },
});

const SavedPost = mongoose.model('SavedPost', SavedPostSchema);
export default SavedPost;
