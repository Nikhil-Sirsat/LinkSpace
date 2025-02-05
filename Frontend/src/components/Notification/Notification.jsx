
import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../AxiosInstance.jsx';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Typography, Avatar, IconButton, Menu, MenuItem, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import IsFollowBTN from '../User/IsFollowBTN';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';
import NotifySkeleton from '../Skeletons/NotifySkeleton';
import { SocketContext } from '../../context/socketContext';

export default function Notification() {
    // const [notifications, setNotifications] = useState([]);
    const [notifyAnchorE1, setNotifyAnchorE1] = useState(null);
    const [notifyIdToDelete, setNotifyIdToDelete] = useState(null); // New state
    const [loading, setLoading] = useState(true);
    const { allNotifications, setAllNotifications } = useContext(SocketContext);

    useEffect(() => {
        if (allNotifications) {
            setLoading(false);
        }
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await axiosInstance.put(`/api/notify/mark-as-read/${notificationId}`);
            setAllNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleNotifyMenuClick = (event, notifyId) => {
        setNotifyAnchorE1(event.currentTarget);
        setNotifyIdToDelete(notifyId);
    };

    const handleNotifyMenuClose = () => {
        setNotifyAnchorE1(null);
        setNotifyIdToDelete(null);
    };

    const handleDeleteNotify = async () => {
        try {
            if (!notifyIdToDelete) return;
            await axiosInstance.delete(`/api/notify/${notifyIdToDelete}`);
            handleNotifyMenuClose();
            setAllNotifications((previousNotifications) => previousNotifications.filter((notify) => notify._id !== notifyIdToDelete));
        } catch (error) {
            console.error('Error deleting Notification:', error);
        }
    };

    if (loading) {
        return (
            <NotifySkeleton />
        )
    }

    const renderNotificationContent = (notification) => {
        switch (notification.type) {
            case 'like':
                return (
                    <>
                        {notification.postId && (
                            <Box component={Link}
                                to={`/post/${notification.postId._id}`}>
                                <Avatar
                                    sx={{ objectFit: 'cover', height: { xs: '40px', md: '70px' }, width: { xs: '40px', md: '70px' } }}
                                    src={notification.postId.imageUrl.url ? notification.postId.imageUrl.url : notification.postId.imageUrl}
                                    alt="post"
                                />
                            </Box>
                        )}
                    </>
                );
            case 'comment':
                return (
                    <>
                        {notification.postId && (
                            <Box component={Link}
                                to={`/post/${notification.postId._id}`}>
                                <Avatar
                                    sx={{ objectFit: 'cover', height: { xs: '40px', md: '70px' }, width: { xs: '40px', md: '70px' } }}
                                    src={notification.postId.imageUrl.url ? notification.postId.imageUrl.url : notification.postId.imageUrl}
                                    alt="post"
                                />
                            </Box>
                        )}
                    </>
                );
            case 'follow':
                return (
                    <IsFollowBTN username={notification.senderId.username} />
                );
            case 'tagged':
                return (
                    <>
                        {notification.postId && (
                            <Box component={Link}
                                to={`/post/${notification.postId._id}`}>
                                <Avatar
                                    sx={{ objectFit: 'cover', height: { xs: '40px', md: '70px' }, width: { xs: '40px', md: '70px' } }}
                                    src={notification.postId.imageUrl.url ? notification.postId.imageUrl.url : notification.postId.imageUrl}
                                    alt="post"
                                />
                            </Box>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '90%', md: '60%' } }}>
            {allNotifications.length > 0 ? (
                allNotifications.map((notification) => (
                    <div key={notification._id}>
                        <Badge
                            badgeContent={
                                notification.isRead ? (
                                    <TaskAltIcon sx={{ color: 'green', height: '14px' }} />
                                ) : (
                                    <AddTaskIcon sx={{ color: 'red', height: '15px' }} />
                                )
                            }
                            color="transparent"></Badge>
                        <Box key={notification._id} onClick={() => markAsRead(notification._id)} sx={{ display: 'flex', alignItems: 'center', mb: { sx: 2, md: 4 }, p: { xs: 2, md: 3 }, borderBottom: '2px solid' }}>
                            <Avatar
                                sx={{ height: { xs: '40px', md: '70px' }, width: { xs: '40px', md: '70px' } }}
                                component={Link}
                                to={`/user/${notification.senderId.username}`}
                                src={notification.senderId.image.url}
                                alt={notification.senderId.username}
                            />
                            <Box sx={{ ml: { xs: 1, md: 2 }, flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span>
                                        <Typography sx={{ fontSize: { xs: '11px', md: '15px' } }} variant="body2">{new Date(notification.timestamp).toLocaleString()}</Typography>
                                        <strong>{notification.senderId.username}</strong>
                                    </span>
                                </Typography>
                                <Typography variant="body2">{notification.message}</Typography>

                            </Box>
                            {renderNotificationContent(notification)}
                            <IconButton onClick={(e) => handleNotifyMenuClick(e, notification._id)}>
                                <MoreVertIcon />
                            </IconButton>

                        </Box>

                    </div>
                ))
            ) : (
                <p>No notifications yet</p>
            )}
            <Menu
                anchorEl={notifyAnchorE1}
                open={Boolean(notifyAnchorE1)}
                onClose={handleNotifyMenuClose}
            >
                <MenuItem onClick={handleDeleteNotify}>Delete Notification</MenuItem>
            </Menu>
        </Box>
    );
}
