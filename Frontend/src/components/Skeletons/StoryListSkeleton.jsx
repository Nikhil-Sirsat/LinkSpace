
import { Box, Skeleton } from '@mui/material';

export default function StoryListSkeleton() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap', // To wrap skeleton items if they overflow
                gap: { xs: 2, md: 3 }, // Adjust gap between items based on screen size
            }}
        >
            {[...Array(3)].map((_, idx) => (
                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100px' }}>
                    {/* Circle Skeleton for Story Image */}
                    <Box sx={{ width: '90%', m: '0 auto', display: 'flex' }}>
                        <Box
                            sx={{
                                borderRadius: '50%',
                                width: { xs: '55px', md: '75px' },
                                height: { xs: '55px', md: '75px' },
                                background: '#d5d5d5',
                                margin: '0 auto',
                            }}
                        >
                        </Box>
                    </Box>

                    {/* Username Skeleton */}
                    <Skeleton
                        variant="text"
                        width="70px"
                        sx={{
                            mt: 1,
                            fontSize: '0.9rem',
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
}
