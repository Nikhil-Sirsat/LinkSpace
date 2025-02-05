
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import _ from 'lodash';  // lodash library for debouncing
import { Box, TextField, Typography, Button, Avatar, Modal } from '@mui/material';
import axios from 'axios';
import UserListSkeleton from '../Skeletons/UserListSkeleton';
import { ThemeContext } from "../../context/ThemeContext";
import axiosInstance from '../../AxiosInstance.jsx';

export default function StartMsg() {
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [page, setPage] = useState(1);
    const [cancelToken, setCancelToken] = useState(null);

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

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <Modal open={true} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>

            <Box
                sx={{
                    width: { xs: '90%', md: '40%' },
                    height: { xs: '60%', md: '70%' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                }}
            >

                <Box sx={{ width: '100%', height: '100%', p: 4 }}>
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
                                        <Box component={Link} to={`/Messages/${user.username}`} key={user._id} sx={{ display: 'flex', alignItems: 'flex-start', p: 1, '&:hover': { backgroundColor: mode === "dark" ? '#323232' : '#f0f0f0' }, textDecoration: 'none', mt: 1 }}>
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
            </Box>
        </Modal>
    );
}




