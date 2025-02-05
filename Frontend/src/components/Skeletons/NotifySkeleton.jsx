
import React from 'react';
import { Box, Badge, Skeleton, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';

export default function NotifySkeleton() {
    const isMobile = useMediaQuery('(max-width:600px)'); // Use media query for responsiveness

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '90%', md: '60%' } }}>
            {[...Array(5)].map((_, idx) => (
                <div key={idx}>
                    <Badge
                        badgeContent={
                            <Skeleton variant="circular" width={15} height={15} />
                        }
                        color="transparent"
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: { xs: 2, md: 4 },
                            backgroundColor: '#f7f7f7',
                            p: { xs: 2, md: 3 },
                            borderRadius: '20px',
                        }}
                    >
                        {/* Avatar Skeleton */}
                        <Skeleton
                            variant="circular"
                            width={isMobile ? 40 : 70} // Pass valid number
                            height={isMobile ? 40 : 70} // Pass valid number
                        />

                        <Box sx={{ ml: { xs: 1, md: 2 }, flex: 1 }}>
                            {/* Date and Username Skeleton */}
                            <Skeleton variant="text" width={100} sx={{ fontSize: isMobile ? '11px' : '15px' }} />
                            <Skeleton variant="text" width={80} sx={{ fontSize: '0.9rem' }} />

                            {/* Message Skeleton */}
                            <Skeleton variant="text" width={150} />
                        </Box>

                        {/* Menu Button Skeleton */}
                        <IconButton>
                            <Skeleton variant="circular" width={24} height={24} />
                        </IconButton>

                        <Menu
                            anchorEl={null} // Placeholder
                            open={false}
                            onClose={() => { }}
                        >
                            <MenuItem>Delete Notification</MenuItem>
                        </Menu>
                    </Box>
                </div>
            ))}
        </Box>
    );
}
