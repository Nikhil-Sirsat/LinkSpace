
import Post from '../models/posts.js';
import Story from '../models/story.js';
import Comment from '../models/comments.js';

//authentication
export const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
};

// is Post Owner
export const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let post = await Post.findById(id);
    if (!post.owner._id.equals(req.user._id)) {
        return res.status(401).json({ message: 'You are not the owner of this Post' });
    }
    next();
};

// validate comment author
export const isCommentAuthor = async (req, res, next) => {
    let { commentId } = req.params;
    let comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        return res.status(401).json({ message: 'You are not the author of this comment' });
    }
    next();
};

// is Story Owner
export const isStoryOwner = async (req, res, next) => {
    let { id } = req.params;
    let story = await Story.findById(id);
    if (!story.owner._id.equals(req.user._id)) {
        return res.status(401).json({ message: 'You are not the owner of this Story' });
    }
    next();
};