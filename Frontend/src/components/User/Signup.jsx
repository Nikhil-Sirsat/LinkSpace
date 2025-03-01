
import signUpPoster from '../../assets/signup Poster 3.jpg';

import { useState, useContext } from 'react';
import axiosInstance from '../../AxiosInstance.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
    Container,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    MenuItem,
    Typography,
    Alert,
    FormControl,
    InputLabel,
    InputAdornment,
    Input,
    IconButton,
    Avatar,
    Box,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { styled } from '@mui/material/styles';

// custom text field
const CustomTextField = styled(TextField)({
    borderRadius: '8px',
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'white',
    },
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
});

// Styled InputLabel
const CustomInputLabel = styled(InputLabel)({
    color: 'white',
    '&.Mui-focused': {
        color: 'white',
    },
});

// Styled Input
const CustomInput = styled(Input)({
    color: 'white',
    '&:before': {
        borderBottomColor: 'white',
    },
    '&:after': {
        borderBottomColor: 'white',
    },
    '&:hover:before': {
        borderBottomColor: 'white',
    },
});

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        conformPass: '',
        age: '',
        gender: '',
        bio: '',
        image: null,
    });
    const [message, setMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

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
        setMessage('');
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('bio', formData.bio);
        data.append('image', formData.image);

        if (formData.password !== formData.conformPass) {
            setMessage('password miss match');
            return;
        }

        try {
            await axiosInstance.post('/api/user/SignUp', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(formData.image);
            const success = await login(formData.username, formData.password);
            if (success) {
                navigate('/');
            } else {
                setMessage('Error in registration');
            }
        } catch (error) {
            console.log(error.message);
            setMessage(error.response.data.error);
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', backgroundColor: '#121212', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: 3, background: '#1e1e1e' }}>
                    <Grid container>
                        {/* Left Side: Image */}
                        <Grid item xs={12} md={5} sx={{ backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                            <img src={signUpPoster} alt="Signup Graphic" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        </Grid>

                        {/* Right Side: Form */}
                        <Grid item xs={12} md={7}>
                            <CardContent sx={{ padding: '2.5rem', backgroundColor: 'black' }}>

                                <Avatar src={selectedImage || 'https://via.placeholder.com/150'} sx={{ width: 120, height: 120, borderRadius: '50%', margin: "auto", mb: 3, border: '3px solid #00adb5' }} />

                                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField fullWidth label="Name" variant="outlined" name="name" type='text' value={formData.name} onChange={handleChange} required />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField fullWidth label="Email" variant="outlined" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <AccountCircle sx={{ color: '#00adb5', mr: 1 }} />
                                            <CustomTextField fullWidth label="Username" variant="outlined" name="username" value={formData.username} onChange={handleChange} required />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth variant="outlined">
                                                <CustomInputLabel>Password</CustomInputLabel>
                                                <CustomInput type={showPassword ? 'text' : 'password'}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={handleClickShowPassword}>
                                                                {showPassword ? <VisibilityOff sx={{ color: '#00adb5' }} /> : <Visibility sx={{ color: '#00adb5' }} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl sx={{ width: '25ch' }} variant="standard">
                                                <CustomInputLabel>Conform Password</CustomInputLabel>
                                                <CustomInput type={showPassword ? 'text' : 'password'}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={handleClickShowPassword}>
                                                                {showPassword ? <VisibilityOff sx={{ color: '#00adb5' }} /> : <Visibility sx={{ color: '#00adb5' }} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    name="conformPass"
                                                    value={formData.conformPass}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField fullWidth label="Age" variant="outlined" name="age" type="number" value={formData.age} onChange={handleChange} required />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField fullWidth label="Gender" variant="outlined" name="gender" select value={formData.gender} onChange={handleChange} required>
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </CustomTextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField fullWidth label="Bio" variant="outlined" name="bio" multiline rows={2} value={formData.bio} onChange={handleChange} required />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField fullWidth type="file" variant="outlined" name="image" onChange={handleChange} />
                                        </Grid>
                                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                                            <Button type="submit" variant="contained" sx={{ backgroundColor: '#00adb5', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '1rem', ':hover': { backgroundColor: '#007f8b' } }}>
                                                Create Account
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>

                                {message && <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>{message}</Alert>}

                                <Typography variant="subtitle2" sx={{ color: '#fff', mt: 3, textAlign: 'center' }}>
                                    Already have an account?{' '}
                                    <Link to="/login" style={{ color: '#00adb5', textDecoration: 'none', fontWeight: 'bold' }}>
                                        Log in here!
                                    </Link>
                                </Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
};
