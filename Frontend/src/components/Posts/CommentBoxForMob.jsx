
import { useState } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, Typography, IconButton, SwipeableDrawer, Avatar, Menu, MenuItem, Alert } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import axiosInstance from '../../AxiosInstance.jsx';

const drawerBleeding = 0;

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : grey[100],
}));

const StyledBox = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? grey[800] : '#fff',
}));

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'dark' ? grey[900] : grey[300],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

export default function CommentBoxForMob({ caption, comments, user, setComments, post }) {
    const [open, setOpen] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [commentAnchorEl, setCommentAnchorEl] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleCommentMenuClick = (event, commentId) => {
        setCommentAnchorEl(event.currentTarget);
        setSelectedCommentId(commentId);
    };

    const handleCommentMenuClose = () => {
        setCommentAnchorEl(null);
        setSelectedCommentId(null);
    };

    const handleDeleteComment = async () => {
        try {
            if (selectedCommentId) {
                await axiosInstance.delete(`/api/comment/${post._id}/${selectedCommentId}`);
                setComments(comments.filter(comment => comment._id !== selectedCommentId));
                handleCommentMenuClose();
                setErrMsg('');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            setErrMsg(error.message);
        }
    };

    return (
        <Root>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: '70%',
                        overflow: 'visible',
                    },
                }}
            />

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton aria-label="share-post" onClick={toggleDrawer(true)}>
                    <MapsUgcOutlinedIcon />
                </IconButton>
                <Typography sx={{ color: 'black' }} variant="body2" color="textSecondary">
                    {comments.length}
                </Typography>
            </div>

            <SwipeableDrawer
                component={Box}
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{ zIndex: 1400, }}
            >
                <StyledBox
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                        zIndex: 1400,
                    }}
                >
                    <Puller />
                    <Typography sx={{ p: 2, color: 'text.secondary' }}>
                        {comments.length} comments
                    </Typography>
                </StyledBox>
                <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>

                    <Box sx={{ mb: 2, mt: 6 }}>
                        {caption}
                        <ul style={{ marginLeft: '15px' }}>
                            {post.taggedUsers.map((tagUser) => (
                                <li key={tagUser._id}>
                                    <Link to={`/user/${tagUser.username}`} style={{ textDecoration: 'none' }}>
                                        <Typography variant='body2' style={{ color: '#0073e6' }}>@{tagUser.username}</Typography>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Box>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <Box key={comment._id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                <Avatar component={Link} to={`/user/${comment.author.username}`} src={comment.author.image.url} alt={comment.author.username} />
                                <Box sx={{ ml: 2, flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <span> <strong>{comment.author.username}</strong> : {new Date(comment.createdAt).toLocaleString()}</span>
                                    </Typography>
                                    <Typography variant="body2">{comment.comment}</Typography>
                                </Box>
                                {user && user._id === comment.author._id && (
                                    <IconButton onClick={(event) => handleCommentMenuClick(event, comment._id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            no Comments yet
                        </Typography>
                    )}
                    {errMsg && <Alert severity="error">{errMsg}</Alert>}
                    <Menu
                        anchorEl={commentAnchorEl}
                        open={Boolean(commentAnchorEl)}
                        onClose={handleCommentMenuClose}
                        sx={{ zIndex: 1500, }}
                    >
                        <MenuItem onClick={handleDeleteComment}>Delete Comment</MenuItem>
                    </Menu>
                    {/* </Box> */}

                </StyledBox>
            </SwipeableDrawer>
        </Root>
    );
}
