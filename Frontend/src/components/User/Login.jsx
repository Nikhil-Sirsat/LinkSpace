
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
    Snackbar,
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
            borderColor: '#b0bec5',
        },
        '&:hover fieldset': {
            borderColor: '#b0bec5',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#b0bec5',
        },
        '& input': {
            color: '#fff',
        },
        '& label': {
            color: '#b0bec5',
        },
    },
    "& .MuiInputLabel-root": {
        color: '#b0bec5'
    },
});

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCookieAlert, setShowCookieAlert] = useState(true);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const trimmedUsername = formData.username.trim();
        const trimmedPassword = formData.password.trim();

        const success = await login(trimmedUsername, trimmedPassword);
        if (success) {
            navigate('/');
        } else {
            setMessage("Invalid Credentials");
        }
        setLoading(false);
    };

    const handleCloseAlert = () => setShowCookieAlert(false);

    return (
        <Box sx={{ height: '100vh', width: '100vw', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="xs">

                {/* cookies Alert */}
                {showCookieAlert && (
                    <Snackbar
                        open={showCookieAlert}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert
                            action={
                                <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseAlert}>
                                    ✕
                                </IconButton>
                            }
                            severity="warning"
                            sx={{ borderRadius: '8px' }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Important Notice: Enable Third-Party Cookies
                            </Typography>
                            <Typography variant="body2">
                                To ensure a seamless login experience and full functionality of the application, please allow third-party cookies in your browser. Blocking third-party cookies may prevent login or other features from working properly.
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                                For Google Chrome:
                            </Typography>
                            <Typography variant="body2">
                                1. Open <b>Settings</b> → <b>Privacy and Security</b> → <b>Cookies and other site data</b>.<br />
                                2. Select <b>Allow all cookies</b> or <b>Block third-party cookies in incognito</b> for optimal performance.
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                                For Safari (Apple Devices):
                            </Typography>
                            <Typography variant="body2">
                                1. Open <b>Settings</b> → <b>Safari</b> → <b>Privacy & Security</b>.<br />
                                2. Disable <b>Prevent Cross-Site Tracking</b> and ensure <b>Block All Cookies</b> is turned off.
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: '#ff9800' }}>
                                Recommendation: After updating settings, restart your browser to apply the changes.
                            </Typography>
                        </Alert>
                    </Snackbar>

                )}

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
                                    <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#00adb5', color: '#fff', fontSize: '1rem', textTransform: 'none', '&:hover': { backgroundColor: '#008c9e' } }}>
                                        {loading ? 'Loading...' : 'Log in'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                        {message && (
                            <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>{message}</Alert>
                        )}

                        {/* optional */}
                        {/* <Typography variant="body2" align="center" sx={{ mt: 2, color: '#b0bec5' }}>
                            <Link to="#" style={{ textDecoration: 'none', color: '#00adb5' }}>Forgot username?</Link> | <Link to="#" style={{ textDecoration: 'none', color: '#00adb5' }}>Forgot password?</Link>
                        </Typography> */}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
