
import { Box, Container, Typography, Stack, IconButton } from '@mui/material';
import { LinkedIn, GitHub, X } from "@mui/icons-material";

export default function Footer() {

    return (
        <Box
            sx={{
                py: 3,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Stack direction="row" spacing={2} justifyContent="center">
                    <IconButton component="a" href="https://www.linkedin.com/in/nikhil-sirsat-b49bb128a/" target="_blank" sx={{color : '#0073e6'}}>
                        <LinkedIn fontSize="large" />
                    </IconButton>
                    <IconButton component="a" href="https://github.com/theAppleceo" target="_blank" >
                        <GitHub fontSize="large" />
                    </IconButton>
                    <IconButton component="a" href="https://x.com/NikhilS27949297" target="_blank" >
                        <X fontSize="large" />
                    </IconButton>
                </Stack>
                <Box
                    mt={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                >
                    <Typography variant="body2" color="textSecondary">
                        © {new Date().getFullYear()} LinkSpace.All Rights Reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};
