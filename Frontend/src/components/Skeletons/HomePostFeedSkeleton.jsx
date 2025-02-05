
import { Card, CardHeader, CardMedia, CardContent, CardActions, Skeleton, IconButton, Typography, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function HomePostFeedSkeleton() {
    return (
        <Box sx={{ padding: '10px', width: { xs: '99%', md: '50%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Simulating multiple skeleton cards */}
            {[1, 2, 3].map((item) => (
                <Card key={item} sx={{ width: { xs: '95vw', md: 450 }, mb: 5, boxShadow: 'none', borderBottom: '1px solid gray', borderRadius: 'none' }}>
                    {/* Header Skeleton */}
                    <CardHeader
                        sx={{ pl: 0.5, pr: 0 }}
                        avatar={
                            <Skeleton variant="circular" width={40} height={40} />
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={<Skeleton width="50%" />}
                        subheader={<Skeleton width="30%" />}
                    />
                    {/* Media Skeleton */}
                    <CardMedia>
                        <Skeleton variant="rectangular" width="100%" height={200} />
                    </CardMedia>

                    {/* Actions Skeleton */}
                    <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex' }}>
                            <IconButton aria-label="like">
                                <FavoriteIcon />
                            </IconButton>
                            <IconButton aria-label="share">
                                <ShareIcon />
                            </IconButton>
                            <IconButton aria-label="comment">
                                <MapsUgcOutlinedIcon />
                            </IconButton>
                        </Box>
                        <IconButton aria-label="save">
                            <BookmarkIcon />
                        </IconButton>
                    </CardActions>

                    {/* Content Skeleton */}
                    <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <Skeleton width="80%" />
                            <Skeleton width="60%" />
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
