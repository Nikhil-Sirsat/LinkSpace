
import dotenv from 'dotenv';

if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';

import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from './models/user.js';

// require routes
import userRouts from './routes/user.js';
import postRoutes from './routes/post.js';
import likeRoutes from './routes/like.js';
import commentRoutes from './routes/comment.js';
import followRoutes from './routes/Follow.js';
import savedPostsRoutes from './routes/savedPosts.js';
import messagesRoutes from './routes/messages.js';
import notificationRoutes from './routes/Notification.js';
import storyRoutes from './routes/story.js';

import { createServer } from 'http';
import cors from 'cors';
import initializeSocket from './Utils/socket.js';

const app = express();
const PORT = process.env.PORT || 5050;
const server = createServer(app);

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(json());
app.use(urlencoded({ extended: true }));

// Session Setup
const sessionMiddleware = session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
});
app.use(sessionMiddleware);

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const mongo_URL = process.env.MONGO_URL;
connect(mongo_URL)
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log(`Database connection error: ${err}`);
    });

// Initialize socket.io
const io = initializeSocket(server, sessionMiddleware, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// Share session middleware with Socket.IO
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Attach io to the app instance
app.set('io', io);

// routes
app.use('/api/user', userRouts);
app.use('/api/post', postRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/savedPost', savedPostsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notify', notificationRoutes);
app.use('/api/story', storyRoutes);

server.listen(PORT, () => {
    console.log(`server is Listening on port : ${PORT} `);
});