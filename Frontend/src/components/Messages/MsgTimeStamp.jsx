import { Typography } from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { format } from 'date-fns';

const formatDate = (date) => {
    try {
        return format(new Date(date), 'p');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export default function MessageTimestamp({ timestamp, isSender, isRead }) {
    return (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
            {formatDate(timestamp)}
            {isSender && (
                <DoneAllIcon sx={{ color: isRead ? 'blue' : null, ml: 1 }} />
            )}
        </Typography>
    )
};