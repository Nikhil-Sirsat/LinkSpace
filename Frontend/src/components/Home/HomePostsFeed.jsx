import { useState, useEffect, useContext } from 'react';
import { red } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { Box, Tooltip, Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LikeButton from '../Posts/LikeButton';
import SavedPostBTN from '../Posts/SavePostBTN';
import SharePost from '../Posts/SharePost';
import HomePostFeedSkeleton from '../Skeletons/HomePostFeedSkeleton';
import axiosInstance from '../../AxiosInstance.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function HomePostFeedCard() {
    const { user } = useContext(AuthContext);
    const [postFeed, setPostFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sharePostUsers, setSharePostUsers] = useState(false);
    const [selectIdToShare, setSelectIdToShare] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchPostsFeed = async () => {
            try {

                // Check if user.followingCount exists and is greater than 0
                const url = user?.followingCount > 0 ? '/api/post/home-posts' : '/api/post/suggested-posts';
                console.log(url);

                const response = await axiosInstance.get(url);

                const postsData = response.data.posts;

                // Fetch isLiked and isSaved for each post asynchronously
                const updatedPosts = await Promise.all(
                    postsData.map(async (post) => {
                        try {
                            const [likeResponse, savedResponse] = await Promise.all([
                                axiosInstance.get(`/api/like/${post._id}/isLiked`),
                                axiosInstance.get(`/api/savedPost/${post._id}/isSaved`),
                            ]);

                            return {
                                ...post,
                                isLiked: likeResponse.data.isLiked,
                                isSaved: savedResponse.data.isSaved,
                            };
                        } catch (err) {
                            console.error('Error fetching post data:', err);
                            return { ...post, isLiked: false, isSaved: false }; // Default if errors occur
                        }
                    })
                );

                setPostFeed(updatedPosts);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching home-posts:', error);
                setLoading(false);
            }
        };

        fetchPostsFeed();
    }, []);

    const handleToggleShareUsers = (event, idToShare) => {
        setSharePostUsers(!sharePostUsers);  // Toggle the visibility
        setSelectIdToShare(idToShare);
    };

    if (loading) {
        return <HomePostFeedSkeleton />;
    }

    return (
        <Box sx={{ padding: '10px', width: { xs: '99%', md: '50%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {user.followingCount > 0 ? null : <Typography variant="body2" color="textSecondary" sx={{ m: 3 }}>Suggested Posts for you</Typography>}

            {postFeed.map((post) => (
                <Card key={post._id} sx={{ width: { xs: '95vw', md: 450 }, mb: 5, boxShadow: 'none', borderRadius: 'none' }}>
                    <CardHeader
                        sx={{ pl: 0.5, pr: 0 }}
                        avatar={
                            <Avatar component={Link} to={`/user/${post.owner.username}`} src={post.owner.image.url} sx={{ bgcolor: red[500] }} aria-label="owner-img"></Avatar>
                        }
                        action={
                            <IconButton aria-label="settings" sx={{ mr: 1 }}>
                                <MoreHorizIcon />
                            </IconButton>
                        }
                        title={post.owner.username}
                        subheader={new Date(post.createdAt).toLocaleString()}
                    />
                    <CardMedia
                        component="img"
                        image={post.imageUrl.url ? post.imageUrl.url : post.imageUrl}
                        alt="post-img"
                        sx={{ objectFit: 'contain', height: 'auto', backgroundColor: 'black' }}
                    />
                    <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex' }}>
                            <LikeButton
                                post={post}
                                initialLikes={post.likeCount}
                                initialLiked={post.isLiked} // Pass isLiked status
                            />

                            <Tooltip title="share post" placement="top">
                                <IconButton aria-label="share-post" onClick={(e) => handleToggleShareUsers(e, post._id)}>
                                    <ShareIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="see comments" placement="top">
                                <IconButton component={Link} to={`/post/${post._id}`}>
                                    <MapsUgcOutlinedIcon sx={{ fontSize: 27 }} />
                                </IconButton>
                            </Tooltip>

                        </Box>

                        <SavedPostBTN
                            postId={post._id}
                            isInitiallySaved={post.isSaved}
                        />
                    </CardActions>
                    <CardContent>
                        <Typography variant="body2">
                            {post.caption}
                            {post.taggedUsers?.map((tagUser) => (
                                <Link key={tagUser._id} to={`/user/${tagUser.username}`} style={{ textDecoration: 'none', marginLeft: '10px', color: "#0073e6" }} >@{tagUser.username}</Link>
                            ))}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            <SharePost
                id={selectIdToShare}
                handleToggleShareUsers={handleToggleShareUsers}
                sharePostUsers={sharePostUsers}
            // setSharePostUsers={setSharePostUsers}
            />
        </Box>
    );
}
