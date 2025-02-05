

import express from 'express';
const router = express.Router();
import { auth, validateComment, isCommentAuthor } from '../Utils/middlewares.js';
import { postComment, deleteComment } from '../controllers/comment.js';

// Post Comment Route
router.post("/post/:postId", auth, validateComment, postComment);

// Delete Comment route
router.delete("/:postId/:commentId", auth, isCommentAuthor, deleteComment);

export default router;
