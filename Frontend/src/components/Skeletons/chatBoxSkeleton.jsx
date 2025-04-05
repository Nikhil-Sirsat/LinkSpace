
import {
    Box,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    Skeleton
} from '@mui/material';

export default function ChatBoxSkeleton() {
    return (
        <>
            <Box width="100%" height="100%" display="flex" flexDirection="column" sx={{
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundColor: 'black',
            }}>
                {/* Header Skeleton */}
                <AppBar position="static" color="transparent" elevation={1} sx={{ borderBottom: '1px solid #ddd', borderTop: '1px solid #ddd', backgroundColor: '#ffffffbf' }}>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: '10px' }} />
                            <Skeleton variant="text" width={100} height={30} />
                        </div>
                        <Skeleton variant="circular" width={40} height={40} />
                    </Toolbar>
                </AppBar>

                {/* Message List Skeleton */}
                <Box
                    sx={{
                        padding: '16px',
                        flexGrow: 1,
                        overflowY: 'auto',
                    }}
                >
                    {[...Array(5)].map((_, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                justifyContent: idx % 2 === 0 ? 'flex-end' : 'flex-start',
                                marginBottom: '10px',
                                alignItems: 'center',
                            }}
                        >
                            {idx % 2 !== 0 && (
                                <>
                                    <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: '10px' }} />
                                </>
                            )}

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: idx % 2 === 0 ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width={200}
                                    height={40}
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: idx % 2 === 0 ? '#007bff' : '#e0e0e0',
                                        marginBottom: '10px',
                                    }}
                                />

                                <Skeleton variant="text" width={100} height={15} />
                            </Box>

                            {idx % 2 === 0 && (
                                <Skeleton variant="circular" width={40} height={40} sx={{ marginLeft: '10px' }} />
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Input and Send Button Skeleton */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                    }}
                >
                    <Skeleton variant="rectangular" width="80%" height={40} sx={{ marginRight: '16px', borderRadius: 4 }} />
                    <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 4 }} />
                </Box>
            </Box>

            {/* Menu Skeleton */}
            <Menu
                anchorEl={null}
                open={false}
            >
                <MenuItem>
                    <Skeleton variant="text" width={100} />
                </MenuItem>
            </Menu>
        </>
    );
}
