import {
    Alert,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SendIcon from "@mui/icons-material/Send";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import es from "date-fns/locale/es";
import React, { useEffect } from "react";
import { useNavigate } from 'react-router';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { useDispatch, useSelector } from "react-redux";
import { consultaMaestroAsignaciones } from "../../../redux/api/maestroAsignaciones/maestroAsignacionesSlice";
import { addMinutes, format } from "date-fns";
import { crearNoticiaEdicion } from "../../../redux/api/noticiasGestion/noticiasGestionSlice.edicion";
import { clearCreadorNoticias } from "../../../redux/api/noticiasGestion/noticiasGestionSlice";
import Resizer from "react-image-file-resizer";
import { BoxErrorApi } from "../../../navegacion/BoxErrorApi";

const reductorImagen = (file) => {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(file, 300, 300, "PNG", 99, 0, resolve, "base64");
    });
};

const SELECTORES_AUDIENCIA = [
    "posicionAsignada",
    "relacionLaboral",
    "areaPersonal",
    "funcionAsignada",
    "unidadOrganizativa",
    "subdivisionPersonal",
    "sociedad",
];

const TOOLBAR_CONTENIDO = [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    ["image", "link", "video"],
    ["clean"],
];
const TOOLBAR_MINIATURA = [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    ["image", "link", "video"],
    ["clean"],
];

const SelectorAudiencia = ({ maestro, seleccion, setSeleccion, disabled }) => {
    const labelId = `selector-audiencia-${maestro.clave}-label`;
    const selectId = `selector-audiencia-${maestro.clave}`;

    return (
        <FormControl sx={{ m: 1, width: "100%" }}>
            <InputLabel id={labelId} color="secondary">
                {maestro.descripcion}
            </InputLabel>
            <Select
                disabled={disabled}
                labelId={labelId}
                label={maestro.descripcion}
                id={selectId}
                multiple
                value={seleccion || []}
                onChange={(e) => setSeleccion(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
                input={<OutlinedInput label={maestro.descripcion} color="secondary" />}
            >
                {maestro.valores.map((valor) => (
                    <MenuItem key={valor.codigo} value={valor.codigo}>
                        <Checkbox checked={Array.isArray(seleccion) && seleccion.indexOf(valor.codigo) > -1} color="secondary" />
                        {valor.codigo} - {valor.descripcion}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const SelectoresDeAudiencia = ({ value, setValue, disabled }) => {
    const dispatch = useDispatch();
    const maestroAudiencia = useSelector((state) => state.maestroAsignaciones.resultado);
    const estadoMaestroAudiencia = useSelector((state) => state.maestroAsignaciones.estado);
    const error = useSelector((state) => state.maestroAsignaciones.error);

    const setAudiencia = React.useCallback(
        (tipoAsignacion, valorAsignacion) => {
            setValue((v) => {
                return {
                    ...v,
                    [tipoAsignacion]: valorAsignacion,
                };
            });
        },
        [setValue]
    );

    React.useEffect(() => {
        if (estadoMaestroAudiencia === "inicial") dispatch(consultaMaestroAsignaciones());
    }, [dispatch, estadoMaestroAudiencia]);

    let contenido = null;
    if (estadoMaestroAudiencia === "cargando") {
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
                    Cargando opciones ...
                </Typography>
            </Box>
        );
    } else if (error) {
        contenido = <BoxErrorApi msError={error} titulo="Ocurrió un error al realizar la consulta" />;
    } else if (maestroAudiencia) {
        contenido = maestroAudiencia
            .filter((maestro) => SELECTORES_AUDIENCIA.includes(maestro.clave))
            .map((maestro) => (
                <SelectorAudiencia
                    disabled={disabled}
                    maestro={maestro}
                    key={maestro.clave}
                    seleccion={value[maestro.clave]}
                    setSeleccion={(seleccion) => setAudiencia(maestro.clave, seleccion)}
                />
            ));
    }

    return contenido;
};

export default function FormularioCreacionNoticia() {
    const [titulo, setTitulo] = React.useState();
    const [categoria, setCategoria] = React.useState();
    const [contenido, setContenido] = React.useState();

    const [miniaturaModo, setMiniaturaModo] = React.useState("normal");
    const [miniaturaResumen, setMiniaturaResumen] = React.useState();
    const [miniaturaImagen, setMiniaturaImagen] = React.useState("");

    const [estado, setEstado] = React.useState("borrador");
    const [fechaPublicacion, setFechaPublicacion] = React.useState(null);
    const [fechaExpiracion, setFechaExpiracion] = React.useState(null);

    const [audiencia, setAudiencia] = React.useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const estadoCreacion = useSelector((state) => state.noticiasGestion.crear.estado);
    const errorCreacion = useSelector((state) => state.noticiasGestion.crear.error);
    const resultadoCreacion = useSelector((state) => state.noticiasGestion.crear.resultado);

    const cargando = estadoCreacion === "cargando";
    const [mostrarMensajeOk, setMostrarMensajeOk] = React.useState(false);

    useEffect(() => {
        if (!resultadoCreacion?.id) return;

        setMostrarMensajeOk(false);
        dispatch(clearCreadorNoticias());
        navigate('/noticias/gestion');

    }, [dispatch, navigate, resultadoCreacion]);

    const crearNoticia = React.useCallback(() => {
        let fPubZ = null;
        if (fechaPublicacion) {
            let fPubOffset = fechaPublicacion.getTimezoneOffset();
            fPubZ = addMinutes(fechaPublicacion, fPubOffset);
        }

        let fExpZ = null;
        if (fechaExpiracion) {
            let fExpOffset = fechaExpiracion.getTimezoneOffset();
            fExpZ = addMinutes(fechaExpiracion, fExpOffset);
        }

        let payload = {
            titulo,
            categoria,
            contenido,
            miniatura: {
                modo: miniaturaModo || "",
                resumen: miniaturaResumen || "",
                imagen: miniaturaImagen || "",
            },
            estado,
            fechaPublicacion: fPubZ ? format(fPubZ, "yyyy-MM-dd'T'HH:mm:ss.000'Z'", new Date()) : null,
            fechaExpiracion: fExpZ ? format(fExpZ, "yyyy-MM-dd'T'HH:mm:ss.000'Z'", new Date()) : null,
            audiencia,
        };

        if (!payload.fechaPublicacion) delete payload.fechaPublicacion;
        if (!payload.fechaExpiracion) delete payload.fechaExpiracion;

        dispatch(crearNoticiaEdicion({ payload }));
    }, [
        dispatch,
        titulo,
        categoria,
        contenido,
        miniaturaModo,
        miniaturaResumen,
        miniaturaImagen,
        estado,
        fechaPublicacion,
        fechaExpiracion,
        audiencia,
    ]);

    const seleccionarImagen = React.useCallback(async (e) => {
        const files = e.target.files;
        const file = files[0];
        const image = await reductorImagen(file);
        setMiniaturaImagen(image);
    }, []);

    const eliminarImagenMiniatura = React.useCallback(() => {
        setMiniaturaImagen(null);
    }, [setMiniaturaImagen]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <Box sx={{ width: "100%" }}>
                <TextField
                    disabled={cargando}
                    color="secondary"
                    variant="outlined"
                    label="Título de la noticia"
                    defaultValue={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    error={!Boolean(titulo)}
                    sx={{ my: 2, width: "100%" }}
                />
                <TextField
                    disabled={cargando}
                    color="secondary"
                    variant="outlined"
                    label="Categoria"
                    size="small"
                    defaultValue={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    error={!Boolean(categoria)}
                    sx={{ mb: 4, width: "100%" }}
                />
                <Box sx={{ width: "100%" }}>
                    <ReactQuill
                        readOnly={cargando}
                        theme="snow"
                        value={contenido}
                        onChange={(v) => {
                            setContenido(v);
                        }}
                        modules={{ toolbar: TOOLBAR_CONTENIDO }}
                    />
                </Box>
            </Box>

            <Typography
                variant="h6"
                sx={{
                    borderBottom: "1px solid lightgrey",
                    width: "100%",
                    mt: 6,
                    mb: 3,
                }}
            >
                Miniatura
            </Typography>
            <Grid container>
                <Grid item md={4} sx={{ px: 2 }}>
                    <FormControl variant="outlined" sx={{ mr: 2, mb: 2, width: "100%" }}>
                        <InputLabel id="Modo-label" color="secondary">
                            Modo de visualización
                        </InputLabel>
                        <Select
                            disabled={cargando}
                            labelId="Modo-label"
                            value={miniaturaModo || "normal"}
                            onChange={(e) => setMiniaturaModo(e.target.value)}
                            label="Modo de visualización"
                            color="secondary"
                            sx={{ width: "100%" }}
                        >
                            <MenuItem value="normal">Modo normal</MenuItem>
                            <MenuItem value="logo">Modo logo</MenuItem>
                        </Select>
                    </FormControl>
                    {miniaturaImagen ? (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    flexDirection: "row",
                                }}
                            >
                                <img src={miniaturaImagen} alt="Miniatura" style={{ maxWidth: "300px" }} />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    flexDirection: "row",
                                    mt: 2,
                                }}
                            >
                                <Button
                                    disabled={cargando}
                                    variant="contained"
                                    component="label"
                                    color="info"
                                    startIcon={<CloudUploadOutlinedIcon />}
                                >
                                    Cambiar
                                    <input hidden accept="image/*" type="file" onChange={seleccionarImagen} />
                                </Button>
                                <Button
                                    disabled={cargando}
                                    variant="outlined"
                                    component="label"
                                    color="error"
                                    startIcon={<DeleteOutlinedIcon />}
                                    onClick={eliminarImagenMiniatura}
                                >
                                    Eliminar
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    flexDirection: "row",
                                }}
                            >
                                <Button
                                    disabled={cargando}
                                    variant="outlined"
                                    size="large"
                                    component="label"
                                    color="success"
                                    startIcon={<CloudUploadOutlinedIcon />}
                                >
                                    Subir imagen
                                    <input hidden accept="image/*" type="file" onChange={seleccionarImagen} />
                                </Button>
                            </Box>
                        </>
                    )}
                </Grid>
                <Grid item md={8}>
                    <Box sx={{ width: "100%" }}>
                        <ReactQuill
                            readOnly={cargando}
                            theme="snow"
                            value={miniaturaResumen}
                            onChange={(v) => {
                                setMiniaturaResumen(v);
                            }}
                            modules={{ toolbar: TOOLBAR_MINIATURA }}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Typography
                variant="h6"
                sx={{
                    borderBottom: "1px solid lightgrey",
                    width: "100%",
                    mt: 10,
                    mb: 3,
                }}
            >
                Estado de publicación
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    alignItems: "flex-start",
                }}
            >
                <FormControl variant="outlined" sx={{ mr: 2, mb: 2 }}>
                    <InputLabel id="Duracion-label" color="secondary">
                        Estado
                    </InputLabel>
                    <Select
                        disabled={cargando}
                        labelId="Duracion-label"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        label="Estado"
                        color="secondary"
                        sx={{ width: "30ch" }}
                    >
                        {["Activa", "Borrador", "Archivada"].map((d) => (
                            <MenuItem key={d} value={d.toLowerCase()}>
                                {d}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DateTimePicker
                        disabled={cargando}
                        label="Fecha de Publicación"
                        renderInput={(params) => <TextField {...params} />}
                        value={fechaPublicacion}
                        onChange={(nuevaFecha) => {
                            setFechaPublicacion(nuevaFecha);
                        }}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DateTimePicker
                        disabled={cargando}
                        label="Fecha de Expiración"
                        renderInput={(params) => <TextField {...params} />}
                        value={fechaExpiracion}
                        onChange={(nuevaFecha) => {
                            setFechaExpiracion(nuevaFecha);
                        }}
                    />
                </LocalizationProvider>
            </Box>

            <Typography
                variant="h6"
                sx={{
                    borderBottom: "1px solid lightgrey",
                    width: "100%",
                    mt: 10,
                    mb: 3,
                }}
            >
                Audiencia
            </Typography>
            <SelectoresDeAudiencia value={audiencia} setValue={setAudiencia} disabled={cargando} />

            <Box
                sx={{
                    mt: 4,
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                {mostrarMensajeOk && <Alert>Noticia creada con éxito</Alert>}

                <Button
                    disabled={cargando}
                    variant="contained"
                    size="large"
                    startIcon={cargando ? <CircularProgress size={26} color="success" /> : <SendIcon />}
                    onClick={crearNoticia}
                >
                    {cargando ? "Creando" : "Crear"}
                </Button>
            </Box>
            {errorCreacion && <BoxErrorApi msError={errorCreacion} titulo="Ocurrió un error al crear la noticia" />}
        </Box>
    );
}
