import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Avatar, IconButton } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import ViewStoryArr from './ViewStoryArr';
import LogoutIcon from '@mui/icons-material/Logout';

export default function ViewStory() {
    const { username } = useParams();
    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await axiosInstance.get(`/api/story/${username}`);
                // console.log(response.data.story);
                setStory(response.data.story);

            } catch (error) {
                console.error('Error fetching story:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [username]);

    const handleClose = () => {
        navigate(-1);
    };

    if (loading) {
        return <p>Loading ... !</p>;
    }

    if (!story) {
        return <p>story not found</p>;
    }

    return (
        <>
            <Modal
                open={true}
                onClose={handleClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    backgroundColor: '#1a1a1a'
                }}
            >
                {/* Main Box */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '27%' },
                        height: { xs: '100%', md: '95%' },
                        bgcolor: '#4b4c44',
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        borderRadius: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', pl: 3.5, pt: 2 }}>
                        <Avatar component={Link} to={`/user/${story[0].owner.username}`} src={story[0].owner.image.url} alt={story[0].owner.username} />
                        <Box sx={{ ml: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                                <span> <strong>{story[0].owner.username}</strong></span>
                            </Typography>
                            <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="body2" color="white">
                                {story[0].owner.name}
                            </Typography>
                        </Box>
                        <IconButton sx={{ mr: 4 }} onClick={handleClose}>
                            <LogoutIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                    <ViewStoryArr storys={story} />

                </Box>
            </Modal>
        </>
    );
}

