
import express from 'express';
const router = express.Router();
import { auth } from '../Middlewares/AuthMid.js';
import { checkCacheData } from '../Middlewares/ValidationMid.js';
import { save, unSave, getSavedPosts, isSave } from '../controllers/savedPosts.js';

// Save Post
router.post('/:postId/save', auth, save);

// Unsave Post
router.delete('/:postId/unSave', auth, unSave);

// Get Saved Posts
router.get('/saved-posts', auth, checkCacheData((req) => `saved-posts:${req.user._id}`, 'savedPosts'), getSavedPosts);

// is Saved
router.get('/:postId/isSaved', auth, isSave);

export default router;
