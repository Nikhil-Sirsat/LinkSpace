
import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../AxiosInstance.jsx';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axiosInstance.get('/api/user/protected', { withCredentials: true });
                setUser(response.data.user);
                console.log("User set in useEffect:", response.data.user);
                setLoading(false);
            } catch (err) {
                setUser(null);
                console.log("Error in useEffect:", err.response ? err.response.data : err.message);
                setLoading(false);
            }
        };
        checkUser();
    }, []);
    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/api/user/Login', { username, password }, { withCredentials: true });
            setUser(response.data.user);
            console.log("User set in login:", response.data.user);
            return true;
        } catch (err) {
            console.log("Error in login:", err.response ? err.response.data : err.message);
            return false;
        }
    };
    const logout = async () => {
        try {
            await axiosInstance.get('/api/user/Logout', { withCredentials: true });
            setUser(null);
            console.log("User logged out");
        } catch (err) {
            console.log("Error in logout:", err.response ? err.response.data : err.message);
        }
    };

    if (loading) {
        return (null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };

