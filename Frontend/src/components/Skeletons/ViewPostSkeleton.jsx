
import { Box, Skeleton } from '@mui/material';

export default function ViewPostSkeleton() {
    return (
        <Box
            sx={{
                width: { xs: '100%', md: '70%' },
                height: { xs: '100%', md: '85%' },
                bgcolor: 'background.paper',
                boxShadow: 24,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-evenly',
                borderRadius: { xs: 0, md: 2 },
            }}
        >
            {/* Image Skeleton */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexBasis: { xs: '75%', md: '50%' },
                    height: { xs: 'auto', md: '100%' },
                    overflow: 'hidden',
                    backgroundColor: 'white',
                }}
            >
                <Skeleton variant="rectangular" width="100%" height={250} sx={{ maxWidth: '100%' }} />
            </Box>

            {/* Post Data Skeleton */}
            <Box
                sx={{
                    flex: 1,
                    paddingLeft: { xs: 1, md: 2 },
                    paddingRight: { xs: 1, md: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    flexBasis: { xs: '25%', md: '50%' },
                    height: { xs: 'auto', md: '100%' },
                    minWidth: '300px',
                    width: { xs: '100%', md: 'auto' },
                }}
            >
                {/* Header Skeleton */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0, md: 3 }, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={100} height={20} sx={{ ml: 2 }} />
                    </Box>
                    <Skeleton variant="circular" width={30} height={30} sx={{ display: { xs: 'block', md: 'none' } }} />
                </Box>

                {/* Caption and Comments Skeleton */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2, display: { xs: 'none', md: 'block' } }}>
                    <Skeleton variant="text" width="90%" height={30} sx={{ mb: 2 }} />
                    {[...Array(3)].map((_, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <Skeleton variant="circular" width={30} height={30} />
                            <Box sx={{ ml: 2, flex: 1 }}>
                                <Skeleton variant="text" width="70%" height={20} />
                                <Skeleton variant="text" width="90%" height={20} />
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Comment Input Skeleton */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: { xs: 0, md: 2 } }}>
                    <Skeleton variant="rectangular" width="80%" height={40} />
                    <Skeleton variant="rectangular" width={50} height={40} sx={{ ml: 1 }} />
                </Box>

                {/* Post Actions Skeleton */}
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Skeleton variant="circular" width={30} height={30} />
                        <Skeleton variant="circular" width={30} height={30} />
                        <Skeleton variant="circular" width={30} height={30} />
                        <Skeleton variant="circular" width={30} height={30} />
                    </Box>
                </Box>

                {/* Date Skeleton */}
                <Skeleton variant="text" width="40%" height={20} sx={{ mt: 2 }} />
            </Box>
        </Box>
    );
}
