import { Badge } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../AxiosInstance.jsx';
import { SocketContext } from '../../context/socketContext';

export default function MsgNotifyBtn() {
    const { user } = useContext(AuthContext);
    const { socket, msgNotify, setMsgNotify, reFetchMsgNotify } = useContext(SocketContext);

    useEffect(() => {
        if (!user) return;
        const fetchMsgNotify = async () => {
            try {
                const response = await axiosInstance.get(`/api/messages/msg-notify`);
                setMsgNotify(response.data);
            } catch (error) {
                console.error('Error fetching all msg-notify:', error);
            }
        };

        fetchMsgNotify();
    }, [user, socket, reFetchMsgNotify]);

    // socket receiveMessage Event
    useEffect(() => {

        if (!socket) return;
        socket.on('receiveMessage', (messageData) => {

            if (!messageData) return;

            if (messageData.receiver === user._id || messageData.isRead === false) {
                setMsgNotify(msgNotify + 1);
            }
        });

        return () => {
            if (socket) {
                socket.off('receiveMessage');
            }
        };
    });

    return (
        <Badge badgeContent={msgNotify} color="error">
            <MessageIcon style={{ color: '#0073e6', fontSize: '1.6rem' }} />
        </Badge>
    )
}