
import express from 'express';
const router = express.Router();
import multer from 'multer';
import storage from '../config/cloudConfig.js';
const upload = multer({ storage });
import { auth, isStoryOwner } from '../Middlewares/AuthMid.js';
import { checkCacheData, validateStory } from '../Middlewares/ValidationMid.js';
import { postStory, getStoryList, markView, getStory, delStory } from '../controllers/story.js';

// create/post story
router.post('/post-story', auth, upload.single('mediaUrl'), validateStory, postStory);

// get followings + story List
router.get('/get-stories-list', auth, checkCacheData((req) => `get-story-list:${req.user._id}`, 'usersWithStories'), getStoryList);

// mark view and update the story
router.put('/view/:storyId', auth, markView);

// get the story of the perticular user/profile
router.get('/:username', auth, getStory);

// delete story
router.delete('/:id', auth, isStoryOwner, delStory);

export default router;
