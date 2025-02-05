
import { useEffect, useState, useContext } from 'react';

import { Box, List, ListItem, Typography, Avatar, Badge, Modal, IconButton } from '@mui/material';
import { Link, Outlet, NavLink } from 'react-router-dom';
import { SocketContext } from '../../context/socketContext';
import { AuthContext } from '../../context/AuthContext';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MessagesSkeleton from '../Skeletons/MessagesSkeleton';
import { ThemeContext } from "../../context/ThemeContext";
import axiosInstance from '../../AxiosInstance.jsx';

export default function Messages() {
    const [userList, setUserList] = useState([]);
    const { user } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const [parentState, setParentState] = useState(false);
    const [loading, setLoading] = useState(true);
    const { mode, toggleTheme } = useContext(ThemeContext);

    // Fetch user history with unread messages
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`/api/messages/user-history`);
                setUserList(response.data.chatHistory);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
        // console.log('parent called');

    }, [user, parentState, socket]);

    const handleChildChange = () => {
        setParentState((prev) => !prev); // Toggle the state to trigger a re-render
    };

    if (loading) {
        return (
            <MessagesSkeleton />
        )
    }

    return (
        <Modal
            open={true}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: '#e6eef0',
            }}
        >
            <Box
                sx={{
                    width: { xs: '100vw', md: '75vw' },
                    height: '100vh',
                    overflow: 'hidden',
                    boxShadow: { md: '0 4px 12px rgba(0,0,0,0.1)' },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                }}
            >
                {/* Close Button */}
                <IconButton
                    component={Link}
                    to={'/'}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        display: { xs: 'none', md: 'flex' }
                    }}
                >
                    <ClearRoundedIcon />
                </IconButton>
                <Box
                    width={{ xs: '100%', md: '35%' }}
                    sx={{
                        // backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRight: '1px solid #ddd',
                        overflowY: { xs: 'hidden', md: 'auto' },
                        overflowX: { xs: 'auto', md: 'hidden' },
                        border: '1px solid #ddd',
                        height: { xs: '17%', md: '100%' },
                    }}
                >
                    <IconButton
                        component={Link}
                        to={'/'}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 10,
                            zIndex: '1000',
                            display: { xs: 'flex', md: 'none' }
                        }}>
                        <NavigateBeforeIcon
                            sx={{ fontSize: 27, color: 'black' }}
                        />
                    </IconButton>
                    <List sx={{ mt: { xs: 4, md: 0 }, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: 'center', width: '100%', height: { xs: '70%', md: '100%' }, p: 2, backgroundColor: mode === "dark" ? 'transparent' : 'white' }}>
                        {userList.length > 0 ? (
                            userList.map(listedUser => (
                                <ListItem
                                    button
                                    key={listedUser._id}
                                    onClick={handleChildChange}
                                    component={NavLink}
                                    to={`/Messages/${listedUser.username}`}
                                    sx={(theme) => ({
                                        padding: { xs: '12px', md: '12px 16px' },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: { xs: 'center', md: 'flex-start' },
                                        flexDirection: { xs: 'column', md: 'row' },
                                        '&.active': {
                                            backgroundColor: theme.palette.action.selected, // or any color you prefer for active state
                                        },
                                        '&:hover': {
                                            backgroundColor: mode === "dark" ? '#323232' : '#f0f0f0',
                                        },
                                        borderRadius: 4,
                                        mt: 0.5
                                    })}
                                >
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        badgeContent={listedUser.unreadCount ? listedUser.unreadCount : 0}
                                        color="error"
                                        invisible={listedUser.unreadCount === 0}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 45,
                                                height: 45,
                                                marginRight: { md: '10px' },
                                                border: `2px solid ${listedUser.unreadCount > 0 ? 'red' : 'white'}`,
                                            }}
                                            src={listedUser.image.url || 'https://via.placeholder.com/150'}
                                        />
                                    </Badge>

                                    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column' }}>
                                        <Typography sx={{ maxWidth: '50px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant="body2" color="textSecondary">
                                            {listedUser.username}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', marginLeft: 1 }}>
                                        <Typography variant="subtitle2"><strong>{listedUser.username}</strong></Typography>
                                        <Typography variant="body2" color="textSecondary">{listedUser.name}</Typography>
                                    </Box>
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">No messages yet</Typography>
                        )}
                    </List>
                </Box>

                <Box width={{ xs: '100%', md: '65%' }} height={{ xs: '83%', md: '100%' }} sx={{ overflowY: 'auto' }}>
                    <Outlet context={{ handleChildChange }} />
                </Box>
            </Box>
        </Modal>
    );
}




