
import mongoose from "mongoose";
import { Schema } from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    bio: { type: String },
    image: { url: String, filename: String },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    taggedInPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

userSchema.plugin(passportLocalMongoose);

userSchema.index({ email: 1, taggedInPosts: 1 }, { unique: true });
userSchema.index({ followersCount: -1, followingCount: -1 });

const User = mongoose.model('User', userSchema);
export default User;