
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
    Container,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    IconButton,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    FormControl,
    Typography,
    Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';

// Custom styles for a dark modern theme
const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        '& fieldset': {
            borderColor: '#444',
        },
        '&:hover fieldset': {
            borderColor: '#00adb5',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#00adb5',
        },
        '& input': {
            color: '#fff',
        },
        '& label': {
            color: '#b0bec5',
        },
    },
});

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData.username, formData.password);
        if (success) navigate('/');
        else setMessage('Invalid credentials');
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Card sx={{ borderRadius: '16px', backgroundColor: '#1e1e1e', boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.3)', padding: '2rem' }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ color: '#00adb5', textAlign: 'center', fontWeight: 'bold' }}>Log in</Typography>
                        <Typography variant="body2" sx={{ color: '#b0bec5', textAlign: 'center', mt: 1 }}>
                            Need a LinkSpace account?{' '}
                            <Link to="/SignUp" style={{ textDecoration: 'none', color: '#00adb5' }}>Create an account</Link>
                        </Typography>
                        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CustomTextField fullWidth label="Username" variant="outlined" name="username" value={formData.username} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel sx={{ color: '#b0bec5' }}>Password</InputLabel>
                                        <OutlinedInput
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                                        {showPassword ? <VisibilityOff sx={{ color: '#00adb5' }} /> : <Visibility sx={{ color: '#00adb5' }} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            sx={{ color: '#fff' }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#00adb5', color: '#fff', fontSize: '1rem', textTransform: 'none', '&:hover': { backgroundColor: '#008c9e' } }}>Log in</Button>
                                </Grid>
                            </Grid>
                        </form>
                        {message && (
                            <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>{message}</Alert>
                        )}
                        <Typography variant="body2" align="center" sx={{ mt: 2, color: '#b0bec5' }}>
                            <Link to="#" style={{ textDecoration: 'none', color: '#00adb5' }}>Forgot username?</Link> | <Link to="#" style={{ textDecoration: 'none', color: '#00adb5' }}>Forgot password?</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
