import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useStore } from "react-redux";
import { BoxErrorApi } from "../../../navegacion/BoxErrorApi";
import API from "../../../api/api";
import { LoadingButton } from "@mui/lab";
import { red } from "@mui/material/colors";
import {useAutorizacion} from "../../../hooks/useAutorizacion";

const LineaReserva = ({ id, asunto, comentario, vehiculo, fechaInicio, fechaFin, fechaSolicitud, empleado, mostrarSolicitante, onReservaEliminada }) => {
  
    const redux = useStore();
    const esPropietario = useAutorizacion({
        codigoEmpleado: [92409705, 90101521, parseInt(empleado.codigo)],
        funcionAsignada: [70011000],
    });
    const [estadoBorrado, setEstadoBorrado] = React.useState({
        estado: "normal",
        error: null,
    });

    const fnCancelarReserva = React.useCallback(async () => {
        setEstadoBorrado({ estado: "eliminando", error: null });
        try {
            const respuestaApi = await API(redux).empleados.reservas.vehiculo.idReserva.del(id);
            if (respuestaApi.id === id) {
                setEstadoBorrado({ estado: "eliminado", error: null });
                onReservaEliminada?.(id);
            }
        } catch (error) {
            setEstadoBorrado({ estado: "error", error });
        }
    }, [redux, setEstadoBorrado, id, onReservaEliminada]);

    const fnLimpiarError = React.useCallback(() => {
        setEstadoBorrado({ estado: "normal", error: null });
    }, [setEstadoBorrado]);

    fechaInicio = format(new Date(fechaInicio), "EEEE, dd MMMM yyyy HH:mm", {
        locale: es,
    });
    fechaFin = format(new Date(fechaFin), "EEEE, dd MMMM yyyy", { locale: es });

    return (
        <Paper
            elevation={1}
            square
            sx={{
                display: "flex",
                flexDirection: "column",
                py: 2,
                px: 4,
                mb: 2,
                flexBasis: "100%",
                borderLeftColor: esPropietario ? "primary.light" : red[200],
                borderLeftStyle: "solid",
                borderLeftWidth: 2,
            }}
        >
            <Box sx={{ whiteSpace: "nowrap", overflow: "hidden", mb: 1 }}>
                <Typography variant="h6" component="div">
                    {esPropietario ? asunto : "DIA RESERVADO"}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                {esPropietario ? (
                    <>
                        {mostrarSolicitante && (
                            <Box sx={{ mb: 1 }}>
                                <Typography component="div" sx={{ fontWeight: "bold" }}>
                                    Solicitante:{" "}
                                </Typography>
                                <Typography component="div" sx={{ ml: 3 }}>
                                    {empleado.nombre}
                                </Typography>
                                <Typography component="div" sx={{ ml: 3 }} variant="body2">
                                    ({empleado.codigo}) {empleado.email}
                                </Typography>
                            </Box>
                        )}
                        <Box>
                            <Typography component="div" sx={{ fontWeight: "bold" }}>
                                Vehiculo:{" "}
                            </Typography>
                            <Typography component="div" sx={{ ml: 3 }}>
                                {vehiculo.matricula}
                            </Typography>
                            <Typography component="div" sx={{ ml: 3 }} variant="body2">
                                {" "}
                                {vehiculo.descripcion}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <Typography component="div" sx={{ fontWeight: "bold" }}>
                                Salida:{" "}
                            </Typography>
                            <Typography component="div" sx={{ ml: 3 }}>
                                El {fechaInicio}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <Typography component="div" sx={{ fontWeight: "bold" }}>
                                Regreso:{" "}
                            </Typography>
                            <Typography component="div" sx={{ ml: 3 }}>
                                El {fechaFin}
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <Box>
                        <Typography component="div" sx={{ fontWeight: "bold" }}>
                            Reservado por:{" "}
                        </Typography>
                        <Typography component="div" sx={{ ml: 3 }}>
                            {empleado.nombre}
                        </Typography>
                        <Typography component="div" sx={{ ml: 3 }} variant="caption">
                            {/*empleado.codigo*/}
                            {empleado.email}
                        </Typography>
                    </Box>
                )}
            </Box>

            {esPropietario && (
                <>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <LoadingButton loading={estadoBorrado.estado === "eliminando"} variant="outlined" size="small" color="error" startIcon={<AutoDeleteOutlinedIcon />} onClick={fnCancelarReserva}>
                            Cancelar
                        </LoadingButton>
                    </Box>

                    <BoxErrorApi
                        msError={estadoBorrado.error}
                        onClose={fnLimpiarError}
                        sx={{ mb: 1 }}
                        snackbar={{
                            open: Boolean(estadoBorrado.error),
                            autoHideDuration: 6000,
                            onClose: fnLimpiarError,
                        }}
                    />
                </>
            )}
        </Paper>
    );
};

export default LineaReserva;
