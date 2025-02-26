
import signUpPoster from '../../assets/signup Poster 2.avif';

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

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

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
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Card style={{ boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)', borderRadius: '16px' }}>
                <Grid container>
                    {/* Left Side: Image and Text */}
                    <Grid
                        item
                        xs={12}
                        md={5}
                        style={{
                            backgroundColor: '#2a363b',
                            borderTopLeftRadius: '16px',
                            borderBottomLeftRadius: '16px',
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={signUpPoster}
                            alt="Side Graphic"
                            style={{ maxWidth: '100%' }}
                        />
                    </Grid>

                    {/* Right Side: Form */}
                    <Grid item xs={12} md={7}>
                        <CardContent style={{ padding: '2rem', backgroundColor: '#2a363b', height: '100%' }}>
                            <Typography
                                variant="h5"
                                style={{
                                    textAlign: 'center',
                                    color: '#ff8c00',
                                    fontWeight: 'bold',
                                    marginBottom: 25,
                                }}
                            >
                                Create Account
                            </Typography>

                            <Avatar
                                src={selectedImage || 'https://via.placeholder.com/150'}
                                sx={{
                                    width: { xs: 90, sm: 100, md: 160 }, // Avatar size
                                    height: { xs: 90, sm: 100, md: 160 },
                                    borderRadius: '50%', // Ensures the Avatar remains circular
                                    margin: "auto",
                                    mb: 5,
                                }}
                            />

                            <form onSubmit={handleSubmit} encType='multipart/form-data'>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
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
                                        <CustomTextField
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
                                        <CustomTextField
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
                                            <CustomInputLabel htmlFor="standard-adornment-password" sx={{ color: 'white' }}>Password</CustomInputLabel>
                                            <CustomInput
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
                                        <FormControl sx={{ width: '25ch' }} variant="standard">
                                            <CustomInputLabel htmlFor="standard-adornment-password" sx={{ color: 'white' }}>Conform Password</CustomInputLabel>
                                            <CustomInput
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
                                                label="Conform Password"
                                                name="conformPass"
                                                value={formData.conformPass}
                                                onChange={handleChange}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
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
                                        <CustomTextField
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
                                        </CustomTextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextField
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
                                        <CustomTextField
                                            fullWidth
                                            type="file"
                                            variant="standard"
                                            name="image"
                                            id='image'
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12}> */}
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
                                        Create Account
                                    </Button>
                                    {/* </Grid> */}
                                </Grid>
                            </form>
                            {message && (
                                <Alert severity="error" style={{ marginTop: '1rem', borderRadius: '8px' }}>
                                    {message}
                                </Alert>
                            )}
                            <Typography
                                variant="subtitle2"
                                style={{ color: '#fff', marginTop: '2rem', textAlign: 'center' }}
                            >
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#ff8c00', textDecoration: 'none' }}>
                                    Login in here!
                                </Link>
                            </Typography>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
};





