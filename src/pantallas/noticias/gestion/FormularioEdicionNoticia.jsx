import {
    Alert,
    Autocomplete,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    FormGroup,
    FormControlLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SendIcon from "@mui/icons-material/Send";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import es from "date-fns/locale/es";
import React, { useEffect } from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { useDispatch, useSelector } from "react-redux";
import { consultaMaestroAsignaciones } from "../../../redux/api/maestroAsignaciones/maestroAsignacionesSlice";
import { addMinutes, format } from "date-fns";
import { actualizaNoticiaEdicion } from "../../../redux/api/noticiasGestion/noticiasGestionSlice.edicion";
import { clearEditorNoticias } from "../../../redux/api/noticiasGestion/noticiasGestionSlice";
import Resizer from "react-image-file-resizer";
import { BoxErrorApi } from "../../../navegacion/BoxErrorApi";

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

const ICONO_CHECK_ON = <CheckBoxOutlineBlankIcon fontSize="small" />;
const ICONO_CHECK_OFF = <CheckBoxIcon fontSize="small" />;

const reductorImagen = (file) => {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(file, 300, 300, "PNG", 99, 0, resolve, "base64");
    });
};

const SelectorAudiencia = ({ maestro, seleccion, setSeleccion, disabled }) => {
    const opciones = maestro.valores.map((valor) => {
        return {
            label: `${valor.codigo} - ${valor.descripcion}`,
            id: valor.codigo,
        };
    });

    const [estadoInterno, _setEstadoInterno] = React.useState(
        seleccion?.map((e) => {
            return opciones.find((o) => o.id === e);
        }) || []
    );

    const setEstadoInterno = (nuevoEstado) => {
        _setEstadoInterno(nuevoEstado);
        setSeleccion(nuevoEstado.map((e) => e.id));
    };

    return (
        <FormControl sx={{ m: 1, width: "100%" }}>
            <Autocomplete
                value={estadoInterno}
                onChange={(event, newValue) => {
                    setEstadoInterno(newValue);
                }}
                isOptionEqualToValue={(option, value) => {
                    return option?.id === value?.id || option?.id === value;
                }}
                multiple
                disableCloseOnSelect
                disabled={disabled}
                options={opciones}
                limitTags={5}
                clearOnBlur={false}
                clearOnEscape={false}
                filterSelectedOptions
                freeSolo
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox icon={ICONO_CHECK_ON} checkedIcon={ICONO_CHECK_OFF} style={{ marginRight: 8 }} checked={selected} />
                        {option.label}
                    </li>
                )}
                renderInput={(params) => <TextField {...params} label={maestro.descripcion} placeholder={maestro.descripcion} />}
            />
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

export default function FormularioEdicionNoticia({ noticia }) {
    const [titulo, setTitulo] = React.useState(noticia.titulo);
    const [categoria, setCategoria] = React.useState(noticia.categoria);
    const [contenido, setContenido] = React.useState(noticia.contenido);
    const [noticiaBasica, setNoticiaBasica] = React.useState(false);

    const [miniaturaModo, setMiniaturaModo] = React.useState(noticia.miniatura.modo || "normal");
    const [miniaturaResumen, setMiniaturaResumen] = React.useState(noticia.miniatura.resumen);
    const [miniaturaImagen, setMiniaturaImagen] = React.useState(noticia.miniatura.imagen);

    const [estado, setEstado] = React.useState(noticia.estado);
    const [fechaPublicacion, setFechaPublicacion] = React.useState(
        noticia.fechaPublicacion ? new Date(noticia.fechaPublicacion) : new Date(noticia.fechaCreacion)
    );
    const [fechaExpiracion, setFechaExpiracion] = React.useState(
        noticia.fechaExpiracion !== "2199-12-31T23:59:59.999Z" ? new Date(noticia.fechaExpiracion) : null
    );

    const [audiencia, setAudiencia] = React.useState(noticia.audiencia);

    const dispatch = useDispatch();
    const estadoActualizacion = useSelector((state) => state.noticiasGestion.editor.edicion.estado);
    const errorActualizacion = useSelector((state) => state.noticiasGestion.editor.edicion.error);
    const resultadoActualizacion = useSelector((state) => state.noticiasGestion.editor.edicion.resultado);

    const actualizando = estadoActualizacion === "cargando";
    const [mostrarMensajeOk, setMostrarMensajeOk] = React.useState(false);

    useEffect(() => {
        if (!resultadoActualizacion?.id) return;

        setMostrarMensajeOk(true);
        setTimeout(() => {
            setMostrarMensajeOk(false);
            dispatch(clearEditorNoticias());
        }, 5000);
    }, [dispatch, resultadoActualizacion]);

    const actualizarNoticia = React.useCallback(() => {
        let fPubZ = null;
        if (fechaPublicacion) {
            let fPubOffset = fechaPublicacion.getTimezoneOffset();
            fPubZ = addMinutes(fechaPublicacion, fPubOffset);
        } else {
            let fCre = new Date(noticia.fechaCreacion);
            let fCreOffset = fCre.getTimezoneOffset();
            fPubZ = addMinutes(fCre, fCreOffset);
        }

        let fExpZ = null;
        if (fechaExpiracion) {
            let fExpOffset = fechaExpiracion.getTimezoneOffset();
            fExpZ = addMinutes(fechaExpiracion, fExpOffset);
        }

        let idNoticia = noticia.id;
        let payload = {
            titulo,
            categoria,
            contenido,
            noticiaBasica,
            miniatura: {
                modo: miniaturaModo || "",
                resumen: miniaturaResumen,
                imagen: miniaturaImagen || "",
            },
            estado,
            fechaPublicacion: fPubZ ? format(fPubZ, "yyyy-MM-dd'T'HH:mm:ss.000'Z'", new Date()) : null,
            fechaExpiracion: fExpZ ? format(fExpZ, "yyyy-MM-dd'T'HH:mm:ss.000'Z'", new Date()) : null,
            audiencia,
        };

        if (!payload.fechaPublicacion) delete payload.fechaPublicacion;
        if (!payload.fechaExpiracion) delete payload.fechaExpiracion;

        dispatch(actualizaNoticiaEdicion({ idNoticia, payload }));
    }, [
        dispatch,
        noticia.id,
        noticia.fechaCreacion,
        titulo,
        categoria,
        contenido,
        noticiaBasica,
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
                    disabled={actualizando}
                    color="secondary"
                    variant="outlined"
                    label="Título de la noticia"
                    defaultValue={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    error={!Boolean(titulo)}
                    sx={{ my: 2, width: "100%" }}
                />
                <TextField
                    disabled={actualizando}
                    color="secondary"
                    variant="outlined"
                    label="Categoria"
                    size="small"
                    defaultValue={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    error={!Boolean(categoria)}
                    sx={{ mb: 4, width: "100%" }}
                />
            </Box>
            <Typography
                variant="h6"
                sx={{
                    borderBottom: "1px solid lightgrey",
                    width: "100%",
                    mt: 1,
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
                            disabled={actualizando}
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
                                <img src={miniaturaImagen} alt="Miniatura" />
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
                                    disabled={actualizando}
                                    variant="contained"
                                    component="label"
                                    color="info"
                                    startIcon={<CloudUploadOutlinedIcon />}
                                >
                                    Cambiar
                                    <input hidden accept="image/*" type="file" onChange={seleccionarImagen} />
                                </Button>
                                <Button
                                    disabled={actualizando}
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
                                    disabled={actualizando}
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
                            readOnly={actualizando}
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
            <Box sx={{ width: "100%", mt: 2 }}>
                <FormGroup sx={{ float: "right" }}>
                    <FormControlLabel
                        control={<Checkbox checked={noticiaBasica} onChange={(e) => setNoticiaBasica(e.target.checked)} />}
                        label="Noticia básica (solo Miniatura)"
                    />
                </FormGroup>
            </Box>

            {!noticiaBasica && (
                <>
                    <Typography
                        variant="h6"
                        sx={{
                            borderBottom: "1px solid lightgrey",
                            width: "100%",
                            mt: 5,
                            mb: 3,
                        }}
                    >
                        Contenido
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                        <ReactQuill
                            readOnly={actualizando}
                            theme="snow"
                            value={contenido}
                            onChange={(v) => {
                                setContenido(v);
                            }}
                            modules={{ toolbar: TOOLBAR_CONTENIDO }}
                        />
                    </Box>
                </>
            )}

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
                        disabled={actualizando}
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
                        disabled={actualizando}
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
                        disabled={actualizando}
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
            <SelectoresDeAudiencia value={audiencia} setValue={setAudiencia} disabled={actualizando} />
            <Box
                sx={{
                    mt: 4,
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                {mostrarMensajeOk && <Alert>Noticia actualizada con éxito</Alert>}

                <Button
                    disabled={actualizando}
                    variant="contained"
                    size="large"
                    startIcon={actualizando ? <CircularProgress size={26} color="secondary" /> : <SendIcon />}
                    onClick={actualizarNoticia}
                >
                    {actualizando ? "Actualizando" : "Actualizar"}
                </Button>
            </Box>
            {errorActualizacion && <BoxErrorApi msError={errorActualizacion} titulo="Ocurrió un error al actualizar la noticia" />}
        </Box>
    );
}
