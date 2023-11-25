import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from 'prop-types';

export const BoxCargando = ({ titulo, children }) => {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={40} />
            <Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">{titulo || children}</Typography>
        </Box>
    );

}

BoxCargando.propTypes = {
    titulo: PropTypes.string,
    children: PropTypes.node,
}