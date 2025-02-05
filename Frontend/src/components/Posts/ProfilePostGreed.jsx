import './PostGreed.css';
import { Link, Navigate } from 'react-router-dom';
import { Typography, Box, ImageList, ImageListItem } from '@mui/material';

export default function ProfilePostGrid({ posts }) {

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
                gap: '3px',
                padding: '3px',
            }}
        >
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Box
                        className="onPost"
                        component={Link}
                        to={`/post/${post._id}`}
                        key={post._id}
                        sx={{
                            backgroundColor: 'black',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            component="img"
                            src={post.imageUrl.url ? post.imageUrl.url : post.imageUrl}
                            alt={`Post ${post._id}`}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        />
                    </Box>
                ))
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        padding: 2,
                    }}
                >
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div" // Changed from default <p> to <div>
                        sx={{ textAlign: 'center' }}
                    >
                        No posts created
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
