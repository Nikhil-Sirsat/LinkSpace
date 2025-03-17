
import { useState } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, Typography, IconButton, SwipeableDrawer, Avatar, CssBaseline } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';

const drawerBleeding = 0;

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : grey[100],
}));

const StyledBox = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? grey[800] : '#fff',
}));

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'dark' ? grey[900] : grey[300],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

export default function StoryViewers({ viewers }) {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <Root>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: '60%',
                        width: '27%',
                        overflow: 'visible',
                        margin: 'auto',

                        // Add media query for mobile devices
                        '@media (max-width: 600px)': {
                            width: '100%',
                        },
                    },
                }}
            />

            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'black' }}>
                <IconButton onClick={toggleDrawer(true)}>
                    <VisibilityOutlinedIcon sx={{ color: 'white' }} />
                </IconButton>
                <Typography sx={{ color: 'white' }} variant="body2" color="textSecondary">
                    {viewers.length}
                </Typography>
            </div>

            <SwipeableDrawer
                component={Box}
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{ zIndex: 1400, }}
            >
                <StyledBox
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                        zIndex: 1400,
                    }}
                >
                    <Puller />
                    <Typography sx={{ p: 2, color: 'text.secondary' }}>
                        {viewers.length} seen
                    </Typography>
                </StyledBox>
                <StyledBox sx={{ px: 2, pb: 2, pt: 8, height: '100%', width: '100%', overflow: 'auto' }}>
                    {viewers.length > 0 ? (
                        viewers.map((viewer) => (
                            <Box key={viewer._id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                <Avatar component={Link} to={`/user/${viewer.username}`} src={viewer.image.url} alt={viewer.username} />
                                <Box sx={{ ml: 2, flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <span> <strong>{viewer.username}</strong></span>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {viewer.name}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            no seen
                        </Typography>
                    )}
                </StyledBox>
            </SwipeableDrawer>
        </Root>
    );
}
