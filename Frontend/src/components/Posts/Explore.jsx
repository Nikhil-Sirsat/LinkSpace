
import { useEffect, useState, useContext } from 'react';
import { Box, ImageList, ImageListItem, TextField, Typography, Button, Avatar } from '@mui/material';
import axios from 'axios';
import axiosInstance from '../../AxiosInstance.jsx';
import { Link } from 'react-router-dom';
import './PostGreed.css';
import _ from 'lodash';  // lodash library for debouncing
import PostGridSkeleton from '../Skeletons/PostGridSkeleton';
import UserListSkeleton from '../Skeletons/UserListSkeleton';
import { ThemeContext } from "../../context/ThemeContext";

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [page, setPage] = useState(1);
    const [cancelToken, setCancelToken] = useState(null);
    const { mode } = useContext(ThemeContext);

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

    const fetchUsers = async (query, page = 1) => {
        if (cancelToken) {
            cancelToken.cancel("Operation canceled due to new request.");
        }

        const source = axios.CancelToken.source();
        setCancelToken(source);
        setUserLoading(true);

        try {
            const response = await axiosInstance.get(`/api/user/search-users?q=${query}&page=${page}&limit=10`, {
                cancelToken: source.token
            });

            // console.log("API Response:", response.data); // Debugging output

            const { data, hasMore } = response.data || { data: [], hasMore: false };

            setUsers(prevUsers => (page === 1 ? data : [...prevUsers, ...data]));
            setHasMoreUsers(hasMore);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("Previous request canceled", err.message);
            } else {
                console.error("Error fetching users", err);
            }
        } finally {
            setUserLoading(false);
        }
    };

    const debouncedFetchUsers = _.debounce(fetchUsers, 300);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setPage(1);
        setHasMoreUsers(true);
        if (query.length > 0) {
            debouncedFetchUsers(query, 1);
        } else {
            setUsers([]);
        }
    };

    const loadMoreUsers = () => {
        if (hasMoreUsers && !userLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            debouncedFetchUsers(searchQuery, nextPage);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-evenly', width: '100vw', position: 'relative' }}>

            {/* search box :  */}
            <Box sx={{ width: { xs: '100%', md: '27%' }, height: { xs: 'auto', md: '87vh' }, borderRadius: 5, position: 'sticky', top: '75px', zIndex: 10, pl: 4, pr: 4, pt: 2, pb: 1, boxShadow: { xs: 0, md: 5 }, }}>
                <Box>
                    <TextField
                        fullWidth
                        label="search users"
                        variant="outlined"
                        name="username"
                        id='username'
                        value={searchQuery}
                        onChange={handleSearch}
                        required
                        sx={{
                            backgroundColor: '#e1d9c7',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: 'none',
                                },
                            },
                        }}
                    />
                    {userLoading ? (
                        <UserListSkeleton />
                    ) : (
                        <>
                            {users && users.length > 0 && (
                                users.map(user => (
                                    <Box component={Link} to={`/user/${user.username}`} key={user._id} sx={{ display: 'flex', alignItems: 'flex-start', p: 1, mt: 1, '&:hover': { backgroundColor: mode === "dark" ? '#323232' : '#f0f0f0' }, textDecoration: 'none' }}>
                                        <Avatar src={user.image.url} alt={user.username} />
                                        <Box sx={{ ml: 2, flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', color: mode === 'dark' ? 'white' : 'black' }}>
                                                <span> <strong>{user.username}</strong></span>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'gray' }}>{user.name} . {user.followersCount} followers</Typography>
                                        </Box>
                                    </Box>
                                ))
                            )}
                            {hasMoreUsers && searchQuery && (
                                <Button onClick={loadMoreUsers} variant="outlined" sx={{ mt: 2 }}>
                                    Load More
                                </Button>
                            )}
                            {!hasMoreUsers && <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>no result found.</Typography>}
                        </>
                    )}
                </Box>
            </Box>

            {/* explore posts :  */}
            <div>
                {loading ? (
                    <PostGridSkeleton />
                ) : (
                    <Box sx={{ width: { xs: '94vw', md: '70vw' }, m: 'auto' }}>
                        <ImageList variant="masonry" cols={3} gap={5}>
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
