
import express from 'express';
const router = express.Router();
import { auth } from '../Middlewares/AuthMid.js';
import { checkCacheData } from '../Middlewares/ValidationMid.js';
import { follow, unfollow, getFollowers, getFollowings } from '../controllers/Follow.js';

// Follow a user
router.post('/follow/:username', auth, follow);

// Unfollow a user
router.delete('/unfollow/:username', unfollow);

// Get followers
router.get('/:username/followers', auth, checkCacheData((req) => `${req.params.username}:followers`, 'followers'), getFollowers);

// Get following
router.get('/:username/following', auth, checkCacheData((req) => `${req.params.username}:following`, 'following'), getFollowings);

export default router;

