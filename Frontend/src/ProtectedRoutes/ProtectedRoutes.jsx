import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);  // No need for setUser here

    // If user is not authenticated, redirect to Login
    if (!user) {
        return <Navigate to="/Login" />;
    }

    // Render the protected children if user is authenticated
    return children;
};
