import {useState, useRef, useCallback, useEffect } from "react";

import BoxErrorApi from "../../navegacion/BoxErrorApi";

import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { useStore } from "react-redux";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

import API from "../../api/api";
import MsRestError from "@hefame/microservice-rest-error";
import useOnScreen from "../../hooks/useOnScreen";

const MiniaturaNoticia = ({ noticia }) => {
    const redux = useStore();

    const visibleRef = useRef();
    const estoyVisible = useOnScreen(visibleRef);

    const [carga, setCarga] = useState({
        miniatura: null,
        error: null,
        estado: "inicial",
    });

    const cargarMiniatura = useCallback(async () => {
        setCarga((c) => {
            return { ...c, error: null, estado: "cargando" };
        });

        try {
            const respuesta = await API(redux).noticias.idNoticia.get(noticia.id, "miniatura");
            setCarga({ miniatura: respuesta, error: null, estado: "completado" });
        } catch (error) {
            console.log("Error al cargar la miniatura:", error);
            const msError = MsRestError.from(error);
            msError.appendStack("MiniaturaNoticia.cargarMiniatura");
            setCarga({ miniatura: null, error: msError, estado: "completado" });
        }
    }, [noticia.id, setCarga, redux]);

    useEffect(() => {
        if (estoyVisible && carga.estado === "inicial") {
            cargarMiniatura();
        }
    }, [estoyVisible, carga.estado, cargarMiniatura]);

    let fechaPub = new Date(noticia.fechaPublicacion);
    fechaPub = format(fechaPub, "cccc, dd' de 'LLLL' de 'yyyy", { locale: es });

    const cabeceraMiniatura = (
        <Box>
            <Typography component="div" variant="caption" sx={{ float: { sm: "right" } }}>
                El {fechaPub}
            </Typography>
            <Typography component="div" variant="caption" sx={{ mb: 0 }}>
                {noticia.categoria}
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                {noticia.titulo}
            </Typography>
        </Box>
    );

    const botoneraMiniatura = (
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <Button size="small" color="secondary" endIcon={<ReadMoreIcon />} component={Link} to={"/noticias/" + noticia.id}>
                Saber mas
            </Button>
        </Box>
    );

    let contenidoMiniatura;
    if (carga.estado === "cargando" || carga.estado === "inicial") {
        contenidoMiniatura = (
            <>
                <Box
                    sx={{
                        pr: { md: 4 },
                        mb: { xs: 2, md: 0 },
                        width: { lg: "400px", md: "250px", xs: "100%" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <Skeleton variant="rectangular" width="100%" height={160} />
                </Box>
                <Box sx={{ width: "100%", py: 0 }}>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" width="60%" sx={{ mb: 2 }} />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" width="30%" />
                </Box>
            </>
        );
    } else if (carga.error) {
        contenidoMiniatura = <BoxErrorApi msError={carga.error} titulo="No se pudo cargar la noticia" />;
    } else {
        const miniatura = carga.miniatura.miniatura;

        let textoMiniatura = (
            <Box sx={{ width: "100%", py: 0 }}>
                <div className="quill" dangerouslySetInnerHTML={{ __html: miniatura?.resumen || "CARGAME" }} />
            </Box>
        );

        let imagenMiniatura = null;
        let modoVisualizacion = miniatura.modo;

        if (miniatura.imagen) {
            if (modoVisualizacion === "logo") {
                imagenMiniatura = (
                    <Box sx={{ pr: { md: 4 }, mb: { xs: 2, md: 0 }, width: { lg: "400px", md: "250px", xs: "100%" } }}>
                        <img
                            src={miniatura.imagen}
                            alt={noticia.titulo}
                            style={{
                                float: "left",
                                width: "auto",
                                paddingRight: "30px",
                                paddingLeft: "12px",
                            }}
                        />
                    </Box>
                );

                contenidoMiniatura = (
                    <Box>
                        {imagenMiniatura}
                        {textoMiniatura}
                    </Box>
                );
            } else {
                imagenMiniatura = (
                    <Box
                        sx={{
                            pr: { md: 4 },
                            mb: { xs: 2, md: 0 },
                            width: { lg: "400px", md: "250px", xs: "100%" },
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}
                    >
                        <img
                            src={miniatura.imagen}
                            alt={noticia.titulo}
                            style={{
                                objectFit: "contain",
                                maxWidth: "100%" /*, maxHeight: '160px'*/,
                            }}
                        />
                    </Box>
                );

                contenidoMiniatura = (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                flexDirection: { xs: "column", md: "row" },
                            }}
                        >
                            {imagenMiniatura}
                            {textoMiniatura}
                        </Box>
                    </>
                );
            }
        } else {
            contenidoMiniatura = textoMiniatura;
        }
    }

    return (
        <Paper square elevation={2} sx={{ p: 4, mb: 3 }} ref={visibleRef}>
            {cabeceraMiniatura}
            {contenidoMiniatura}
            {botoneraMiniatura}
        </Paper>
    );
};

export default MiniaturaNoticia;
