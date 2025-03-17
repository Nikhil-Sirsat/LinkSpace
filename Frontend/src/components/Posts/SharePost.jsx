import { useEffect, useState, useContext } from 'react';
import { Modal, Box, Typography, Avatar, Button, Checkbox, Badge } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/socketContext';
import { useSnackbar } from '../../context/SnackBarContext';
import SharePostSkeleton from '../Skeletons/SharePostSkeleton';

export default function SharePost({ id, handleToggleShareUsers, sharePostUsers }) {
    const { socket } = useContext(SocketContext);
    const [followings, setFollowings] = useState([]);
    const [selectedFollowings, setSelectedFollowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const showSnackbar = useSnackbar();
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchFollowings = async () => {
            try {
                const response = await axiosInstance.get(`/api/follow/${user.username}/following`);
                setFollowings(response.data.following);
            } catch (error) {
                console.error('Error fetching followings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowings();
    }, [user.username]);

    const handleCheckboxChange = (followingId) => {
        setSelectedFollowings(prevSelected =>
            prevSelected.includes(followingId)
                ? prevSelected.filter(id => id !== followingId)
                : [...prevSelected, followingId]
        );
    };

    const handleSendMessage = async () => {
        setSending(true);

        if (!id) return;

        const messageData = {
            sender: user._id,
            timestamp: new Date().toISOString(),
            post: id,
        };

        try {
            // Create an array of promises for POST requests
            const postRequests = selectedFollowings.map(async (followingId) => {
                try {
                    const dataWithReceiver = { ...messageData, receiver: followingId };
                    const response = await axiosInstance.post('/api/messages/newMessage', dataWithReceiver);
                    return response; // Return response if successful
                } catch (error) {
                    console.error(`Error while saving and sharing the post to ${followingId}:`, error);
                    return null; // Return null on error to prevent undefined issues
                } finally {
                    setSending(false);
                }
            });

            // Wait for all POST requests to complete concurrently
            const results = await Promise.all(postRequests);

            // Filter out null results (failed requests)
            const successfulPosts = results.filter(result => result !== null);

            if (successfulPosts.length > 0) {
                // Emit a socket event for each successfully posted message
                successfulPosts.forEach(response => {
                    if (response.data.newMsg) {
                        const resMsg = response.data.newMsg;
                        socket.emit('sendMessage', resMsg); // Send the message with the _id
                        showSnackbar('Post shared successfully!');
                    }
                });
            } else {
                showSnackbar('No posts were successfully shared.');
            }

            // Toggle the share users panel
            handleToggleShareUsers();
        } catch (error) {
            console.error('An error occurred while saving and sending the post:', error);
            showSnackbar('Error occurred, no post shared!');
        } finally {
            setSending(false);
        }
    };

    return (
        <Modal
            open={sharePostUsers}
            onClose={handleToggleShareUsers}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    width: { xs: '90%', md: '35%' },
                    height: { xs: '60%', md: '65%' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                }}
            >
                {loading ? (
                    <SharePostSkeleton />
                ) : (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', borderRadius: '5px', height: '100%', width: '100%', }}>
                        <Box sx={{ position: 'sticky', top: 0, backgroundColor: '#f7f7f7', zIndex: 10, p: 2 }}>
                            <Button variant='contained' onClick={handleSendMessage}>
                                {sending ? 'sending...' : 'send'}
                            </Button>

                        </Box>

                        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-evenly', p: 1 }}>
                            {followings.length > 0 ? (
                                followings.map((following) => (
                                    <Box key={following.following._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={
                                                <Checkbox
                                                    checked={selectedFollowings.includes(following.following._id)}
                                                    onChange={() => handleCheckboxChange(following.following._id)}
                                                    sx={{
                                                        color: 'gray',
                                                        '& .MuiSvgIcon-root': {
                                                            width: 19,
                                                            height: 19,
                                                        },
                                                    }}
                                                />
                                            } color="transparent">
                                            <Avatar key={following.following._id} src={following.following.image.url} alt={following.following.username} sx={{ height: { xs: 60, md: 80 }, width: { xs: 60, md: 80 } }} />
                                        </Badge>
                                        <Typography sx={{ maxWidth: { xs: 60, md: 80 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mt: 1 }} variant="body2" color="textSecondary">
                                            {following.following.name}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography>No Followings yet to share</Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}
