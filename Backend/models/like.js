
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const likeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Like = mongoose.model('Like', likeSchema);
export default Like;
