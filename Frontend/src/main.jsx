import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import Home from './components/Home/Home.jsx';
import Profile from './components/User/Profile.jsx';
import Explore from './components/Posts/Explore.jsx';
import Signup from './components/User/Signup.jsx';
import Login from './components/User/Login.jsx';
import Messages from './components/Messages/Messages.jsx';
import ChatBox from './components/Messages/ChatBox.jsx';
import Notification from './components/Notification/Notification.jsx';
import EditeProfile from './components/User/EditProfile.jsx';
import LostPath from './components/LostPath/Lost.jsx';
import ProfileSetting from './components/User/ProfileSetting.jsx';
import CreatePost from './components/Posts/CreatePost.jsx';
import ViewPost from './components/Posts/ViewPost.jsx';
import Followers from './components/User/Followers.jsx';
import Following from './components/User/Following.jsx';
import ProtectedRoute from './ProtectedRoutes/ProtectedRoutes.jsx';
import ViewStory from './components/Story/ViewStory.jsx';
import UploadStory from './components/Story/UploadStory.jsx';
import Inbox from './components/Messages/Inbox.jsx';
import StartMsg from './components/Messages/StartMsg.jsx';
import About from './components/About/About.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import { FollowProvider } from './context/IsFollowContext.jsx';
import { SocketProvider } from './context/socketContext.jsx';
import { SnackbarProvider } from './context/SnackBarContext.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: '/About',
        element: <ProtectedRoute><About /></ProtectedRoute>
      },
      {
        path: '/user/:username',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
        children: [
          {
            path: 'followers',
            element: <ProtectedRoute> <Followers /> </ProtectedRoute>
          },
          {
            path: 'followings',
            element: <ProtectedRoute> <Following /> </ProtectedRoute>
          },
        ]
      },
      {
        path: '/user/:username/edit',
        element: <ProtectedRoute><EditeProfile /></ProtectedRoute>
      },
      {
        path: '/user/:username/setting',
        element: <ProtectedRoute><ProfileSetting /></ProtectedRoute>
      },
      {
        path: '/Messages',
        element: <ProtectedRoute><Messages /></ProtectedRoute>,
        children: [
          {
            path: ':username',
            element: <ProtectedRoute> <ChatBox /> </ProtectedRoute>
          },
          {
            path: 'inbox',
            element: <ProtectedRoute> <Inbox /> </ProtectedRoute>,
            children: [
              {
                path: 'search',
                element: <ProtectedRoute> <StartMsg /> </ProtectedRoute>
              }
            ]
          },
        ]
      },
      {
        path: '/Notifications',
        element: <ProtectedRoute><Notification /></ProtectedRoute>
      },
      {
        path: '/story/:username',
        element: <ProtectedRoute><ViewStory /></ProtectedRoute>
      },
      {
        path: '/upload-story',
        element: <ProtectedRoute><UploadStory /></ProtectedRoute>
      },

      //Post routes
      {
        path: '/Explore',
        element: <ProtectedRoute><Explore /></ProtectedRoute>
      },
      {
        path: '/:username/create-post',
        element: <ProtectedRoute><CreatePost /></ProtectedRoute>
      },
      {
        path: '/post/:id',
        element: <ProtectedRoute><ViewPost /></ProtectedRoute>
      },
    ]
  },
  {
    path: '/SignUp',
    element: <Signup />
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '*',
    element: <LostPath />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SnackbarProvider>
        <SocketProvider>
          <FollowProvider>
            <RouterProvider router={router} />
          </FollowProvider>
        </SocketProvider>
      </SnackbarProvider>
    </AuthProvider>
  </React.StrictMode>
);
