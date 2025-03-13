
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Box, Typography, Avatar, Alert } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import IsFollowBTN from '../User/IsFollowBTN';
import { AuthContext } from '../../context/AuthContext';
import UserListSkeleton from '../Skeletons/UserListSkeleton';
import { ThemeContext } from "../../context/ThemeContext";

export default function LikedUsers({ id, open, handleToggleLikedUsers }) {
    const { mode } = useContext(ThemeContext);
    const [likedUsers, setLikedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        const fetchLikedUsers = async () => {
            try {
                const response = await axiosInstance.get(`/api/like/${id}/LikedUsers`);
                setLikedUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching liked likedUsers:', error);
                setErrMsg(error.response.data.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchLikedUsers();
    }, [id, open]);

    return (
        <Modal
            open={open}
            onClose={handleToggleLikedUsers}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >

            <Box
                sx={{
                    width: { xs: '80%', md: '30%' },
                    height: { xs: '60%', md: '60%' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                }}
            >
                {/* Error Message */}
                {errMsg && <Alert severity="error">{errMsg}</Alert>}

                {loading ? (
                    <Box height='100%' width='100%' p={4}>
                        <UserListSkeleton />
                    </Box>
                ) : (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', borderRadius: '5px', height: '100%', width: '100%' }}>
                        <Box sx={{ p: 1.5, position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid gray', backgroundColor: mode === 'dark' ? 'black' : 'white' }}>
                            <span>Liked User</span>
                        </Box>
                        {likedUsers.length > 0 ? (
                            likedUsers.map((likedUser) => (
                                <Box key={likedUser._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', pt: 1.2, pb: 1.2, pl: 2, pr: 2, borderRadius: '7px' }}>
                                    <Avatar component={Link} to={`/user/${likedUser.username}`} src={likedUser.image.url} alt={likedUser.username} />
                                    <Box sx={{ ml: 2, flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <span> <strong>{likedUser.username}</strong></span>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {likedUser.name}
                                        </Typography>
                                    </Box>
                                    {user._id === likedUser._id ? (
                                        ""
                                    ) : (
                                        <IsFollowBTN username={likedUser.username} />
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography>No Likes yet</Typography>
                        )}
                    </Box>
                )}

            </Box>
        </Modal>
    );
}