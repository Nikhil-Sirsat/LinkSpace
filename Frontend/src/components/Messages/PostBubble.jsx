import { Box, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function PostBubble({ sender, user, owner, imageUrl, postId }) {
    return (
        <Typography
            component={Link}
            to={`/post/${postId}`}
            sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: sender === user._id ? '#0073e6' : '#e0e0e0',
                color: sender === user._id ? '#fff' : '#000',
                maxWidth: '60vw',
                whiteSpace: 'normal',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
                    <Avatar src={owner.image.url} alt={owner.username} sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">
                        <strong>{owner.username}</strong>
                    </Typography>
                </Box>
                {imageUrl && <img src={imageUrl.url ? imageUrl.url : imageUrl} alt="Post Media" style={{ height: 'auto', maxWidth: '200px', borderRadius: '7px' }} />}
            </Box>
        </Typography>
    )
};