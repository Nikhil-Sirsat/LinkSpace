
import { useContext, useEffect, useState } from 'react';
import { useParams, Outlet, Link } from 'react-router-dom';
import { Box, Avatar, Typography, Button, Badge, IconButton, Tooltip } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../AxiosInstance.jsx';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullWidthTabs from '../Posts/FullWidthTabs';
// import { FollowContext } from '../../context/IsFollowContext';
import IsFollowBTN from './IsFollowBTN';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ProfileSkeleton from '../Skeletons/ProfileSkeleton';
import { ThemeContext } from "../../context/ThemeContext";

export default function Profile() {
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    const [profileUser, setProfileUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    // const { followersCount, setFollowersCount, followingCount, setFollowingCount } = useContext(FollowContext);
    const [followingCount, setFollowingCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [userStory, setUserStory] = useState([]);
    const { mode, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {

        if (!username) return;

        const fetchUserData = async () => {
            setLoading(true);
            console.log('profile re-render');
            try {
                const response = await axiosInstance.get(`/api/user/${username}`);
                const { user: fetchedUser, posts: fetchedPosts, isFollowing, followersCount, followingCount } = response.data;

                setProfileUser(fetchedUser || {});
                setPosts(fetchedPosts || []);
                setIsFollowing(isFollowing || false);
                setFollowersCount(followersCount || 0);
                setFollowingCount(followingCount || 0);
            } catch (error) {
                console.error('Error fetching user and user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    // for gettting user story
    useEffect(() => {
        const fetchStory = async () => {
            if (profileUser._id) {
                try {
                    const response = await axiosInstance.get(`/api/story/${profileUser.username}`);
                    setUserStory(response.data.story);
                } catch (error) {
                    console.log('Error getting user stories:', error);
                }
            }
        };

        fetchStory();
    }, [profileUser]); // This will only run when profileUser is updated

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <>
            <Box sx={{ maxWidth: 900, margin: '0 auto', padding: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 4
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%', // Circular shape for the border container
                            width: { xs: 100, sm: 110, md: 170 }, // Slightly larger than the Avatar to show the border
                            height: { xs: 100, sm: 110, md: 170 },
                            background: userStory.length > 0 ? 'linear-gradient(45deg, blue, red, yellow)' : 'none', // Gradient if there's a story
                            padding: '0px', // Space for the border thickness
                        }}
                    >

                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            badgeContent={
                                <>
                                    {user._id === profileUser._id ? (
                                        <Tooltip title="Upload story" placement="top">
                                            <IconButton component={Link} to={`/upload-story`}>
                                                <AddBoxIcon sx={{ color: '#9c27b0' }} />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        null
                                    )}
                                </>
                            }
                        >
                            <Avatar
                                alt={profileUser.username}
                                src={profileUser.image.url || 'https://via.placeholder.com/150'}
                                component={Link}
                                to={userStory.length > 0 ? `/story/${profileUser.username}` : ''}
                                sx={{
                                    width: { xs: 90, sm: 100, md: 160 }, // Avatar size
                                    height: { xs: 90, sm: 100, md: 160 },
                                    borderRadius: '50%', // Ensures the Avatar remains circular
                                    border: userStory.length === 0 ? '5px solid transparent' : 'none', // White border if no story
                                }}
                            />
                        </Badge>
                    </Box>

                    <Box sx={{ flexGrow: 1, ml: 5 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' }
                            }}
                        >
                            {profileUser.username}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    mr: 4,
                                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1rem' }
                                }}
                            >
                                <strong>{posts.length}</strong> Posts
                            </Typography>

                            <Tooltip title="see-followers" placement="top">
                                <Typography
                                    component={Link}
                                    to={`/user/${profileUser.username}/followers`}
                                    variant="body1"
                                    sx={{
                                        mr: 4,
                                        fontSize: { xs: '0.8rem', sm: '1rem', md: '1rem' },
                                        textDecoration: 'none',
                                        color: mode === "dark" ? "white" : "black",
                                    }}
                                >
                                    <strong>{followersCount}</strong> Followers
                                </Typography>
                            </Tooltip>

                            <Tooltip title="see-followings" placement="top">
                                <Typography
                                    component={Link}
                                    to={`/user/${profileUser.username}/followings`}
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '0.8rem', sm: '1rem', md: '1rem' },
                                        textDecoration: 'none',
                                        color: mode === "dark" ? "white" : "black",
                                    }}
                                >
                                    <strong>{followingCount}</strong> Following
                                </Typography>
                            </Tooltip>

                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            {user._id === profileUser._id ? (
                                <>
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to={`/user/${profileUser.username}/edit`}
                                        sx={{
                                            fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                                            padding: { xs: '3px 6px', sm: '4px 8px', md: '5px 15px' },
                                            textTransform: 'none',
                                            backgroundColor: '#0073e6',
                                            color: 'white',
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to={`/${profileUser.username}/create-post`}
                                        sx={{
                                            fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                                            padding: { xs: '3px 6px', sm: '4px 8px', md: '5px 10px' },
                                            backgroundColor: '#0073e6',
                                            color: 'white',
                                        }}
                                    >
                                        post +
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <IsFollowBTN username={username} />
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to={`/Messages/${profileUser.username}`}
                                        sx={{
                                            fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                                            padding: { xs: '3px 6px', sm: '4px 8px', md: '5px 15px' },
                                            textTransform: 'none',
                                            backgroundColor: '#0073e6',
                                            color: 'white',
                                        }}
                                    >
                                        message
                                    </Button>
                                </>

                            )}

                            {user._id === profileUser._id ? (
                                <Link style={{ paddingTop: '2px', color: '#0073e6' }} to={`/user/${profileUser.username}/setting`}>
                                    <Tooltip title="settings" placement="bottom">
                                        <SettingsIcon />
                                    </Tooltip>
                                </Link>
                            ) : (
                                // <Link style={{ paddingTop: '2px', color: '#0073e6' }} to={`#`}>
                                //     <Tooltip title="more" placement="bottom">
                                //         <ExpandMoreIcon />
                                //     </Tooltip>
                                // </Link>
                                null
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="body1"
                        sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' } }}
                    >
                        <strong>{profileUser.name}</strong>
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
                    >
                        {profileUser.bio || 'This is your bio. Update it to share more about yourself.'}
                    </Typography>
                </Box>
                {/* <hr></hr> */}
                <FullWidthTabs posts={posts} CurrUser={user} profileUser={profileUser} />
            </Box >
            <Outlet />
        </>
    );
}
