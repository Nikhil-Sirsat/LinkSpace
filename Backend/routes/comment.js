

import express from 'express';
const router = express.Router();
import { auth, isCommentAuthor } from '../Middlewares/AuthMid.js';
import { validateComment } from '../Middlewares/ValidationMid.js';
import { postComment, deleteComment } from '../controllers/comment.js';

// Post Comment Route
router.post("/post/:postId", auth, validateComment, postComment);

// Delete Comment route
router.delete("/:postId/:commentId", auth, isCommentAuthor, deleteComment);

export default router;
