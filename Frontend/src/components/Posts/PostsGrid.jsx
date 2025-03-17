
import { Link } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function PostsGrid({ posts, message, type }) {

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: { xs: '94vw', md: '60vw' },
                margin: 'auto',
            }}
        >
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Box
                        component={Link}
                        to={type === 'saved' ? (`/post/${post.post._id}`) : (`/post/${post._id}`)}
                        key={type === 'saved' ? (post.post._id) : (post._id)}
                        sx={{
                            aspectRatio: '1 / 1',

                            backgroundColor: 'black',
                            hover: 'cursor-pointer',
                            overflow: 'hidden',
                            position: 'relative',
                            borderRadius: '9px',
                            '&:hover .postOverlay': {
                                opacity: 1,
                            },
                            '&:hover img': {
                                transform: 'scale(1.1)',
                                opacity: 0.7,
                            },
                        }}
                    >
                        <img
                            src={type === 'saved' ? (
                                post.post.imageUrl.url ? post.post.imageUrl.url : post.post.imageUrl
                            ) : (
                                post.imageUrl.url ? post.imageUrl.url : post.imageUrl
                            )}
                            alt="post-img"
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '9px',
                                transition: 'all 0.3s ease',
                            }}
                        />
                        {/* Like Count Overlay */}
                        <Box
                            className="postOverlay"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                color: 'white',
                                transition: 'opacity 0.3s ease',
                                borderRadius: '9px',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FavoriteIcon />
                                <Typography variant="h6" component="span">
                                    {type === 'saved' ? (post.post.likeCount) : (post.likeCount)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" color="textSecondary">
                    {message}
                </Typography>
            )}
        </Box>

    );
}




