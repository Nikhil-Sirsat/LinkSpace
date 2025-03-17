import { useEffect, useState, useContext } from 'react';
import { Button } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/socketContext';

export default function IsFollowBTN({ username }) {
    const { user } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const [isFollowing, setIsFollowing] = useState(false);
    const [otherUser, setOtherUser] = useState({});
    const [loading, setLoading] = useState(true);

    // check isFollow
    useEffect(() => {
        if (!username) return;
        const fetchIsFollow = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/api/follow/${username}/isFollow`);
                const { isFollowing, user } = response.data;
                setOtherUser(user);
                setIsFollowing(isFollowing || false);

            } catch (error) {
                console.error('Error fetching user and user posts:', error);
            } finally {
                setLoading(false);
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

            if (!response.data.newNotify || !response.data.newNotify._id) {
                throw new Error('Notification save failed or invalid response');
            }

            const responseNotify = response.data.newNotify;

            // Emit the event with the full data
            socket.emit('sendNotification', responseNotify);
        } catch (error) {
            console.error('An Error occurred while saving and sending Notification:', error);
            return;
        }
    };

    const handleFollowToggle = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await axiosInstance.delete(`/api/follow/unfollow/${username}`);
                setIsFollowing(false);
            } else {
                await axiosInstance.post(`/api/follow/follow/${username}`);
                setIsFollowing(true);
                handleSendNotification();
            }
        } catch (error) {
            console.log('Error toggling follow status:', error);
        } finally {
            setLoading(false);
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
            {loading ?
                ('Loading...') :
                (isFollowing ? 'Unfollow' : 'Follow')
            }
        </Button>
    )

}