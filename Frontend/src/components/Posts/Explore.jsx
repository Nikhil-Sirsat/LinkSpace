
import { useEffect, useState } from 'react';
import { Box, ImageList, ImageListItem } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import { Link } from 'react-router-dom';
import './PostGreed.css';
import _ from 'lodash';  // lodash library for debouncing
import PostGridSkeleton from '../Skeletons/PostGridSkeleton';
import Search from '../User/Search.jsx';

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get('/api/post'); // Adjust the API endpoint as needed
                setPosts(response.data.allPosts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', }}>

            <Search route={'user'} />

            {/* explore posts :  */}
            <div>
                {loading ? (
                    <PostGridSkeleton />
                ) : (
                    <Box sx={{ width: { xs: '94vw', md: '85vw' }, m: 'auto' }}>
                        <ImageList variant="masonry" cols={4} gap={10}>
                            {posts.map((post) => (
                                <ImageListItem className='onPost' component={Link} to={`/post/${post._id}`} key={post._id}>
                                    <img
                                        srcSet={`${post.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${post.imageUrl.url ? post.imageUrl.url : post.imageUrl}?w=248&fit=crop&auto=format`}
                                        alt={"post-img"}
                                        loading="lazy"
                                        style={{ borderRadius: '9px' }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                )}
            </div>
        </Box>
    );
}
