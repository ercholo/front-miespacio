import React from "react";

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, useMediaQuery } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SendIcon from "@mui/icons-material/Send";

import { useTheme } from "@emotion/react";

import { useDispatch, useSelector } from "react-redux";
import { redux_usuario_select_Asignaciones, redux_usuario_select_Usuario } from "../../redux/usuario/usuarioSlice";
import { consultaMaestroAsignaciones } from "../../redux/api/maestroAsignaciones/maestroAsignacionesSlice";
import { redux_tickets_crear, redux_tickets_listar, redux_tickets_ResetearEstadoCrear, redux_tickets_select_EstadoCrear, } from "../../redux/tickets/ticketsSlice";
import { BoxErrorApi } from "../../navegacion/BoxErrorApi";
import AlertaAdjuntoGrande from "./subcomponentes/AlertaAdjuntoGrande";
import BotonAbrirDialogo from "./subcomponentes/BotonAbrirDialogo";
import DialogoTicketCreado from "./subcomponentes/DialogoTicketCreado";

const useFormularioTickets = () => {
    const usuario = useSelector(redux_usuario_select_Usuario);
    const asignaciones = useSelector(redux_usuario_select_Asignaciones);

    const [nombre, setNombre] = React.useState([usuario.nombre, usuario.apellidos].join(" "));
    const [email, setEmail] = React.useState(usuario.email);
    const [telefono, setTelefono] = React.useState("");
    const [centroCoste, setCentroCoste] = React.useState(asignaciones.centroCoste);

    const [asunto, setAsunto] = React.useState("");
    const [mensaje, setMensaje] = React.useState("");

    const [adjuntos, setAdjuntos] = React.useState({ fichero: null, datos: null, tamano: 0 });

    const dispatcher = React.useCallback(
        (accion, payload) => {
            switch (accion) {
                case "setNombre":
                    return setNombre(payload);
                case "setEmail":
                    return setEmail(payload);
                case "setTelefono":
                    return setTelefono(payload);
                case "setCentroCoste":
                    return setCentroCoste(payload);
                case "setAsunto":
                    return setAsunto(payload);
                case "setMensaje":
                    return setMensaje(payload);
                case "setAdjuntos": {
                    if (!payload) return setAdjuntos({ fichero: null, datos: null, tamano: 0 });

                    const convertBase64 = (file) => {
                        return new Promise((resolve, reject) => {
                            const fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = () => {
                                resolve(fileReader.result);
                            };
                            fileReader.onerror = (error) => {
                                reject(error);
                            };
                        });
                    };
                    const files = payload;
                    const file = files[0];
                    convertBase64(file).then((base64) => {
                        setAdjuntos({
                            fichero: file.name,
                            tamano: file.size,
                            datos: base64,
                        });
                    });

                    return;
                }
                default:
                    return console.log(`Acción incorrecta ${accion}`);
            }
        },
        [setEmail, setTelefono, setCentroCoste, setAsunto, setMensaje, setAdjuntos]
    );

    return {
        dispatcher,
        nombre,
        email,
        telefono,
        centroCoste,
        asunto,
        mensaje,
        adjuntos,
    };
};

export default function DialogCrearTicket() {
    const dispatch = useDispatch();
    const theme = useTheme();

    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [abierto, _setAbierto] = React.useState(false);

    // MOVIDON PARA CARGAR LOS CENTROS DE COSTE XD
    let estadoCargaAsignaciones = useSelector((state) => state.maestroAsignaciones.estado);
    // let errorCargaAsignaciones = useSelector(state => state.maestroAsignaciones.error);
    let resultadoCargaAsignaciones = useSelector((state) => state.maestroAsignaciones.resultado);
    let centrosDeCoste = React.useMemo(() => {
        if (resultadoCargaAsignaciones) {
            let a = resultadoCargaAsignaciones.find((asigancion) => asigancion.clave === "centroCoste");
            if (a.valores) return a.valores;
        }
        return null;
    }, [resultadoCargaAsignaciones]);
    React.useEffect(() => {
        if (estadoCargaAsignaciones === "inicial") {
            dispatch(consultaMaestroAsignaciones());
        }
    }, [dispatch, estadoCargaAsignaciones]);
    // FIN MOVIDON

    const { dispatcher, ...formulario } = useFormularioTickets();

    const estadoCreacionTicket = useSelector(redux_tickets_select_EstadoCrear);

    const fnEnviarTicket = React.useCallback(() => {
        const ticket = {
            nombre: formulario.nombre,
            email: formulario.email,
            telefono: formulario.telefono,
            asunto: formulario.asunto,
            mensaje: formulario.mensaje,
            centroCoste: formulario.centroCoste
        };

        if (formulario.adjuntos.datos) {
            ticket.adjuntos = [
                {
                    nombre: formulario.adjuntos.fichero,
                    contenido: formulario.adjuntos.datos,
                },
            ];
        }

        dispatch(redux_tickets_crear(ticket));
    }, [dispatch, formulario]);

    const fnSetAbierto = React.useCallback(
        (abierto) => {
            if (abierto) _setAbierto(abierto);
            else {
                if (estadoCreacionTicket.numeroTicket) {
                    dispatch(redux_tickets_ResetearEstadoCrear());
                    dispatch(redux_tickets_listar());
                }
                _setAbierto(false);
            }
        },
        [dispatch, _setAbierto, estadoCreacionTicket]
    );

    const cargando = estadoCreacionTicket.estado === "cargando";
    const errorCreacion = estadoCreacionTicket.error;
    const ticketCreado = estadoCreacionTicket.numeroTicket;


    const adjuntosDesmasiadoGrandes = (formulario.adjuntos.tamano / 1024).toFixed(1) > 1000

    if (ticketCreado) {
        return (<>
            <BotonAbrirDialogo fnSetAbierto={fnSetAbierto} />
            <DialogoTicketCreado abierto={abierto} fnSetAbierto={fnSetAbierto} numeroTicket={ticketCreado} />
        </>)
    }

    return (
        <>
            <Button size="large" variant="contained" onClick={() => fnSetAbierto(true)} startIcon={<SupportAgentIcon />}>
                Crear una nueva solicitud
            </Button>

            <Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={abierto} onClose={() => fnSetAbierto(false)}>
                <DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: "primary.main", color: "primary.contrastText" }}>
                    Crear nueva solicitud de soporte
                    <IconButton onClick={() => fnSetAbierto(false)} sx={{ position: "absolute", right: 8, top: 4, color: (t) => t.palette.grey[800] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 4, mt: 2 }}>
                    <Box>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            autoFocus
                            label="Nombre"
                            color="secondary"
                            disabled={cargando}
                            value={formulario.nombre}
                            onChange={(e) => dispatcher("setNombre", e.target.value)}
                            sx={{ width: { xs: "100%", sm: "50ch" }, mr: 2 }}
                        />
                    </Box>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        autoFocus
                        label="Correo electrónico"
                        color="secondary"
                        disabled={cargando}
                        value={formulario.email}
                        onChange={(e) => dispatcher("setEmail", e.target.value)}
                        sx={{ width: { xs: "100%", sm: "42ch" }, mr: 2 }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        autoFocus
                        label="Teléfono"
                        color="secondary"
                        disabled={cargando}
                        value={formulario.telefono}
                        onChange={(e) => dispatcher("setTelefono", e.target.value)}
                        sx={{ width: "18ch" }}
                    />

                    {estadoCargaAsignaciones === "cargando" && (
                        <Box sx={{ mt: 2 }}>
                            <CircularProgress size={32} /> Cargando centros de coste
                        </Box>
                    )}
                    {estadoCargaAsignaciones === "completado" && (
                        <Box sx={{ mt: 0 }}>
                            <FormControl variant="outlined" sx={{ mr: 2, my: 2 }}>
                                <InputLabel id="tipoViaje-label" color="secondary">
                                    Centro de coste
                                </InputLabel>
                                <Select
                                    //disabled={actualizando}
                                    required
                                    labelId="tipoViaje-label"
                                    value={formulario.centroCoste}
                                    onChange={(e) => dispatcher("setCentroCoste", e.target.value)}
                                    label="Centro de coste"
                                    color="secondary"
                                    disabled={cargando}
                                //sx={{ width: '100%' }}
                                >
                                    {centrosDeCoste &&
                                        centrosDeCoste.map((centroCoste) => (
                                            <MenuItem key={centroCoste.codigo} value={centroCoste.codigo}>
                                                {centroCoste.codigo} - {centroCoste.descripcion}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        autoFocus
                        label="Asunto"
                        color="secondary"
                        disabled={cargando}
                        value={formulario.asunto}
                        onChange={(e) => dispatcher("setAsunto", e.target.value)}
                        sx={{ mt: 0 }}
                    />
                    <TextField
                        label="Mensaje"
                        placeholder="Describa con la mayor precisión su petición."
                        required
                        fullWidth
                        multiline
                        rows={5}
                        color="secondary"
                        disabled={cargando}
                        value={formulario.mensaje}
                        onChange={(e) => dispatcher("setMensaje", e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 1 }}
                    />
                    {formulario.adjuntos?.datos ? (
                        <>
                            <Button
                                variant="outlined"
                                component="label"
                                color={adjuntosDesmasiadoGrandes ? "error" : "secondary"}
                                sx={{ mt: 2 }}
                                startIcon={<AttachFileIcon />}
                                disabled={cargando}
                            >
                                {formulario.adjuntos.fichero} ({(formulario.adjuntos.tamano / 1024).toFixed(0)}Kb)
                                <input hidden accept="*/*" multiple type="file" onChange={(e) => dispatcher("setAdjuntos", e.target.files)} />
                            </Button>
                            <IconButton variant="filled" color="error" sx={{ mt: 2 }} onClick={(e) => dispatcher("setAdjuntos", null)} disabled={cargando} >
                                <ClearOutlinedIcon />
                            </IconButton>
                            <AlertaAdjuntoGrande mostrar={adjuntosDesmasiadoGrandes} />
                        </>
                    ) : (
                        <Button variant="contained" component="label" color="secondary" sx={{ mt: 2 }} startIcon={<AttachFileIcon />} disabled={cargando}>
                            Adjuntar fichero
                            <input hidden accept="*/*" multiple type="file" onChange={(e) => dispatcher("setAdjuntos", e.target.files)} />
                        </Button>
                    )}

                    {errorCreacion && <BoxErrorApi msError={errorCreacion} titulo="Error al registrar el ticket" />}
                </DialogContent>

                <DialogActions sx={{ px: 4, mb: 2 }}>
                    <Button onClick={() => fnSetAbierto(false)} color="info" startIcon={<CloseIcon />} disabled={cargando}>
                        Descartar
                    </Button>
                    <Button onClick={fnEnviarTicket} variant="contained" startIcon={cargando ? <CircularProgress size={20} /> : <SendIcon />} disabled={cargando || adjuntosDesmasiadoGrandes}>
                        {cargando ? "Esperando respuesta" : "Enviar solicitud"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
