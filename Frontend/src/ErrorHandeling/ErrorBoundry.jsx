import React from "react";
import { Box, Paper, Typography, Button, Divider, Collapse } from '@mui/material';
import PropTypes from 'prop-types';
import '../ErrorHandeling/ErrorBoundry.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <Paper elevation={3} sx={{ padding: 4, backgroundColor: 'rgba(61, 61, 61, 0.5)' }}>
                        <Typography variant="h4" color="error" gutterBottom>
                            Something went wrong.
                        </Typography>
                        <Typography variant="body1" color="white" paragraph>
                            An unexpected error has occurred. Please try again later.
                        </Typography>
                        <Divider sx={{ backgroundColor: 'white', my: 2 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleRetry}
                        >
                            Try again
                        </Button>
                        {this.state.error && (
                            <Collapse in={Boolean(this.state.error)} sx={{ marginTop: 4 }}>
                                <Typography variant="h6" color="white">
                                    Error Details:
                                </Typography>
                                <Typography variant="body2" color="white">
                                    <strong>Message:</strong> {this.state.error.toString()}
                                </Typography>
                                {this.state.errorInfo && (
                                    <details style={{ whiteSpace: 'pre-wrap', color: 'white', marginTop: 1 }}>
                                        {this.state.errorInfo.componentStack}
                                    </details>
                                )}
                            </Collapse>
                        )}
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
