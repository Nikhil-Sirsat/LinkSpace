
import { Box, Skeleton, Typography } from '@mui/material';

export default function ProfileSkeleton() {
    return (
        <Box sx={{ maxWidth: 900, margin: '0 auto', padding: 2 }}>
            {/* Avatar and Header Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 4,
                }}
            >
                {/* Avatar Skeleton */}
                <Box
                    sx={{
                        position: 'relative',
                        display: 'inline-block',
                        borderRadius: '50%',
                        width: { xs: 90, sm: 110, md: 150 },
                        height: { xs: 90, sm: 110, md: 150 },
                        padding: '5px',
                    }}
                >
                    <Skeleton variant="circular" width="100%" height="100%" />
                </Box>

                {/* User Info Skeleton */}
                <Box sx={{ flexGrow: 1, ml: 5 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                            mb: 1,
                        }}
                    >
                        <Skeleton width="60%" />
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Skeleton width="15%" height={30} sx={{ mr: 4 }} />
                        <Skeleton width="15%" height={30} sx={{ mr: 4 }} />
                        <Skeleton width="15%" height={30} />
                    </Box>

                    {/* Buttons Skeleton */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Skeleton variant="rectangular" width={90} height={40} />
                        <Skeleton variant="rectangular" width={90} height={40} />
                    </Box>
                </Box>
            </Box>

            {/* Bio Section Skeleton */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' } }}>
                    <Skeleton width="30%" />
                </Typography>

                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
                >
                    <Skeleton width="80%" />
                    <Skeleton width="70%" />
                </Typography>
            </Box>

            {/* Posts Tab Skeleton */}
            {/* <Skeleton variant="rectangular" width="100%" height={400} /> */}
        </Box>
    );
}
