import { useEffect, useState, useContext } from 'react';
import { Button } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import { FollowContext } from '../../context/IsFollowContext';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/socketContext';

export default function IsFollowBTN({ username }) {
    const { user } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const [isFollowing, setIsFollowing] = useState(false);
    const [otherUser, setOtherUser] = useState({});
    const { setFollowersCount, setFollowingCount } = useContext(FollowContext);

    useEffect(() => {
        const fetchIsFollow = async () => {
            try {
                const response = await axiosInstance.get(`/api/user/${username}`);
                const { user: fetchedUser, posts: fetchedPosts, isFollowing, followersCount, followingCount } = response.data;
                // console.log(response.data.user);
                setOtherUser(response.data.user);
                setIsFollowing(isFollowing || false);
                setFollowersCount(followersCount || 0);
                setFollowingCount(followingCount || 0);

            } catch (error) {
                console.error('Error fetching user and user posts:', error);
            }
        };

        fetchIsFollow();
    }, [username]);

    // send Notify fn
    const handleSendNotification = async () => {
        const notificationData = {
            senderId: user._id,
            receiverId: otherUser._id,
            message: `started following you`,
            type: 'follow',
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

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await axiosInstance.delete(`/api/follow/unfollow/${username}`);
                setIsFollowing(false);
                setFollowersCount(prevCount => prevCount - 1);
            } else {
                await axiosInstance.post(`/api/follow/follow/${username}`);
                setIsFollowing(true);
                handleSendNotification();
                setFollowersCount(prevCount => prevCount + 1);
            }
        } catch (error) {
            console.log('Error toggling follow status:', error);
        }
    };

    return (
        <Button
            variant="outlined"
            color={isFollowing ? 'primary' : 'secondary'}
            onClick={handleFollowToggle}
            sx={{
                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                padding: { xs: '3px 6px', sm: '4px 8px', md: '5px 10px' },
                textTransform: 'none'
            }}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    )

}