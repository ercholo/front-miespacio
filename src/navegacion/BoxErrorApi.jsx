import { Alert, AlertTitle, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAutorizacion } from "../hooks/useAutorizacion";
import PropTypes from 'prop-types';

const ItemError = ({ error, mostarDetalles }) => {
    return (
        <Box>
            {mostarDetalles && (
                <Typography variant="caption" component="span" sx={{ fontWeight: "bold" }}>
                    {error.codigo}:{" "}
                </Typography>
            )}
            <Typography variant="caption" component="span">
                {error.descripcion}
            </Typography>
            {mostarDetalles && (
                <Box sx={{ ml: 2 }}>
                    {error.stack.map((stack, i) => (
                        <Typography key={i} variant="caption" component="div">
                            ➜ {stack}
                        </Typography>
                    ))}
                </Box>
            )}
        </Box>
    );
};

const BoxErrorApi = ({ msError, titulo, snackbar, ...alertProps }) => {
    const mostarDetalles = useAutorizacion({ centroCoste: ["DTHF"] });

    if (msError?.toJSON) msError = msError.toJSON();

    if (msError && mostarDetalles) console.log(msError);

    let listaErrores =
        msError?.errores?.map?.((error, i) => {
            return <ItemError error={error} key={i} mostarDetalles={mostarDetalles} />;
        }) || [];

    let elTitulo;
    if (listaErrores.length) {
        elTitulo = <AlertTitle>{titulo}</AlertTitle>;
    } else {
        elTitulo = <Typography>{titulo}</Typography>;
    }

    if (snackbar) {
        return (
            <Box>
                {elTitulo}
                {listaErrores}
            </Box>
        );
    }

    return (
        <Alert severity="error" {...alertProps}>
            {elTitulo}
            {listaErrores}
        </Alert>
    );
};

export default BoxErrorApi;

ItemError.propTypes = {
    error: PropTypes.object,
    mostarDetalles: PropTypes.bool,
}

BoxErrorApi.propTypes = {
    msError: PropTypes.object,
    titulo: PropTypes.string,
    snackbar: PropTypes.element,
}

