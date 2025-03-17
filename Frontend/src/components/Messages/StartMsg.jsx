
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';  // lodash library for debouncing
import { Modal, Box } from '@mui/material';
import Search from '../User/Search.jsx';

export default function StartMsg() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <Modal
            open={true}
            onClose={handleClose}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}
        >
            <Box tabIndex={0} sx={{ outline: 'none', width: { xs: '90%', md: '40%' }, display: 'flex', justifyContent: 'center' }}>
                <Search route={'Messages'} />
            </Box>
        </Modal>
    );
}




