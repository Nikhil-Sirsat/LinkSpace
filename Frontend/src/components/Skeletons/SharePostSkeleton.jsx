
import { Box, Skeleton, Checkbox } from '@mui/material';

export default function SharePostSkeleton() {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-evenly', p: 1 }}>
            {[...Array(6)].map((_, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                    {/* Skeleton Avatar with Circular Checkbox */}
                    <Box sx={{ position: 'relative' }}>
                        <Skeleton variant="circular" width={80} height={80} />
                        <Checkbox
                            checked={false}
                            sx={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                color: 'gray',
                                '& .MuiSvgIcon-root': {
                                    width: 19,
                                    height: 19,
                                },
                            }}
                        />
                    </Box>

                    {/* Skeleton for Username */}
                    <Skeleton variant="text" width={60} height={20} sx={{ mt: 1 }} />
                </Box>
            ))}
        </Box>
    );
}
