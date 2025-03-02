import { useState, useContext } from 'react';
import axiosInstance from '../../AxiosInstance.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useSnackbar } from '../../context/SnackBarContext';
import { Modal, Box, Tooltip, Avatar, Typography, TextField, Button, Alert } from '@mui/material';

export default function UploadStory() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        mediaUrl: null,
        caption: '',
    });
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Safely update formData with a file or value
        setFormData({
            ...formData,
            [name]: files && files.length > 0 ? files[0] : value,
        });

        // Handle file selection and preview
        if (files && files.length > 0) {
            const file = files[0]; // Safely get the first file

            const reader = new FileReader(); // Create a FileReader instance

            // Define the onload handler for the FileReader
            reader.onload = (e) => {
                setSelectedImage(e.target.result); // Set the Base64 string as the image source
            };

            reader.readAsDataURL(file); // Start reading the file
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('mediaUrl', formData.mediaUrl);
        data.append('caption', formData.caption);

        try {
            await axiosInstance.post('/api/story/post-story', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/user/${user.username}`);
            showSnackbar('Story Uploaded successfully !');
            setLoading(false);

        } catch (error) {
            setError(error.response?.data?.error || 'Something went wrong');
            setLoading(false);
        }
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
                    width: { xs: '100%', md: '70%' },
                    maxHeight: '100vh', // Ensure the modal doesn't exceed the viewport height
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    borderRadius: { xs: 0, md: 2 },
                    overflow: 'hidden', // To handle excessive content
                }}
            >
                {/* Scrollable Container */}
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto', // Enable vertical scrolling for content
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                    }}
                >
                    {/* Image Box */}
                    <Box
                        sx={{
                            // flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // flexBasis: { xs: '75%', md: '50%' },
                            height: '100vh',
                            minWidth: '40%',
                            maxWidth: { xs: '100%', md: '60%' },
                            // maxHeight: { xs: '90vh', md: '100%' }, // Limit image height on mobile
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

                    {/* Content Box */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexBasis: { xs: '25%', md: '50%' },
                            minWidth: '300px',
                            width: { xs: '100%', md: 'auto' },
                            overflowY: 'auto',
                            p: 2,
                        }}
                    >
                        {/* Post Header */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                mt: { xs: 0, md: 2 },
                                mb: 5,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                                <Tooltip title="See Profile" placement="bottom">
                                    <Avatar src={user.image.url} alt={user.username} />
                                </Tooltip>
                                <Typography variant="h6" sx={{ ml: 2 }}>
                                    {user.username}
                                </Typography>
                            </Box>
                        </Box>

                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '80%',
                            }}
                        >
                            {/* Caption Input */}
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Caption"
                                    variant="outlined"
                                    name="caption"
                                    id="caption"
                                    multiline
                                    rows={4}
                                    value={formData.caption}
                                    onChange={handleChange}
                                    required
                                />
                            </Box>

                            {/* File Input */}
                            <Box mb={1}>
                                <TextField
                                    type="file"
                                    variant="standard"
                                    name="mediaUrl"
                                    id="mediaUrl"
                                    onChange={handleChange}
                                    required
                                />
                            </Box>

                            {/* Submit Button */}
                            <Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#371489',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        marginTop: 2,
                                        marginBottom: 2,
                                        textTransform: 'none',
                                        mr: 2,
                                    }}
                                >
                                    {loading ? 'Loading...' : 'Upload Story'}
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
                                        ml: 2,
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>

                            {/* Feedback Messages */}
                            {error && <Alert severity="error">{error}</Alert>}
                        </form>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );

};
