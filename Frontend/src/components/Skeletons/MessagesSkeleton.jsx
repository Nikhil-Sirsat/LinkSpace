
import { Box, Modal, IconButton, Skeleton, Badge, List, ListItem } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function MessagesSkeleton() {
    return (
        <Modal
            open={true}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e6eef0',
            }}
        >
            <Box
                sx={{
                    width: { xs: '100vw', md: '75vw' },
                    height: '100vh',
                    overflow: 'hidden',
                    boxShadow: { md: '0 4px 12px rgba(0,0,0,0.1)' },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                }}
            >
                {/* Close Button Skeleton */}
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        display: { xs: 'none', md: 'flex' },
                    }}
                >
                    <ClearRoundedIcon />
                </IconButton>

                <Box
                    width={{ xs: '100%', md: '35%' }}
                    sx={{
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRight: '1px solid #ddd',
                        overflowY: { xs: 'hidden', md: 'auto' },
                        overflowX: { xs: 'auto', md: 'hidden' },
                        borderTop: '1px solid #ddd',
                        height: { xs: '17%', md: '100%' },
                    }}
                >
                    {/* Back Button Skeleton */}
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 10,
                            zIndex: '1000',
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <NavigateBeforeIcon sx={{ fontSize: 27, color: 'black' }} />
                    </IconButton>

                    {/* User List Skeleton */}
                    <List
                        sx={{
                            mt: { xs: 4, md: 0 },
                            display: 'flex',
                            flexDirection: { xs: 'row', md: 'column' },
                            alignItems: 'center',
                            width: '100%',
                            height: { xs: '70%', md: '100%' },
                            p: 2,
                        }}
                    >
                        {[...Array(5)].map((_, idx) => (
                            <ListItem
                                key={idx}
                                sx={{
                                    padding: { xs: '12px', md: '12px 16px' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: { xs: 'center', md: 'flex-start' },
                                    flexDirection: { xs: 'column', md: 'row' },
                                    borderRadius: 4,
                                    mt: 0.5,
                                }}
                            >
                                {/* Avatar Skeleton */}
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    badgeContent={
                                        <Skeleton variant="circular" width={15} height={15} />
                                    }
                                >
                                    <Skeleton
                                        variant="circular"
                                        width={45}
                                        height={45}
                                        sx={{ marginRight: { md: '10px' }, border: '2px solid white' }}
                                    />
                                </Badge>

                                {/* Username and Name Skeletons */}
                                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column' }}>
                                    <Skeleton variant="text" width="50px" />
                                </Box>

                                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', marginLeft: 1 }}>
                                    <Skeleton variant="text" width="100px" />
                                    <Skeleton variant="text" width="80px" />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box width={{ xs: '100%', md: '65%' }} height={{ xs: '83%', md: '100%' }} sx={{ overflowY: 'auto' }}>
                    {/* Skeleton for child components */}
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                </Box>
            </Box>
        </Modal>
    );
}
