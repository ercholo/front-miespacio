import { Box, Button, CircularProgress, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import { useCallback, useContext } from "react";
import { AbortContext } from "../context/AbortContext";

export const BoxCargando = ({ titulo, children }) => {

    const { abortController, createAbortController } = useContext(AbortContext);

    const onAbort = useCallback(() => {
        abortController.abort();
        createAbortController();
        // clearAbortController();
    }, [abortController, createAbortController]);


    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <CircularProgress size={40} />
                <Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">{titulo || children}</Typography>
                <Button
                    onClick={onAbort}>
                    Cancelar
                </Button>
            </Box>
        </>
    );

}

BoxCargando.propTypes = {
    titulo: PropTypes.string,
    children: PropTypes.node,
}