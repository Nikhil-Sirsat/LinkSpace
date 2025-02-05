
import { Box, Skeleton } from '@mui/material';

export default function UserListSkeleton() {
    return (
        <div>
            {[...Array(5)].map((_, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', p: 1, mt: 1 }}>
                    {/* Skeleton Avatar */}
                    <Skeleton variant="circular" width={40} height={40} />

                    {/* Skeleton for username and follower count */}
                    <Box sx={{ ml: 2, flex: 1 }}>
                        <Skeleton variant="text" width="50%" height={20} />
                        <Skeleton variant="text" width="30%" height={15} />
                    </Box>
                </Box>
            ))}
        </div>
    );
}
