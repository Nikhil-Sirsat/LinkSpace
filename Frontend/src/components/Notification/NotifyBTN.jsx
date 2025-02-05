
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../AxiosInstance.jsx';
import { SocketContext } from '../../context/socketContext';

export default function NotifyBTN() {
    const { socket, allNotifications, setAllNotifications } = useContext(SocketContext);
    const { user } = useContext(AuthContext);
    const [isJoin, setIsJoin] = useState(false);

    // socket.join event
    useEffect(() => {
        const joinUserToSocket = async () => {
            if (socket && user?._id) {
                socket.emit('join', { userId: user._id });
                setIsJoin(true);
            }
            return;
        };
        joinUserToSocket();
    }, [socket, user]);

    // fetch all notifications
    useEffect(() => {
        if (!user) return;
        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get(`/api/notify/all-notifications`);
                setAllNotifications(response.data.allNotifications || []);
                // console.log("Notify Triggered");
            } catch (error) {
                console.error('Error fetching Notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    // Filter unread notifications
    let unreadCount = allNotifications.filter(notification => !notification.isRead).length;

    // socket receive notification Event
    useEffect(() => {
        if (isJoin && socket) {
            socket.on('receiveNotification', (NotificationData) => {
                // console.log("receive Notify event : ", NotificationData);

                if (NotificationData) {
                    if (NotificationData.receiverId === user._id) {
                        setAllNotifications((prevNotify) => [...prevNotify, NotificationData]);
                        unreadCount++;
                        // console.log(unreadCount);
                    }
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('receiveNotification');
            }
        };
    }, [isJoin, socket]);

    return (
        <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon style={{ color: '#0073e6', fontSize: '1.6rem' }} />
        </Badge>
    );
}
