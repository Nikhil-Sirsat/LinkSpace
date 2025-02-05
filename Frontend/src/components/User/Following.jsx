
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Modal, Box, Typography, Avatar } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import IsFollowBTN from './IsFollowBTN';
import { AuthContext } from '../../context/AuthContext';
import UserListSkeleton from '../Skeletons/UserListSkeleton';
import { ThemeContext } from "../../context/ThemeContext";

export default function Following() {
    const { username } = useParams();
    const [followings, setFollowings] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { mode } = useContext(ThemeContext);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axiosInstance.get(`/api/follow/${username}/following`);
                setFollowings(response.data.following);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, [username]);

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <Modal
            open={true}
            onClose={handleClose}
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
                {loading ? (
                    <Box height='100%' width='100%' p={4}>
                        <UserListSkeleton />
                    </Box>
                ) : (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', borderRadius: '5px', height: '100%', width: '100%' }}>
                        <Box sx={{ backgroundColor: mode === 'dark' ? 'black' : 'white', p: 1.5, position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid gray' }}>
                            <span>Followings</span>
                        </Box>
                        {followings.length > 0 ? (
                            followings.map((following) => (
                                <Box key={following.following._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', pt: 1.2, pb: 1.2, pl: 2, pr: 2, borderRadius: '7px' }}>
                                    <Avatar component={Link} to={`/user/${following.following.username}`} src={following.following.image.url} alt={following.following.username} />
                                    <Box sx={{ ml: 2, flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <span> <strong>{following.following.username}</strong></span>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {following.following.name}
                                        </Typography>
                                    </Box>
                                    {user._id === following.following._id ? (
                                        ""
                                    ) : (
                                        <IsFollowBTN username={following.following.username} />
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography>No Followings yet</Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Modal>
    );
}