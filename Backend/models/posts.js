
import mongoose from "mongoose";
import { Schema } from "mongoose";
import Comment from './comments.js';
import Like from './like.js';
import User from './user.js';
import SavedPost from './savedPosts.js';

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
            // 1. Delete all comments related to the post
            const delComments = await Comment.deleteMany({ _id: { $in: post.comments } });

            // 2. Delete all likes associated with the post
            const delLikes = await Like.deleteMany({ postId: post._id });

            // 3. Delete all saved posts entries related to the post
            const delSavedPosts = await SavedPost.deleteMany({ post: post._id });

            // 4. Remove the post from users' "taggedInPosts" array
            const upUsers = await User.updateMany(
                { taggedInPosts: post._id },  // Find users who are tagged in this post
                { $pull: { taggedInPosts: post._id } }  // Remove post ID from their taggedInPosts array
            );

        } catch (err) {
            console.error(`Error cleaning up post data for ${post._id}:`, err);
        }
    }
});

PostSchema.index({ owner: 1 });
PostSchema.index({ likeCount: -1 });
PostSchema.index({ taggedUsers: 1 });

const Post = mongoose.model('Post', PostSchema);
export default Post;
