
import { Server } from 'socket.io';
import passport from 'passport';
import Notification from '../models/Notification.js';

function initializeSocket(server, sessionMiddleware) {

    // Initialize Socket.IO with CORS configuration
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
            passport.authenticate('session', (err, user) => {
                if (err) return next(err);
                if (!user) return next(new Error('Unauthorized'));

                socket.request.user = user; // Attach the user to the socket request
                next();
            })(socket.request, {}, next);
        });
    });

    io.on('connection', (socket) => {

        // socket join Event
        socket.on('join', ({ userId }) => {
            socket.join(userId);
        });

        // send Message Event
        socket.on('sendMessage', async (messageData) => {
            if (socket.request.user._id.toString() !== messageData.sender) {
                console.error('Unauthorized attempt to send message');
                return;
            }

            io.to(messageData.receiver).emit('receiveMessage', messageData);
        });

        // send mard read Event
        socket.on('markAsRead', ({ senderId }) => {
            if (!senderId) return;
            io.to(senderId).emit('messageRead', { senderId });
        });

        // Msg Delete Event
        socket.on('sendMsgDelete', ({ selectedUser, msgToDelete }) => {
            if (!selectedUser._id) return;
            io.to(selectedUser._id).emit('receiveMsgDelete', { msgToDelete });
        });

        // send notification Event
        socket.on('sendNotification', async (notificationData) => {

            if (socket.request.user._id.toString() !== notificationData.senderId._id) {
                console.error('Unauthorized attempt to send Notification');
                return;
            }

            io.to(notificationData.receiverId).emit('receiveNotification', notificationData);
        });

        socket.on('disconnect', () => {
            // console.log('Client disconnected');
        });
    });

    return io;
}

export default initializeSocket;