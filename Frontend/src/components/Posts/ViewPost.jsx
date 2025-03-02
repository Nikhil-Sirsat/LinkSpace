
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link, Outlet } from 'react-router-dom';
import { Modal, Box, Typography, Avatar, IconButton, Button, Menu, MenuItem, Tooltip, TextField, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axiosInstance from '../../AxiosInstance.jsx';
import DeletePostBTN from './DeletePostBTN';
import { AuthContext } from '../../context/AuthContext';
import LikeButton from './LikeButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SavedPostBTN from './SavePostBTN';
import ShareIcon from '@mui/icons-material/Share';
import { SocketContext } from '../../context/socketContext';
import CommentBoxForMob from './CommentBoxForMob';
import LogoutIcon from '@mui/icons-material/Logout';
import SharePost from './SharePost.jsx';
import { useSnackbar } from '../../context/SnackBarContext.jsx';
import ViewPostSkeleton from '../Skeletons/ViewPostSkeleton.jsx';

export default function ViewPost() {
    const { user } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [postAnchorEl, setPostAnchorEl] = useState(null);
    const [commentAnchorEl, setCommentAnchorEl] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [sharePostUsers, setSharePostUsers] = useState(false);
    const [error, setError] = useState('');
    const showSnackbar = useSnackbar();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosInstance.get(`/api/post/${id}`);
                setPost(response.data.post);
                setComments(response.data.post.comments);

                const likeResponse = await axiosInstance.get(`/api/like/${id}/isLiked`);
                setIsLiked(likeResponse.data.isLiked);

                const SavedResponse = await axiosInstance.get(`/api/savedPost/${id}/isSaved`);
                setIsSaved(SavedResponse.data.isSaved);

            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleToggleShareUsers = () => {
        setSharePostUsers(!sharePostUsers);  // Toggle the visibility
    };

    // send comment Notify fn
    const handleSendNotification = async () => {
        const notificationData = {
            senderId: user._id,
            receiverId: post.owner._id,
            message: `Comment on you'r post`,
            postId: post._id,
            type: 'comment',
            timestamp: new Date().toISOString()
        };

        try {
            const response = await axiosInstance.post('/api/notify/post', notificationData);
            // console.log('res is here : ', response.data.newNotify);

            if (!response.data.newNotify || !response.data.newNotify._id) {
                throw new Error('Notification save failed or invalid response');
            }

            const responseNotify = response.data.newNotify;

            // Emit the event with the full data
            socket.emit('sendNotification', responseNotify);
        } catch (error) {
            console.error('An Error occurred while saving and sending Notification:', error);
            return;
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleAddComment = async () => {
        try {
            const response = await axiosInstance.post(`/api/comment/post/${id}`, { comment: commentText });
            if (response.data) {
                setComments([...comments, response.data.comment]);
                handleSendNotification();
                setCommentText('');
                setError('');
                showSnackbar('comment Added successfully !');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            setError(error.response?.data?.error || 'Something went wrong');
        }
    };

    const handlePostMenuClick = (event) => {
        setPostAnchorEl(event.currentTarget);
    };

    const handlePostMenuClose = () => {
        setPostAnchorEl(null);
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
            await axiosInstance.delete(`/api/comment/${id}/${selectedCommentId}`);
            setComments(comments.filter(comment => comment._id !== selectedCommentId));
            handleCommentMenuClose();
            showSnackbar('comment deleted successfully !');
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (loading) {
        return <ViewPostSkeleton />;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    const formattedCreatedAt = new Date(post.createdAt).toLocaleString();

    return (
        <>
            <Modal
                open={true}
                onClose={handleClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                {/* Main Box */}
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

                    {/* Img Box */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexBasis: { xs: '75%', md: '50%' },
                            height: { xs: 'auto', md: '100%' },
                            overflow: 'hidden',
                            backgroundColor: 'black'
                        }}
                    >
                        <img
                            src={post.imageUrl.url ? post.imageUrl.url : post.imageUrl}
                            alt={post.caption}
                            style={{
                                height: '100%',
                                width: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>

                    {/* post Data */}
                    <Box
                        sx={{
                            flex: 1,
                            paddingLeft: 2,
                            paddingRight: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            flexBasis: { xs: '25%', md: '50%' },
                            height: { xs: 'auto', md: '100%' },
                            minWidth: '300px',
                            width: { xs: '100%', md: 'auto' },
                            // overflowY: 'auto',
                        }}
                    >

                        {/* post header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0, md: 3 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Tooltip title="see profile" placement="bottom">
                                    <div>
                                        <Avatar component={Link} to={`/user/${post.owner.username}`} src={post.owner.image.url} alt={post.owner.username} />
                                    </div>
                                </Tooltip>
                                <Typography variant="h6" sx={{ ml: 2 }}>
                                    {post.owner.username}
                                </Typography>
                                {user && user._id === post.owner._id && (
                                    <IconButton onClick={handlePostMenuClick}>
                                        <Tooltip title="more" placement="bottom">
                                            <div>
                                                <ExpandMoreIcon />
                                            </div>
                                        </Tooltip>
                                    </IconButton>
                                )}

                            </Box>

                            <Tooltip title="back" placement="bottom">
                                <div>
                                    <IconButton
                                        sx={{
                                            alignSelf: 'flex-end',
                                            display: { xs: 'block', md: 'none' },
                                        }}
                                        onClick={handleClose}
                                    >
                                        <LogoutIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>

                        </Box>

                        {/* comment Box */}
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2, display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {post.caption}
                            </Typography>
                            <ul style={{ marginBottom: '15px' }}>
                                {post.taggedUsers.map((tagUser) => (
                                    <li key={tagUser._id}>
                                        <Link to={`/user/${tagUser.username}`} style={{ textDecoration: 'none' }}>
                                            <Typography variant='body2' sx={{ color: '#0073e6' }}>@{tagUser.username}</Typography>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
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
                                            <Tooltip title="more" placement="bottom">
                                                <div>
                                                    <IconButton onClick={(event) => handleCommentMenuClick(event, comment._id)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    no Comments yet
                                </Typography>
                            )}
                        </Box>
                        <Menu
                            anchorEl={postAnchorEl}
                            open={Boolean(postAnchorEl)}
                            onClose={handlePostMenuClose}
                        >
                            <MenuItem>
                                <DeletePostBTN postId={post._id} onDeleteSuccess={handleClose} />
                            </MenuItem>
                        </Menu>
                        <Menu
                            anchorEl={commentAnchorEl}
                            open={Boolean(commentAnchorEl)}
                            onClose={handleCommentMenuClose}
                        >
                            <MenuItem onClick={handleDeleteComment}>Delete Comment</MenuItem>
                        </Menu>

                        {/* post comment */}
                        {error && <Alert severity="error">{error}</Alert>}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: { xs: 0, md: 2 } }}>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label="Add a comment..."
                                variant="outlined"
                                value={commentText}
                                onChange={handleCommentChange}
                                sx={{
                                    flexGrow: 1,
                                    "& .MuiOutlinedInput-root": {
                                        padding: "6px", // Adjust the padding as needed
                                    },
                                    "& .MuiInputLabel-root": {
                                        fontSize: "0.875rem", // Adjust label font size
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        fontSize: "0.875rem", // Adjust input text font size
                                        padding: "6px", // Adjust input padding
                                    },
                                }}
                            />
                            <Button
                                onClick={handleAddComment}
                                variant={commentText ? 'contained' : 'outlined'}
                                disabled={!commentText}
                                sx={{
                                    backgroundColor: commentText ? '#007bff' : 'aliceblue',
                                    borderRadius: '20px',
                                    padding: '6px 14px',
                                    color: commentText ? 'white' : 'black',
                                    '&:hover': {
                                        backgroundColor: commentText ? '#0056b3' : 'aliceblue',
                                    },
                                    ml: 1
                                }}
                            >
                                Send
                            </Button>
                        </Box>

                        {/* post actions */}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {/* <hr style={{ margin: '0' }}></hr> */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                <LikeButton
                                    post={post}
                                    initialLikes={post.likeCount}
                                    initialLiked={isLiked}
                                />

                                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                    <Tooltip title="see comments" placement="bottom">
                                        <div>
                                            <CommentBoxForMob
                                                caption={post.caption}
                                                comments={comments}
                                                setComments={setComments}
                                                user={user}
                                                post={post}
                                            />
                                        </div>
                                    </Tooltip>
                                </Box>

                                <Tooltip title="share post" placement="top">
                                    <div>
                                        <IconButton aria-label="share-post" onClick={handleToggleShareUsers}>
                                            <ShareIcon />
                                        </IconButton>
                                    </div>
                                </Tooltip>

                                <SharePost
                                    handleToggleShareUsers={handleToggleShareUsers}
                                    id={post._id}
                                    // setSharePostUsers={setSharePostUsers}
                                    sharePostUsers={sharePostUsers}
                                />

                                <SavedPostBTN postId={post._id} isInitiallySaved={isSaved} />

                                <Typography sx={{ display: { xs: 'none', md: 'flex' } }} variant="body2" color="textSecondary">
                                    {comments.length} Comments
                                </Typography>
                            </Box>
                        </Box>

                        {/* date */}
                        <Typography variant="body2" color="textSecondary" fontSize={'12px'} sx={{ mb: { xs: 0, md: 2 }, mt: { xs: 0, md: 1 } }}>
                            Posted on: {formattedCreatedAt}
                        </Typography>
                    </Box>
                </Box>
            </Modal>
            <div>
                <Outlet />
            </div>
        </>
    );
}