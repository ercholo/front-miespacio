import { useEffect} from "react";
import PropTypes from 'prop-types';

import { Box, Button, CircularProgress, Paper, Typography, useMediaQuery } from "@mui/material";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { redux_noticias_consultaId } from "../../redux/api/noticias/noticiasSlice";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import "./quill.css";
import { useTheme } from "@emotion/react";
import { BoxErrorApi } from "../../navegacion/BoxErrorApi";

const DetalleNoticia = ({ noticia }) => {

    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

    let navigate = useNavigate();
    let fechaPub = new Date(noticia.fechaPublicacion);
    fechaPub = format(fechaPub, "cccc, dd' de 'LLLL' de 'yyyy' a las 'HH:mm", {
        locale: es,
    });

    return (
        <Paper square elevation={smallScreen ? 0 : 2} sx={{ p: { sx: 0, md: 4 }, mb: 3 }}>
            <Box>
                <Typography component="div" variant="body2" sx={{ float: { sm: "right" } }}>
                    El {fechaPub}
                </Typography>
                <Typography component="div" variant="body2" sx={{ mb: 0 }}>
                    {noticia.categoria}
                </Typography>
                <Typography variant="h4" sx={{ my: 2, borderBottom: "1px solid lightgrey" }}>
                    {noticia.titulo}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Box sx={{ width: "100%", py: 0 }}>
                    <div className="quill" dangerouslySetInnerHTML={{ __html: noticia.contenido }} />
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <Button size="small" color="secondary" endIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                    Volver
                </Button>
            </Box>
        </Paper>
    );
};

export const PantallaNoticia = () => {

    let { idNoticia } = useParams();

    const dispatch = useDispatch();
    const estadoConsultaNoticia = useSelector((state) => state.noticias.porId.estado);
    const noticia = useSelector((state) => state.noticias.porId.resultado);
    const error = useSelector((state) => state.noticias.porId.error);

    useEffect(() => {
        dispatch(redux_noticias_consultaId({ idNoticia, formato: "contenido" }));
    }, [dispatch, idNoticia]);

    let contenido = null;

    if (estadoConsultaNoticia === "cargando") {
        contenido = (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 4,
                }}
            >
                <CircularProgress size={40} />
                <Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">
                    Consultando datos de la noticia ...
                </Typography>
            </Box>
        );
    } else if (error) {
        contenido = <BoxErrorApi msError={error} titulo="Ocurrió un error al realizar la consulta" />;
    } else if (noticia) {
        contenido = <DetalleNoticia noticia={noticia} />;
    } else {
        contenido = (
            <Box sx={{ m: "auto", textAlign: "center" }}>
                <div>
                    <SentimentNeutralIcon sx={{ width: "60px", height: "60px", color: "secondary.light" }} />
                </div>
                <Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">
                    No se encuentra la noticia
                </Typography>
            </Box>
        );
    }

    return contenido;
}

DetalleNoticia.defaultProps  = {
    noticia: PropTypes.undefined 
}

DetalleNoticia.propTypes = {
    noticia: PropTypes.object 
}
