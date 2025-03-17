import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function LogoutButton() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            navigate('/');
        } catch (error) {
            console.log('error in log-out:', error.message);
        } finally {
            setLoading(false);
        }

    };

    return (
        <button onClick={handleLogout} className="btn btn-secondary">
            {loading ? 'Loading...' : 'Logout'}
        </button>
    );
};