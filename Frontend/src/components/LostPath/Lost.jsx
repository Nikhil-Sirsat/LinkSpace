
import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Link } from 'react-router-dom';

export default function LostPath() {
    return (
        <Container
            maxWidth="sm"
            sx={{
                textAlign: 'center',
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <WarningAmberIcon color="error" sx={{ fontSize: 80, mb: 2, animation: 'bounce 1.5s infinite' }} />
            <Typography variant="h3" component="h3" fontWeight="bold" gutterBottom>
                404 - Page Not Found!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                You’re lost. Don’t worry, it’s not the first time someone’s gone off track... GPS rerouting!
            </Typography>

            <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/"
                sx={{ mb: 2, textTransform: 'none' }}
            >
                Back to Home
            </Button>

            <Typography variant="caption" display="block" sx={{ mt: 4, color: 'textSecondary' }}>
                The page you’re looking for is on vacation. Please try again later!
            </Typography>
        </Container>
    );
}
