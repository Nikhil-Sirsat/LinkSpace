import { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import { Link, Outlet } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

export default function Inbox() {
    const { mode } = useContext(ThemeContext);
    return (
        <Box sx={{ height: '100%', width: '100%', backgroundColor: mode === 'dark' ? 'black' : 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ border: '2px solid gray', borderRadius: '50%', p: 4 }}>
                <MessageIcon sx={{ fontSize: 70, color: 'gray' }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontSize: 18, mt: 1 }}>Your messages</Typography>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'gray' }}>Send a message to start a chat.</Typography>
            <Button component={Link} to={`/Messages/inbox/search`} variant='contained' sx={{ textTransform: 'none', fontSize: 12, borderRadius: 10, mt: 2 }} >Send message</Button>
            <Outlet />
        </Box>
    )
}