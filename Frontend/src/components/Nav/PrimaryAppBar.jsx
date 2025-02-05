
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotifyBTN from '../Notification/NotifyBTN';
import MsgNotifyBtn from '../Messages/MsgNotifyBtn';
import { Box, IconButton, Toolbar, Typography, Avatar, Menu, MenuItem, Tooltip, AppBar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import BackButton from '../BackButton';
import InfoIcon from '@mui/icons-material/Info';
import { ThemeContext } from "../../context/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function PrimarySearchAppBar() {
    const { user } = useContext(AuthContext);
    const [navAnchorEl, setNavAnchorEl] = useState(null);
    const { mode, toggleTheme } = useContext(ThemeContext);

    const handleNavMenuClick = (event) => {
        setNavAnchorEl(event.currentTarget);
    };

    const handleNavMenuClose = () => {
        setNavAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ top: 0, boxShadow: 'none', backgroundColor: mode === "light" ? "white" : null }}>
                <Toolbar>

                    <Tooltip title="Back" placement="bottom">
                        <BackButton />
                    </Tooltip>

                    <Tooltip title="more" placement="bottom">
                        <IconButton onClick={handleNavMenuClick} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={navAnchorEl}
                        open={Boolean(navAnchorEl)}
                        onClose={handleNavMenuClose}
                    >
                        <MenuItem component={Link} to={`/`}> <HomeIcon sx={{ color: 'gray', m: 0.5 }} /> &nbsp; Home</MenuItem>
                        <MenuItem component={Link} to={`/Explore`}> <ExploreIcon sx={{ color: 'gray', m: 0.5 }} /> &nbsp; Explore</MenuItem>
                        <MenuItem component={Link} to={`/About`}> <InfoIcon sx={{ color: 'gray', m: 0.5 }} /> &nbsp; About</MenuItem>

                    </Menu>

                    <Tooltip title="Home" placement="bottom">
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to={'/'}
                            sx={{ display: { xs: 'none', sm: 'block', md: 'block' }, textDecoration: 'none', fontWeight: 'bold', color: '#0073e6' }}
                        >
                            LinkSpace
                        </Typography>
                    </Tooltip>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>

                                <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                                    {mode === "dark" ? <Brightness7 /> : <Brightness4 sx={{color: 'black'}} />}
                                </IconButton>

                                <Tooltip title="messages" placement="bottom">
                                    <IconButton component={Link} to={`/Messages/inbox`} size="large" aria-label="show 4 new mails" color="inherit">
                                        <MsgNotifyBtn />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="notifications" placement="bottom">
                                    <IconButton
                                        component={Link}
                                        to={`/Notifications`}
                                        size="large"
                                        aria-label="show 17 new notifications"
                                        color="inherit"
                                        sx={{ mr: 1.5 }}
                                    >
                                        <NotifyBTN />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="profile" placement="bottom">
                                    <Avatar
                                        component={Link}
                                        to={`/user/${user.username}`}
                                        alt={user.username}
                                        src={user.image.url || 'https://via.placeholder.com/150'}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            // border: '5px solid black'
                                        }}
                                    />
                                </Tooltip>

                            </>
                        ) : (
                            <>
                                <Typography style={{ fontSize: '0.95rem', textDecoration: 'none' }} component={Link} to={`/SignUp`} size="large" color="black">
                                    Sign Up
                                </Typography>
                                &nbsp; &nbsp;
                                <Typography style={{ fontSize: '0.95rem', textDecoration: 'none' }} component={Link} to={`/Login`} size="large" color="black">
                                    Login
                                </Typography>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
