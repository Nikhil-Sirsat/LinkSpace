
import mongoose from "mongoose";
import { Schema } from "mongoose";
import Comment from './comments.js';

const PostSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likeCount: { type: Number, default: 0 },
        imageUrl: { url: String, filename: String },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        caption: { type: String, maxlength: 2200 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        taggedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

PostSchema.post("findOneAndDelete", async (post) => {
    if (post) {
        try {
            await Comment.deleteMany({ _id: { $in: post.comments } });
        } catch (err) {
            console.error(`Error deleting comments for post ${post._id}:`, err);
        }
    }
});

PostSchema.index({ owner: 1 });
PostSchema.index({ likeCount: -1 });
PostSchema.index({ taggedUsers: 1 });

const Post = mongoose.model('Post', PostSchema);
export default Post;
