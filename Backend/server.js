
import dotenv from 'dotenv';

if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

import express, { json, urlencoded } from 'express';
import connectDB from './connectDB/connectDB.js';

import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import MongoStore from 'connect-mongo';

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
import initializeSocket from './sockets/socket.js';

const app = express();
const PORT = process.env.PORT || 5050;
const server = createServer(app);

app.set("trust proxy", 1);

// Middleware
app.use(cors({
    origin: "https://linkspace-wd0q.onrender.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(json());
app.use(urlencoded({ extended: true }));

// Session Setup

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: { secret: process.env.SECRET_SESSION_KEY },
    ttl: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE : ", err);
});

const sessionMiddleware = session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }
});
app.use(sessionMiddleware);

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connect MongoDB-Atlas database
connectDB();

// Initialize socket.io with session-middleware
const io = initializeSocket(server, sessionMiddleware);

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