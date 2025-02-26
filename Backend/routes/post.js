
import express from 'express';
const router = express.Router();
import multer from 'multer';
import storage from '../config/cloudConfig.js';
const upload = multer({ storage });
import { auth, isOwner } from '../Middlewares/AuthMid.js';
import { validatePost, checkCacheData } from '../Middlewares/ValidationMid.js';
import { createPost, trendingPosts, getHomePostFeed, getTaggedPosts, showPost, delPost, postSuggestions } from '../controllers/post.js';

// create post
router.post('/', auth, upload.single('imageUrl'), validatePost, createPost);

// All posts 
router.get('/trending-posts', auth, trendingPosts);

// Get Home Post's Feed
router.get('/home-posts', auth, checkCacheData((req) => `home-posts:${req.user._id}`, 'posts'), getHomePostFeed);

// Route to get posts where a particular user is tagged
router.get('/tagged/:userId', auth, checkCacheData((req) => `tagged:${req.params.userId}`, 'posts'), getTaggedPosts);

// get home post suggestion 
router.get('/suggested-posts', auth, postSuggestions);

// show post
router.get('/:id', auth, checkCacheData((req) => `${req.params.id}`, 'post'), showPost);

// delete post
router.delete('/:id', auth, isOwner, delPost);

export default router;
