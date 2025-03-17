import { Box, Avatar, Typography, Tooltip } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../../AxiosInstance.jsx';
import IsFollowBTN from "../User/IsFollowBTN";
import UserListSkeleton from '../Skeletons/UserListSkeleton';

export default function HomeSuggest() {
    const { user } = useContext(AuthContext);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axiosInstance.get('/api/user/suggestions');
                setSuggestions(response.data.suggestions);
                setLoading(false);
            } catch (error) {
                console.log('error in getting suggestion : ', error.message);
                setLoading(false);
            }
        }
        fetchSuggestions();
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ mt: 3, width: '100%' }}>
                <UserListSkeleton />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', }}>
                    <Avatar component={Link} to={`/user/${user.username}`} src={user.image.url} alt={user.username} />
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <span> <strong>{user.username}</strong></span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'gray' }}>{user.name} . {user.followersCount} followers</Typography>
                    </Box>
                </Box>
                {/* <Box>
                    <Typography variant="body2">switch</Typography>
                </Box> */}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, mt: 2, mb: 2 }}>
                <Typography variant="subtitle2"><strong>Suggested for you</strong></Typography>
                {/* <Typography variant="body2">see all</Typography> */}
            </Box>

            <Box sx={{ mt: 1, }}>

                {suggestions.map((suggestion) => (
                    <Box key={suggestion._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', }}>

                            <Tooltip title="view profile" placement="bottom">
                                <Avatar component={Link} to={`/user/${suggestion.username}`} src={suggestion.image.url} alt={suggestion.username} />
                            </Tooltip>

                            <Box sx={{ ml: 2 }}>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span> <strong>{suggestion.username}</strong></span>
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'gray' }}>{suggestion.name} . {suggestion.followersCount} followers</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <IsFollowBTN username={suggestion.username} />
                        </Box>
                    </Box>
                ))}

            </Box>
        </Box>
    )
}