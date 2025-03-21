import { Box, Typography } from '@mui/material';
import logo from '../../assets/logo-3-2.jpg'; // Add your logo path here
import './initialLoading.css';

export default function LoadingScreen() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#f3f4f6',
            }}
        >
            <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: 100, height: 100, mb: 3, borderRadius: '50%' }} // Your logo with some margin
            />

            <Box
                sx={{
                    width: '50%', // The line will take 80% of the container's width
                    height: '4px',
                    bgcolor: '#d0d0d0', // Background color of the line track
                    borderRadius: '2px',
                    overflow: 'hidden',
                    position: 'relative',
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '20%', // The width of the animated bar
                        height: '100%',
                        bgcolor: '#0077b5', // LinkedIn blue color or your custom one
                        borderRadius: '2px',
                        animation: 'loadingAnimation 1.5s ease-in-out infinite',
                    }}
                />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                Nikhil Sirsat Production
            </Typography>
        </Box>
    );
}

