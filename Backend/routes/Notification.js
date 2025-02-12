
import express from 'express';
const router = express.Router();
import { auth } from '../Middlewares/AuthMid.js';
import { getNotify, markIsReadTrue, delNotify, postNotify } from '../controllers/Notification.js';

// post notification
router.post('/post', auth, postNotify);

// get all notifications
router.get('/all-notifications', auth, getNotify);

// mark is read true
router.put('/mark-as-read/:id', auth, markIsReadTrue);

// delete notification
router.delete('/:notifyId', auth, delNotify);

export default router;
