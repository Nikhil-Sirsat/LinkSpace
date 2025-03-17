
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [allNotifications, setAllNotifications] = useState([]);
    const [msgNotify, setMsgNotify] = useState(null);
    const [reFetchMsgNotify, setReFetchMsgNotify] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:5050', {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, allNotifications, setAllNotifications, msgNotify, setMsgNotify, reFetchMsgNotify, setReFetchMsgNotify }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, SocketContext };
