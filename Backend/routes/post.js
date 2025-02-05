
import express from 'express';
const router = express.Router();
import multer from 'multer';
import storage from '../Utils/cloudConfig.js';
const upload = multer({ storage });
import { auth, validatePost, isOwner, checkCacheData } from '../Utils/middlewares.js';
import { createPost, getAllPosts, getHomePostFeed, getTaggedPosts, showPost, delPost } from '../controllers/post.js';

// create post
router.post('/', auth, upload.single('imageUrl'), validatePost, createPost);

// All posts 
router.get('/', auth, checkCacheData((req) => `allPosts:${req.user._id}`, 'allPosts'), getAllPosts);

// Get Home Post's Feed
router.get('/home-posts', auth, checkCacheData((req) => `home-posts:${req.user._id}`, 'posts'), getHomePostFeed);

// Route to get posts where a particular user is tagged
router.get('/tagged/:userId', auth, checkCacheData((req) => `tagged:${req.params.userId}`, 'posts'), getTaggedPosts);

// show post
router.get('/:id', auth, checkCacheData((req) => `${req.params.id}`, 'post'), showPost);

// delete post
router.delete('/:id', auth, isOwner, delPost);

export default router;
