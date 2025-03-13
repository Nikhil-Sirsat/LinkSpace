
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import { useSnackbar } from '../../context/SnackBarContext';

export default function DeletePostBTN({ postId, onDeleteSuccess }) {
    const [open, setOpen] = useState(false);
    const showSnackbar = useSnackbar();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axiosInstance.delete(`/api/post/${postId}`);

            if (response.status === 200) {
                console.log('post deleted successfully');
                if (onDeleteSuccess) onDeleteSuccess();
                showSnackbar('post deleted Successfully');
            } else {
                console.log("Failed to delete post");
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            showSnackbar('Error Deleting post');
        } finally {
            handleClose();
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="error"
                onClick={handleClickOpen}
                sx={{
                    marginTop: 2,
                    fontSize: { xs: '0.5rem', sm: '0.7rem', md: '0.7rem' },
                    padding: { xs: '5px 10px', sm: '8px 16px', md: '10px 20px' }
                }}
            >
                Delete Post
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Post"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

