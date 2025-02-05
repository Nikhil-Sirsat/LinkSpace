import { Typography, Box, Avatar } from "@mui/material"

export default function MessageBubble({ sender, user, content, owner, mediaUrl, isStory }) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: '40%',
                backgroundColor: sender === user._id ? '#0073e6' : '#e0e0e0',
                color: sender === user._id ? '#fff' : '#000',
                maxWidth: '60vw',
                whiteSpace: 'normal',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {owner && (
                <Box sx={{ display: 'flex', mb: 1, width: '100%', alignItems: 'center' }}>
                    <Avatar src={owner.image.url} alt={owner.username} sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{owner.username}</strong>
                    </Typography>
                </Box>
            )}
            {mediaUrl && <img src={mediaUrl.url} alt="Media" style={{ height: 'auto', maxWidth: '200px', borderRadius: '7px' }} />}
            {isStory && <Typography variant="body2" sx={{ mt: 1 }}><i>story reply:</i> {content}</Typography>}
            {!isStory && content}
        </Box>
    )
};