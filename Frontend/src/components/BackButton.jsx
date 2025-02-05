import { IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import React from "react";

const BackButton = React.forwardRef((props, ref) => {
    const navigate = useNavigate();

    function handleClick() {
        navigate(-1);
    }

    return (
        <IconButton ref={ref} onClick={handleClick} {...props}>
            <KeyboardArrowLeftIcon />
        </IconButton>
    );
});

export default BackButton;
