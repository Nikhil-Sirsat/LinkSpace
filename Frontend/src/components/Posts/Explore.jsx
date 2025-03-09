
// components/TrendingPosts.jsx
import { useEffect, useState, useCallback } from 'react';
import { Box, ImageList, ImageListItem, CircularProgress, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axiosInstance from '../../AxiosInstance.jsx';
import { Link } from 'react-router-dom';
import _ from 'lodash';  // lodash library for debouncing
import Search from '../User/Search.jsx';
import PostGridSkeleton from '../Skeletons/PostGridSkeleton.jsx';
import Masonry from 'react-masonry-css';
import './Explore.css';

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const breakpointColumns = {
        default: 3,
    };

    const fetchTrendingPosts = useCallback(async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/post/trending-posts?page=${page}&limit=12`);

            if (response.data.trendingPosts) {
                setPosts((prevPosts) => [...prevPosts, ...response.data.trendingPosts]);
                setHasMore(response.data.hasMore);
                setPage((prevPage) => prevPage + 1);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching trending posts:', error);
        }
        setLoading(false);
    });

    const debouncedFetchPosts = _.debounce(fetchTrendingPosts, 300);

    useEffect(() => {
        debouncedFetchPosts();
    }, []);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
            !loading &&
            hasMore
        ) {
            debouncedFetchPosts();
        }
    }, [loading, hasMore, fetchTrendingPosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', }}>

            <Search route={'user'} />

            {/* explore posts :  */}

            <Masonry
                breakpointCols={breakpointColumns}
                className="masonry-grid"
                columnClassName="masonry-column"
                style={{
                    width: '90vw',
                }}
            >
                {posts.map((post) => (
                    <Box
                        key={post._id}
                        component={Link}
                        to={`/post/${post._id}`}
                        sx={{
                            position: 'relative',
                            display: 'block',
                            textDecoration: 'none',
                            borderRadius: '9px',
                            overflow: 'hidden',
                            '&:hover .postOverlay': { opacity: 1 }, // Show overlay on hover
                            '&:hover img': { transform: 'scale(1.1)', opacity: 0.7 }, // Image zoom effect
                        }}
                    >
                        <img
                            src={`${post.imageUrl.url ? post.imageUrl.url : post.imageUrl}?w=400&fit=crop&auto=format`}
                            alt="post-img"
                            loading="lazy"
                            style={{
                                width: '100%',
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
                                    {post.likeCount}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))
                }
            </Masonry >

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {/* <CircularProgress /> */}
                    <PostGridSkeleton />
                </Box>
            )}

            {
                !hasMore && (
                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        No more posts to show.
                    </Typography>
                )
            }
        </Box >
    );
};
