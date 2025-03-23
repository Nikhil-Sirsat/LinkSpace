import { useState, useContext } from 'react';
import axiosInstance from '../../AxiosInstance.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useSnackbar } from '../../context/SnackBarContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import {
    Container,
    Grid,
    CardContent,
    TextField,
    Button,
    MenuItem,
    Alert,
    FormControl,
    InputLabel,
    InputAdornment,
    Input,
    IconButton,
    Avatar,
    Box,
} from '@mui/material';

export default function EditeProfile() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: `${user.name}`,
        username: `${user.username}`,
        email: `${user.email}`,
        password: '',
        age: `${user.age}`,
        gender: `${user.gender}`,
        bio: `${user.bio}`,
        image: null,
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const showSnackbar = useSnackbar();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

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
                setSelectedImage(e.target.result);
            };

            reader.readAsDataURL(file); // Start reading the file
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('bio', formData.bio);
        data.append('image', formData.image);

        try {
            // **Send update request including password**
            const response = await axiosInstance.put(`/api/user/edit/${user._id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // **If successful, re-login and navigate**
            const success = await login(formData.username, formData.password);
            if (success) {
                showSnackbar('Profile updated successfully');
                navigate(`/user/${formData.username}`);
            } else {
                setMessage('Error in login after update');
            }

        } catch (error) {
            console.error('Error updating profile:', error);

            // **Display specific error messages**
            if (error.response) {
                setMessage(error.response.data.message || 'Something went wrong');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="md">

            <Grid item xs={12} md={7}>
                <CardContent style={{ padding: '2rem', height: '100%' }}>

                    <Avatar
                        src={selectedImage ? selectedImage : user.image.url}
                        sx={{
                            width: { xs: 90, sm: 100, md: 160 },
                            height: { xs: 90, sm: 100, md: 160 },
                            borderRadius: '50%',
                            margin: "auto",
                            mb: 5,
                        }}
                    />

                    <form onSubmit={handleSubmit} encType='multipart/form-data'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    variant="standard"
                                    name="name"
                                    type='text'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="standard"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <AccountCircle sx={{ color: 'gray', mr: 1, my: 0.5 }} />
                                <TextField
                                    fullWidth
                                    label="username"
                                    id="input-with-sx"
                                    variant="standard"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl sx={{ width: '25ch' }} variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password" sx={{ color: 'white' }}>Password</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword ? 'hide the password' : 'display the password'
                                                    }
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                >
                                                    {showPassword ? <VisibilityOff sx={{ color: 'gray' }} /> : <Visibility sx={{ color: 'gray' }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Age"
                                    variant="standard"
                                    name="age"
                                    id='age'
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Gender"
                                    variant="standard"
                                    name="gender"
                                    id='gender'
                                    select
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="" disabled>Select Gender</MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    variant="standard"
                                    name="bio"
                                    id='bio'
                                    multiline
                                    rows={1}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="file"
                                    variant="standard"
                                    name="image"
                                    id='image'
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Error Message */}
                            {message && (
                                <Alert severity="error" style={{ marginTop: '1rem', borderRadius: '8px' }}>
                                    {message}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', width: '100%' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        margin: 'auto',
                                        backgroundColor: '#ff8c00',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        marginTop: 25,
                                    }}
                                >
                                    {loading ? "Loading..." : "Update"}
                                </Button>
                                <Button
                                    component={Link}
                                    to={`/user/${user.username}`}
                                    variant="contained"
                                    style={{
                                        margin: 'auto',
                                        backgroundColor: 'grey',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        marginTop: 25,
                                    }}
                                >
                                    Cancle
                                </Button>
                            </Box>

                        </Grid>
                    </form>

                </CardContent>
            </Grid>

        </Container>
    );
};
