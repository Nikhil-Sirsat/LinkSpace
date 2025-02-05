
import mongoose from "mongoose";
import { Schema } from "mongoose";

const storySchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { url: String, filename: String },
    caption: { type: String },
    viewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    // expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 }, // 24 hours expiration
});

// Create a TTL ( Time To Live ) index on the expiresAt field
// storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const story = mongoose.model('Story', storySchema);
export default story;