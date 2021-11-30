import React from "react";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const DescriptionAlerts = (props: {
    setisAlert: any;
    message: string
}) => {

    setTimeout(() => {
        props.setisAlert(false)
    }, 3000);

    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert onClick={() => props.setisAlert(false)} severity="error">{props.message}</Alert>
        </Stack>
    );
}

export default DescriptionAlerts