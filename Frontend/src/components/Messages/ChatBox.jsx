
import { useEffect, useState, useContext, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar, AppBar, Toolbar, IconButton, Menu, MenuItem, Tooltip, Alert } from '@mui/material';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/socketContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBoxSkeleton from '../Skeletons/chatBoxSkeleton';
import MessageBubble from './MessageBubble';
import PostBubble from './PostBubble';
import MessageTimestamp from './MsgTimeStamp';
import { ThemeContext } from "../../context/ThemeContext";
import axiosInstance from '../../AxiosInstance.jsx';
import { containsLink, moderateText } from '../../TXT-Moderation/txtModeration.js';

export default function ChatBox() {
    const { mode } = useContext(ThemeContext);
    const { socket, setReFetchMsgNotify } = useContext(SocketContext);
    const { handleChildChange } = useOutletContext();
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [chatAnchorE1, setChatAnchorE1] = useState(null);
    const [msgAnchorE1, setMsgAnchorE1] = useState(null);
    const [msgToDelete, setMsgToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [sending, setSending] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Ref for auto-scrolling
    const messagesEndRef = useRef(null);

    // Function to scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // fetch the data of the selected chat
    useEffect(() => {
        if (!username) return;

        setLoading(true);

        const fetchUserData = async () => {
            try {
                const userResponse = await axiosInstance.get(`/api/user/${username}`);
                setSelectedUser(userResponse.data.profile.user);

                const response = await axiosInstance.get(`/api/messages/${userResponse.data.profile.user._id}`);
                setMessages(response.data.messages);
                setTimeout(scrollToBottom, 100);

            } catch (error) {
                console.error('Error fetching selected-Chats :', error.response ? error.response.data.message : error.message);
                setErrMsg(error.response.data.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [username]);

    // fetch messages history
    // useEffect(() => {
    //     setLoading(true);

    //     if (!selectedUser?._id) {
    //         setLoading(false);
    //         return;
    //     }

    //     const fetchMessages = async () => {
    //         try {
    //             const response = await axiosInstance.get(`/api/messages/${selectedUser._id}`);
    //             const chatHistory = response.data.messages;
    //             setMessages(chatHistory);
    //             setTimeout(scrollToBottom, 100);
    //         } catch (error) {
    //             console.error('Error fetching messages:', error.response ? error.response.data : error);
    //             setErrMsg(error.response?.data?.message || 'Something went wrong');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchMessages();
    // }, [selectedUser]);

    // socket.join event
    useEffect(() => {
        const joinUserToSocket = async () => {
            if (selectedUser) {

                socket.emit('join', { userId: user._id });

                // Only send a PUT request if necessary
                if (!messages.some(msg => msg.isRead === false && msg.sender === selectedUser._id)) {
                    markedAsRead(selectedUser._id);
                    handleChildChange();
                }
            }
        }
        joinUserToSocket();
    }, [selectedUser]);

    // socket receiveMessage Event
    useEffect(() => {

        socket.on('receiveMessage', (messageData) => {

            // check Authorization
            if (selectedUser && messageData.sender) {
                if (messageData.sender === selectedUser?._id && messageData.receiver === user._id) {

                    // update the messages array
                    setMessages((prevMessages) => [...prevMessages, messageData]);

                    // mark the message true
                    markedAsRead(selectedUser._id);
                    setTimeout(scrollToBottom, 100);

                }
            }

            // update the parent
            if (messageData.receiver === user._id) {
                handleChildChange();
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    });

    // function to send put req to update and mark isRead to true
    const markedAsRead = async (senderId) => {
        if (!senderId) return;
        try {
            const response = await axiosInstance.put('/api/messages/mark-isRead-true', { senderId });
            // console.log('Client : Marked true');
            if (response.data) {
                setReFetchMsgNotify((prevState) => !prevState);
                socket.emit('markAsRead', { senderId });
            }
        } catch (error) {
            console.log('An Erro Occured while Marking isRead to true');
            setErrMsg(error.response.data.message || 'Something went wrong');
        }
    };

    // listen for isRead 
    useEffect(() => {
        socket.on('messageRead', ({ senderId }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.sender === senderId && !msg.isRead
                        ? { ...msg, isRead: true }
                        : msg
                )
            );
        });

        return () => socket.off('messageRead');
    }, []);

    // receive message-Delete event
    useEffect(() => {
        socket.on('receiveMsgDelete', ({ msgToDelete }) => {
            setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== msgToDelete));
        });
        return () => socket.off('receiveMsgDelete');
    }, []);

    // send msg fn
    const handleSendMessage = async () => {
        setSending(true);
        if (!selectedUser?._id) return;
        if (!newMessage) return;

        // Check Violent messages
        const messageTxT = await moderateText(newMessage);
        if (messageTxT == true) {
            setErrMsg('message contains inappropriate or violent content.');
            setSending(false);
            return
        }

        // check message for links
        if (containsLink(newMessage)) {
            setErrMsg("Links are not allowed in the messages!");
            setSending(false);
            return
        }

        const messageData = {
            sender: user._id,
            receiver: selectedUser._id,
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await axiosInstance.post('/api/messages/newMessage', messageData);
            if (response.data.newMsg) {
                messageData._id = response.data.newMsg._id;
                const resMsg = response.data.newMsg;
                socket.emit('sendMessage', resMsg);
            }
        } catch (error) {
            console.error('An Error occure while saving and sending Message');
            setErrMsg(error.response?.data?.message || 'Something went wrong');
            return;
        } finally {
            setSending(false);
        }

        if (messageData.sender === user._id && messageData.receiver === selectedUser?._id) {
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
            setErrMsg('');
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleChatMenuClick = (event) => {
        setChatAnchorE1(event.currentTarget);
    };

    const handleChatMenuClose = () => {
        setChatAnchorE1(null);
    };

    const handleDeleteChatHistory = async () => {
        try {
            await axiosInstance.delete(`/api/messages/${selectedUser._id}`);
            handleChatMenuClose();
            setMessages([]);
        } catch (error) {
            console.error('Error deleting Chat history:', error);
            setErrMsg(error.response.data.message || 'Something went wrong');
        }
    };

    const handleMsgMenuClick = (event, msgId) => {
        setMsgAnchorE1(event.currentTarget);
        setMsgToDelete(msgId); // Set the ID of the message to delete
    };

    const handleMsgMenuClose = () => {
        setMsgAnchorE1(null);
        setMsgToDelete(null); // Reset the ID after closing the menu
    };

    const handleDeleteMsg = async () => {
        setDeleting(true);
        try {
            if (!msgToDelete) return;

            await axiosInstance.delete(`/api/messages/msg/${msgToDelete}`);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== msgToDelete));

            socket.emit('sendMsgDelete', { selectedUser, msgToDelete });
            setMsgToDelete(null);
            handleMsgMenuClose();
        } catch (error) {
            console.error('Error deleting message:', error);
            setErrMsg(error.response.data.message || 'Something went wrong');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (<ChatBoxSkeleton />);
    }

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" sx={{ backgroundColor: mode === 'dark' ? 'black' : 'white', border: '1px solid white' }}>
            {/* App Bar */}
            <AppBar position="static" color="transparent" elevation={1} sx={{ borderBottom: '1px solid #ddd', borderTop: '1px solid #ddd', backgroundColor: '#ffffffbf' }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center">
                        <Avatar component={Link} to={`/user/${selectedUser?.username}`} sx={{ marginRight: '10px' }} src={selectedUser?.image.url} />
                        <Typography variant="h6">{selectedUser?.username}</Typography>
                    </Box>
                    <Tooltip title="More" placement="bottom">
                        <IconButton onClick={handleChatMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <Menu anchorEl={chatAnchorE1} open={Boolean(chatAnchorE1)} onClose={handleChatMenuClose}>
                    <MenuItem onClick={handleDeleteChatHistory}>Delete Chat</MenuItem>
                </Menu>
            </AppBar>

            {/* Messages Display */}
            <Box sx={{ padding: '16px', flexGrow: 1, overflowY: 'auto' }}>

                <Typography variant="body2" align="center" sx={{ color: 'gray', backgroundColor: 'aliceblue', pt: 1, pb: 1, pl: 5, pr: 5, mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> Messages are encrypted securely by AES standards. </Typography>

                {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: message.sender === user._id ? 'flex-end' : 'flex-start', mb: 2, alignItems: 'center' }}>
                        {message.sender !== user._id && (
                            <>
                                <Tooltip title="More" placement="bottom">
                                    <IconButton onClick={(e) => handleMsgMenuClick(e, message._id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                                <Avatar sx={{ marginRight: '10px' }} src={selectedUser?.image.url} />
                            </>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === user._id ? 'flex-end' : 'flex-start' }}>
                            {message.story && (
                                <>
                                    <MessageBubble
                                        sender={message.sender}
                                        user={user}
                                        owner={message.story.owner}
                                        mediaUrl={message.story.mediaUrl}
                                        content={message.content}
                                        isStory
                                    />
                                    <div ref={messagesEndRef} /> {/* Auto-scroll target */}
                                </>
                            )}

                            {message.content && !message.story && (
                                <>
                                    <MessageBubble sender={message.sender} user={user} content={message.content} />
                                    <div ref={messagesEndRef} /> {/* Auto-scroll target */}
                                </>
                            )}

                            {message.post && (
                                <>
                                    <PostBubble
                                        sender={message.sender}
                                        user={user}
                                        owner={message.post.owner}
                                        imageUrl={message.post.imageUrl}
                                        postId={message.post._id}
                                    />
                                    <div ref={messagesEndRef} /> {/* Auto-scroll target */}
                                </>
                            )}

                            <MessageTimestamp timestamp={message.timestamp} isSender={message.sender === user._id} isRead={message.isRead} />
                        </Box>

                        {message.sender === user._id && (
                            <>
                                <Avatar sx={{ marginLeft: '10px' }} src={user?.image.url} />
                                <Tooltip title="More" placement="bottom">
                                    <IconButton onClick={(e) => handleMsgMenuClick(e, message._id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                ))}
            </Box>

            {/* Error Message */}
            {errMsg && <Alert severity="error">{errMsg}</Alert>}

            {/* Input and Send Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <TextField
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    label="Type something"
                    variant="outlined"
                    sx={{
                        mr: 2,
                        borderRadius: '20px',
                        '& .MuiOutlinedInput-root fieldset': { border: 'none' },
                    }}
                />
                <Button
                    onClick={handleSendMessage}
                    variant={newMessage ? 'contained' : 'outlined'}
                    disabled={!newMessage}
                    sx={{
                        backgroundColor: newMessage ? '#0073e6' : '#e0e0e0',
                        borderRadius: 2,
                        px: 2,
                        color: 'black',
                        '&:hover': { backgroundColor: newMessage ? '#0073e6' : '#e0e0e0' },
                    }}
                >
                    {sending ? "sending..." : "send"}
                </Button>
            </Box>

            {/* Message Options Menu */}
            <Menu anchorEl={msgAnchorE1} open={Boolean(msgAnchorE1)} onClose={handleMsgMenuClose}>
                <MenuItem onClick={handleDeleteMsg}>
                    {deleting ? "deleting..." : 'delete'}
                </MenuItem>
            </Menu>
        </Box>
    )
};