
import express from 'express';
const router = express.Router();
import passport from 'passport';
import multer from 'multer';
import storage from '../config/cloudConfig.js';
const upload = multer({ storage });
import { auth } from '../Middlewares/AuthMid.js';
import { validateUser, checkCacheData } from '../Middlewares/ValidationMid.js';
import { signUp, Login, LogOut, protectedRoute, editUser, checkPass, search, suggested, getUserProfile } from '../controllers/user.js';

//SignUp Route
router.post('/SignUp', upload.single('image'), validateUser, signUp);

// Login Route
router.post('/Login', passport.authenticate('local'), Login);

// Logout Route
router.get('/Logout', auth, LogOut);

// Protected Route Example
router.get('/protected', auth, protectedRoute);

// edit user info
router.put('/edit/:id', auth, upload.single('image'), validateUser, editUser);

// check password
router.post('/check-password', checkPass);

// search users
router.get('/search-users', auth, search);

// get 5 suggested users
router.get('/suggestions', auth, checkCacheData((req) => `get-suggestions:${req.user._id}`, 'suggestions'), suggested);

// get any user profile
router.get('/:username', auth, getUserProfile);

export default router;
