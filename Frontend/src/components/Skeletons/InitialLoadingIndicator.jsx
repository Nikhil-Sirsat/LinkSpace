import { Box, Typography } from '@mui/material';
import logo from '../../assets/compLogo.jpg'; // Add your logo path here
import './InitialLoading.css';

export default function LoadingScreen() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#121212',
            }}
        >
            <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: 140, height: 140, mb: 7, borderRadius: '50%' }} // Your logo with some margin
            />

            <Box
                sx={{
                    width: { xs: '55%', md: '45%' }, // The line will take 80% of the container's width
                    height: '4px',
                    bgcolor: 'black', // Background color of the line track
                    borderRadius: '2px',
                    overflow: 'hidden',
                    position: 'relative',
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '25%', // The width of the animated bar
                        height: '100%',
                        bgcolor: '#ae3bdf', // LinkedIn blue color or your custom one
                        borderRadius: '2px',
                        animation: 'loadingAnimation 1.5s ease-in-out infinite',
                    }}
                />
            </Box>

            {/* <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                LinkSpacex
            </Typography> */}

        </Box>
    );
}

