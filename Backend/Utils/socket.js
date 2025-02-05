

import { Server } from 'socket.io';
import passport from 'passport';
import Notification from '../models/Notification.js';
import Message from '../models/messages.js';

function initializeSocket(server, sessionMiddleware) {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    // Share session middleware with Socket.IO
    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, (err) => {
            if (err) return next(err);
            passport.initialize()(socket.request, {}, (err) => {
                if (err) return next(err);
                passport.session()(socket.request, {}, (err) => {
                    if (err) return next(err);
                    if (socket.request.isAuthenticated()) {
                        return next();
                    }
                    next(new Error('Unauthorized'));
                });
            });
        });
    });

    io.on('connection', (socket) => {

        socket.on('join', ({ userId }) => {
            // console.log(`User ${userId} joined`);
            socket.join(userId);
        });

        // send Message Event
        socket.on('sendMessage', async (messageData) => {
            try {
                if (socket.request.user._id.toString() !== messageData.sender) {
                    console.error('Unauthorized attempt to send message');
                    return;
                }

                // Check if the message has a post ID that needs to be populated
                if (messageData.post) {
                    const populatedPostMessage = await Message.findById(messageData._id)
                        .populate({
                            path: 'post',
                            select: 'imageUrl owner',
                            populate: {
                                path: 'owner',
                                select: 'image username'
                            }
                        });

                    // Emit the populated message to the receiver
                    io.to(messageData.receiver).emit('receiveMessage', populatedPostMessage);

                } else if (messageData.story) {
                    const populatedStoryMessage = await Message.findById(messageData._id)
                        .populate({
                            path: 'story',
                            select: 'mediaUrl owner',
                            populate: {
                                path: 'owner',
                                select: 'username image'
                            }
                        });

                    // Emit the populated message to the receiver
                    io.to(messageData.receiver).emit('receiveMessage', populatedStoryMessage);

                } else {
                    // Emit the original message if no post data is involved
                    io.to(messageData.receiver).emit('receiveMessage', messageData);
                }
            } catch (error) {
                console.error('Error Sending Message:', error);
            }
        });

        // send MarkisRead Event
        socket.on('markAsRead', ({ senderId }) => {
            if (!senderId) return;
            // console.log('Server: Marking messages as read for sender:', senderId);

            io.to(senderId).emit('messageRead', { senderId });
        });

        // send notification event
        socket.on('sendNotification', async (notificationData) => {
            try {
                if (socket.request.user._id.toString() !== notificationData.senderId) {
                    console.error('Unauthorized attempt to send Notification');
                    return;
                }

                let populatedNotification = null;

                if (notificationData.postId) {
                    populatedNotification = await Notification.findById(notificationData._id)
                        .populate('senderId', 'image username')
                        .populate('postId', 'imageUrl');
                } else {
                    populatedNotification = await Notification.findById(notificationData._id)
                        .populate('senderId', 'image username');
                }

                if (populatedNotification) {
                    io.to(notificationData.receiverId).emit('receiveNotification', populatedNotification);
                } else {
                    console.error('Notification not found:', notificationData._id);
                    io.to(notificationData.receiverId).emit('receiveNotification', {
                        error: 'Notification data not found',
                    });
                }
            } catch (error) {
                console.error('Error sending Notification:', error);
            }
        });

        socket.on('disconnect', () => {
            // console.log('Client disconnected');
        });
    });

    return io;
}

export default initializeSocket;