import { useState } from 'react';
import axiosInstance from '../../AxiosInstance.jsx';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Tooltip, IconButton } from '@mui/material';
import { useSnackbar } from '../../context/SnackBarContext';

export default function SavedPostBTN({ postId, isInitiallySaved }) {
    const [saved, setSaved] = useState(isInitiallySaved);
    const [error, setError] = useState(null);
    const showSnackbar = useSnackbar();

    const handleSave = async () => {
        try {
            if (saved) {
                await axiosInstance.delete(`/api/savedPost/${postId}/unSave`);
                setSaved(false);
                showSnackbar('Post Unsaved successfully !');
            } else {
                await axiosInstance.post(`/api/savedPost/${postId}/save`);
                setSaved(true);
                showSnackbar('Post saved successfully !');
            }
            setError(null);  // Clear error if successful
        } catch (error) {
            console.error('Error updating Post Saved status', error);
            setError('Failed to update saved status.');
        }
    };

    return (
        <div>
            <Tooltip title={saved ? 'Unsave Post' : 'Save Post'} placement="top">
                <IconButton onClick={handleSave} aria-label="save-post">
                    <BookmarkIcon style={{ color: saved ? 'black' : '#757575', fontSize: '25px' }} />
                </IconButton>
            </Tooltip>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
