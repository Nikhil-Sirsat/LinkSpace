import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axiosInstance from '../AxiosInstance.jsx';

export default function ProtectedRoute({ children }) {
    const { user, setUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axiosInstance.get('/api/user/protected', { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
                console.log(error.message)
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, [setUser]);

    if (isLoading) { return (null) }

    if (!user) {
        return <Navigate to="/Login" />;
    }

    return children;
};