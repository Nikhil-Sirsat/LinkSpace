
import { Box, Skeleton, ImageList, ImageListItem } from '@mui/material';

export default function PostGridSkeleton() {
    return (
        <Box sx={{ width: { xs: '94vw', md: '60vw' }, m: 'auto' }}>
            <ImageList variant="masonry" cols={3} gap={5}>
                {/* Simulating 9 posts for the skeleton grid */}
                {[...Array(9)].map((_, index) => (
                    <ImageListItem key={index}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={200}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}
