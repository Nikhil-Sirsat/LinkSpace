
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const followSchema = new Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

followSchema.index({ follower: 1, following: 1 }, { unique: true }); // Prevent duplicate follows

const Follow = mongoose.model('Follow', followSchema);
export default Follow;