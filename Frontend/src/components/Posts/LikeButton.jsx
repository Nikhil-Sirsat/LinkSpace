
import { useContext, useState } from 'react';
import axiosInstance from '../../AxiosInstance.jsx';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Typography, Tooltip, IconButton } from '@mui/material';
import { SocketContext } from '../../context/socketContext';
import { AuthContext } from '../../context/AuthContext';
import LikedUsers from './LikedUsers.jsx';

export default function LikeButton({ post, initialLikes, initialLiked }) {
    const { user } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [showLikedUsers, setShowLikedUsers] = useState(false);

    // send Notify fn
    const handleSendNotification = async () => {
        const notificationData = {
            senderId: user._id,
            receiverId: post.owner._id,
            message: `Liked your post`,
            postId: post._id,
            type: 'like',
            timestamp: new Date().toISOString()
        };

        try {
            const response = await axiosInstance.post('/api/notify/post', notificationData);
            // console.log('res is here : ', response.data.newNotify);

            if (!response.data.newNotify || !response.data.newNotify._id) {
                throw new Error('Notification save failed or invalid response');
            }

            // Include the saved notification ID in the data
            const savedNotification = { ...notificationData, _id: response.data.newNotify._id };

            // Emit the event with the full data
            socket.emit('sendNotification', savedNotification);
        } catch (error) {
            console.error('An Error occurred while saving and sending Notification:', error);
            return;
        }
    };

    const handleLike = async () => {
        try {
            if (liked) {
                await axiosInstance.post(`/api/like/${post._id}/unlike`);
                setLikes(likes - 1);
                setLiked(false);
            } else {
                await axiosInstance.post(`/api/like/${post._id}/like`);
                setLikes(likes + 1);
                setLiked(true);
                handleSendNotification();
            }
        } catch (error) {
            console.error('Error updating like status', error);
        }
    };

    const handleToggleLikedUsers = () => {
        setShowLikedUsers(!showLikedUsers);  // Toggle the visibility
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>

            <Tooltip title={liked ? 'dislike Like' : 'Like'} placement="top">
                <IconButton onClick={handleLike}>
                    <FavoriteIcon style={{ color: liked ? 'red' : '#757575', fontSize: '25px' }} />
                </IconButton>
            </Tooltip>

            &nbsp;

            <Tooltip title="see liked users" placement="top">
                <Typography
                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                    onClick={handleToggleLikedUsers}  // Toggle on click
                    variant="body2"
                    color="textSecondary"
                >
                    {likes}
                </Typography>
            </Tooltip>

            <LikedUsers open={showLikedUsers} id={post._id} handleToggleLikedUsers={handleToggleLikedUsers} />
        </div>
    );
};
