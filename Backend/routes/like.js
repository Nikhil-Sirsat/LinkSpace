
import express from 'express';
const router = express.Router();
import { auth } from '../Middlewares/AuthMid.js';
import { checkCacheData } from '../Middlewares/ValidationMid.js';
import { like, unlike, isLike, getLikedUsers } from '../controllers/like.js';

// Like
router.post('/:id/like', auth, like);

// Unlike a post
router.post('/:id/unlike', auth, unlike);

// is Like
router.get('/:id/isLiked', auth, isLike);

// get likedUsers
router.get('/:postId/LikedUsers', auth, checkCacheData((req) => `${req.params.postId}:LikedUsers`, 'users'), getLikedUsers);

export default router;
