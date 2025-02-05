
import express from 'express';
const router = express.Router();
import { auth } from '../Utils/middlewares.js';
import { getUserHistory, delMsg, delChatHistory, getUnreadMsg, getChatHistory, postMsg, markIsReadTrue } from '../controllers/messages.js';

// get users with whom the current user has chat history
router.get('/user-history', auth, getUserHistory);

// delete single msg
router.delete('/msg/:msgId', auth, delMsg);

// delete chat-history
router.delete('/:receiverId', auth, delChatHistory);

// get all the unread messages
router.get('/msg-notify', auth, getUnreadMsg);

// get chat-history
router.get('/:receiverId', auth, getChatHistory);

// save new message
router.post('/newMessage', auth, postMsg);

// mark isRead to true
router.put('/mark-isRead-true', auth, markIsReadTrue);

export default router;

