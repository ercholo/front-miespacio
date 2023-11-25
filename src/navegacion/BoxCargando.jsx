import {  Box, CircularProgress, Typography } from "@mui/material";


const BoxCargando = ({ titulo, children }) => {

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
    <CircularProgress size={40} />
    <Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">{titulo || children}</Typography>
</Box>

}

export default BoxCargando;