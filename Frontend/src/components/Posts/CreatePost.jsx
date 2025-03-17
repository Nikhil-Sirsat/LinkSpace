import { useState, useContext, useCallback } from 'react';
import axiosInstance from '../../AxiosInstance.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { Box, TextField, Button, Typography, Card, CardContent, CardHeader, List, Grid, ListItem, CircularProgress, Chip, Alert, Avatar, Modal, Tooltip } from '@mui/material';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useSnackbar } from '../../context/SnackBarContext.jsx';
import PersonPinIcon from '@mui/icons-material/PersonPin';

export default function CreatePost() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        imageUrl: null,
        caption: '',
        taggedUsers: [],
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // update formData with a file or value
        setFormData({
            ...formData,
            [name]: files && files.length > 0 ? files[0] : value,
        });

        // Handle file selection and preview
        if (files && files.length > 0) {
            const file = files[0];

            const reader = new FileReader(); // Create a FileReader instance

            // Define the onload handler for the FileReader
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };

            reader.readAsDataURL(file); // Start reading the file
        }
    };

    // Debounced search function using lodash
    const handleSearch = useCallback(debounce(async (searchTerm) => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/user/search-users?q=${searchTerm}`);
            setSearchResults(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError('Error fetching users.');
        }
    }, 500), []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        const data = new FormData();
        data.append('imageUrl', formData.imageUrl);
        data.append('caption', formData.caption);
        formData.taggedUsers.forEach((userId) => data.append('taggedUsers[]', userId));

        try {
            await axiosInstance.post('/api/post', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/user/${user.username}`);
            setMessage('Post created successfully');
            showSnackbar('Post created successfully');
            setSubmitLoading(false);
        } catch (error) {
            console.log(error.response?.data?.error || 'Error creating post');
            setError(error.response?.data?.error || 'Something went wrong');
            setSubmitLoading(false);
        }
    };

    // Add user to tagged list
    const handleAddTag = (user) => {
        if (!formData.taggedUsers.includes(user._id)) {
            setFormData({
                ...formData,
                taggedUsers: [...formData.taggedUsers, user._id],
            });
        }
    };

    // Remove tagged user
    const handleRemoveTag = (userId) => {
        setFormData({
            ...formData,
            taggedUsers: formData.taggedUsers.filter((id) => id !== userId),
        });
    };

    return (
        <Modal
            open={true}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >

            {/* Main Box */}
            <Box
                sx={{
                    width: { xs: '100%', sm: '90%', md: '70%' },
                    height: { xs: '100%', sm: '90%', md: '85%' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    borderRadius: { xs: 0, sm: 1, md: 2 },
                    overflow: 'hidden',
                    padding: { xs: 1, sm: 2 },
                }}
            >

                {/* Img Box */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexBasis: { xs: '75%', md: '50%' },
                        height: { xs: 'auto', md: '100%' },
                        overflow: 'hidden',
                        backgroundColor: 'black',
                    }}
                >
                    <img
                        src={selectedImage || 'https://via.placeholder.com/150'}
                        style={{
                            height: '100%',
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </Box>

                {/* Post Data */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexBasis: { xs: '25%', md: '50%' },
                        height: { xs: 'auto', md: '100%' },
                        minWidth: '300px',
                        width: { xs: '100%', md: 'auto' },
                        overflowY: 'auto',
                        padding: { xs: 1, sm: 2 },
                    }}
                >

                    {/* Post Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0, md: 2 }, mb: 5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="See profile" placement="bottom">
                                <Avatar src={user.image.url} alt={user.username} />
                            </Tooltip>
                            <Typography variant="h6" sx={{ ml: 2 }}>
                                {user.username}
                            </Typography>
                        </Box>
                    </Box>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%' }}>

                        {/* Caption Input */}
                        <Box mb={3} sx={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                label="Caption"
                                variant="outlined"
                                name="caption"
                                id='caption'
                                multiline
                                rows={4}
                                value={formData.caption}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        {/* File Input for Image */}
                        <Box mb={1} sx={{ width: '100%' }}>
                            <TextField
                                type="file"
                                variant="standard"
                                name="imageUrl"
                                id='imageUrl'
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Box>

                        {/* Tag Users Section */}
                        <Box mb={3} mt={3} sx={{ width: '100%' }}>
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <PersonPinIcon sx={{ color: 'gray', mr: 1, my: 0.5 }} />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    name="taggedUserId"
                                    multiline
                                    rows={1}
                                    placeholder="Tag users"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </Grid>
                            {loading && <CircularProgress sx={{ mt: 2 }} />}
                            {searchResults.length > 0 && (
                                <List sx={{ maxHeight: 200, overflowY: 'auto', mt: 2, backgroundColor: 'aliceblue' }}>
                                    {searchResults.map((user) => (
                                        <ListItem
                                            key={user._id}
                                            button
                                            onClick={() => handleAddTag(user)}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1, '&:hover': { backgroundColor: '#f0f0f0' }, textDecoration: 'none' }}>
                                                <Avatar src={user.image.url} alt={user.username} />
                                                <Box sx={{ ml: 2, flex: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                                                        <strong>{user.username}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'gray' }}>{user.name} · {user.followersCount} followers</Typography>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                            {formData.taggedUsers.length > 0 && (
                                <Box mt={2}>
                                    {formData.taggedUsers.map((taggedUser) => (
                                        <Chip
                                            key={taggedUser}
                                            label={searchResults.find((user) => user._id === taggedUser)?.username || taggedUser}
                                            onDelete={() => handleRemoveTag(taggedUser)}
                                            sx={{ margin: '0 4px 4px 0' }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 5 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{
                                    backgroundColor: '#ff8c00',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    marginTop: 5,
                                    marginBottom: 5,
                                    textTransform: 'none',
                                }}
                            >
                                {submitLoading ? "Loading..." : "Create Post"}
                            </Button>
                            <Button
                                component={Link}
                                to={`/user/${user.username}`}
                                variant="contained"
                                style={{
                                    backgroundColor: 'grey',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    marginTop: 5,
                                    marginBottom: 5,
                                    textTransform: 'none',
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>

                        {/* Feedback Messages */}
                        {message && <Alert severity="success">{message}</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}
                    </form>

                </Box>
            </Box>
        </Modal>
    );
};
