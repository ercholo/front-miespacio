import React from "react";

import { Box, Chip, CircularProgress, Stack, Typography, TextField, FormControl, MenuItem, Select, InputLabel, Paper } from "@mui/material";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import DoneIcon from "@mui/icons-material/Done";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import { useDispatch, useSelector } from "react-redux";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import DialogCrearTicket from "./DialogCrearTicket";
import { redux_tickets_listar, redux_tickets_select_EstadoListado, redux_tickets_select_Listado } from "../../redux/tickets/ticketsSlice";
import { BoxErrorApi } from "../../navegacion/BoxErrorApi";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { grey } from "@mui/material/colors";

const estados = ["Pendiente usuario", "Análisis", "En Test", "En Desarrollo", "Abierto", "En curso", "Remitida a proveedor", "Resuelto"];

const getPrioridadDeEstadoTicket = (estado) => {
    switch (estado) {
        case "Pendiente usuario":
            return 10;
        case "En Test":
            return 11;

        case "Análisis":
            return 40;
        case "En Desarrollo":
            return 41;
        case "En curso":
            return 42;

        case "Abierto":
            return 1;

        case "Remitida a proveedor":
            return 60;
        case "Resuelto":
            return 100;
        default:
            return 30;
    }
};

const getEstiloDeEstadoTicket = (estado) => {
    switch (estado) {
        case "Abierto":
            return ["success", estado, "outlined", <LockOpenIcon />];
        case "En Test":
            return ["info", estado, "outlined", <NoteAltOutlinedIcon />];
        case "Análisis":
            return ["info", estado, "outlined", <EqualizerIcon />];
        case "En Desarrollo":
            return ["info", estado, "outlined", <LockClockOutlinedIcon />];
        case "Pendiente usuario":
            return ["warning", "Requiere su atención", "outlined", <WarningAmberIcon />];
        case "En curso":
            return ["secondary", estado, "filled", <HistoryOutlinedIcon />];
        case "Remitida a proveedor":
            return ["secondary", "Remitida a proveedor externo", "outlined", <AutorenewOutlinedIcon />];
        case "Resuelto":
            return ["success", estado, "", <DoneIcon />];
        default:
            return ["info", estado, ""];
    }
};

const ChipEstado = ({ estado }) => {
    const [color, texto, variante, icono] = getEstiloDeEstadoTicket(estado);
    return <Chip label={texto} color={color} variant={variante} icon={icono} size="small" sx={{ py: 2, px: 1 }} />;
};

const LineaTicket = (ticket) => {
    return (
        <Paper square elevation={1} sx={{ px: 4, py: 2, mb: 3, borderLeft: "8px solid", borderLeftColor: 'primary.main' }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                    variant="caption"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        lineHeight: 0,
                        color: grey[800],
                    }}
                    component="div"
                >
                    <CalendarMonthOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />
                    {format(ticket.fechaModificacion, "dd MMMM yyyy / HH:mm", { locale: es })}
                </Typography>
                <Box>
                    <Typography
                        variant="caption"
                        component="span"
                        sx={{ display: "flex", alignItems: "center", gap: "5px", float: "right", color: grey[800], lineHeight: 0 }}
                    >
                        <ConfirmationNumberOutlinedIcon fontSize="small" sx={{ color: grey[400] }} />
                        {ticket.id}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
                <a href={ticket.enlace} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <Typography variant="h6" component="div" sx={{ color: "black", mt: 1 }}>
                        {ticket.asunto}
                    </Typography>
                </a>
                <Typography variant="caption" sx={{}} component="div">
                    <ChipEstado estado={ticket.estado} />
                </Typography>
            </Box>
        </Paper>
    );
};

export default function PantallaTickets() {
    const dispatch = useDispatch();

    const { estado: estadoListar, error: errorListar } = useSelector(redux_tickets_select_EstadoListado);
    const tickets = useSelector(redux_tickets_select_Listado);

    const [filtroTexto, setFiltroTexto] = React.useState("");
    const [filtroEstado, setFiltroEstado] = React.useState("");
    const [filtroFecha, setFiltroFecha] = React.useState(null);

    React.useEffect(() => {
        if (estadoListar === "inicial") {
            dispatch(redux_tickets_listar());
        }
    });

    const ticketsOrdenados = React.useMemo(() => {
        if (!tickets) return [];
        let ordenados = [...tickets];
        ordenados.sort((a, b) => {
            let prioA = getPrioridadDeEstadoTicket(a.estado);
            let prioB = getPrioridadDeEstadoTicket(b.estado);
            if (prioA === prioB) {
                return b.fechaModificacion - a.fechaModificacion;
            } else {
                return prioA - prioB;
            }
        });

        return ordenados;
    }, [tickets]);

    const ticketsFiltrados = React.useMemo(() => {
        if (!ticketsOrdenados) return [];
        let filtrados = [...ticketsOrdenados];
        function asuntoValido(ticket) {
            return ticket.asunto.toLowerCase().includes(filtroTexto.toLowerCase());
        }
        function estadoValido(ticket) {
            return ticket.estado.includes(filtroEstado);
        }
        function fechaValido(ticket) {
            let fechas = [];
            fechas.push(ticket.fechaModificacion.toDateString());
            return fechas.includes(filtroFecha.toDateString());
        }
        filtrados = filtrados.filter(asuntoValido);
        filtrados = filtrados.filter(estadoValido);
        if (filtroFecha) {
            filtrados = filtrados.filter(fechaValido);
        }
        return filtrados;
    }, [filtroTexto, filtroEstado, filtroFecha, ticketsOrdenados]);

    let contenido = null;

    if (estadoListar === "cargando") {
        contenido = (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
                <CircularProgress size={40} />
                <Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">
                    Consultando tickets ...
                </Typography>
            </Box>
        );
    } else if (errorListar) {
        contenido = <BoxErrorApi msError={errorListar} title="No se pudieron obneter sus tickets de soporte" />;
    } else if (tickets?.length > 0) {
        contenido = (
            <Stack sx={{ mt: 2, p: "3px" }}>
                {ticketsFiltrados.map((ticket) => (
                    <LineaTicket key={ticket.id} {...ticket} />
                ))}
            </Stack>
        );
    } else {
        contenido = (
            <Box sx={{ m: "auto", textAlign: "center" }}>
                <div>
                    <SentimentNeutralIcon sx={{ width: "60px", height: "60px", color: "secondary.light" }} />
                </div>
                <Typography sx={{ ml: 2, mt: 1, p: "3px" }} variant="h5" component="div">
                    Sin resultados
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative" }}>
            <Box sx={{ m: "auto" }}>
                <Typography variant="h4" sx={{ m: "auto", mb: 2 }}>
                    Peticiones de Soporte Informático
                </Typography>
                <Typography>Este es el listado de sus tickets de soporte informático.</Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    position: { xs: "relative", md: "absolute" },
                    top: 0,
                    right: 0,
                    justifyContent: { xs: "center", md: "flex-end" },
                    m: 2,
                }}
            >
                <DialogCrearTicket />
            </Box>
            <Box
                component="span"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    gap: 1,
                    my: 2,
                    mb: 2,
                    flexWrap: "wrap",
                    flexDirection: { md: "row", xs: "column" },
                    p: 1,
                }}
            >
                <Box sx={{ flex: "auto" }}>
                    <Box>
                        <TextField
                            sx={{ width: "100%", m: 0 }}
                            id="filtro-texto"
                            variant="outlined"
                            label="Buscar por texto"
                            onChange={(e) => setFiltroTexto(e.target.value)}
                        />
                    </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="label-filtro-estado" sx={{ display: "flex", gap: "5px" }}>
                            Buscar por estado
                        </InputLabel>
                        <Select
                            labelId="filtro-estado"
                            id="filtro-estado"
                            value={filtroEstado}
                            label="Buscar por estado"
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Todos</em>
                            </MenuItem>
                            {estados.map((estado) => (
                                <MenuItem key={estado} value={estado}>
                                    {estado}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Buscar por fecha"
                            value={filtroFecha}
                            onChange={(newValue) => setFiltroFecha(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                            closeOnSelect={false}
                            disableFuture
                        />
                    </LocalizationProvider>
                </Box>
            </Box>

            {contenido}
        </Box>
    );
}
