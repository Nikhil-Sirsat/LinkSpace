
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
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';

// Custom styles for rounded input fields and background color
const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        '& fieldset': {
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: '#b0bec5',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#42a5f5',
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

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData.username, formData.password);
        if (success) {
            navigate('/');
        } else {
            setMessage('Invalid credentials');
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '2rem' }}>
            <Card
                style={{
                    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '2rem',
                }}
            >
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Log in
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Need a LinkSpace account? <Link to="/SignUp" style={{ textDecoration: 'none', color: '#0073e6' }}>Create an account</Link>
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomTextField
                                    fullWidth
                                    label="Username"
                                    variant="outlined"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    style={{
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                    }}
                                >
                                    Log in
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    {message && (
                        <Alert severity="error" style={{ marginTop: '1.5rem', borderRadius: '8px' }}>
                            {message}
                        </Alert>
                    )}
                    <Grid container style={{ marginTop: '1.5rem' }}>
                        <Grid item>
                            <Typography variant="body2" align="center" color="textSecondary">
                                <Link to="#" style={{ textDecoration: 'none', color: '#0073e6' }}>Forgot username?</Link> | <Link to="#" style={{ textDecoration: 'none', color: '#0073e6' }}>Forgot password?</Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};
