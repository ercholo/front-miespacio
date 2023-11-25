import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import API from "../../api/api";
import { BoxCargando } from "../../navegacion/BoxCargando";
import { BoxErrorApi } from "../../navegacion/BoxErrorApi";
import React from "react";
import { useStore } from "react-redux";
import { useParams } from "react-router";
import { useSnackbar } from "notistack";
import { isBefore } from "date-fns";
import { useAutorizacion } from "../../hooks/useAutorizacion";

export default function PantallaEncuestas() {
	const redux = useStore();
	const { idEncuesta } = useParams();

	const [qEncuesta, setQEncuesta] = React.useState({
		estado: "cargando",
		encuesta: null,
		error: null,
	});

	const fnObtenerDatosEncuesta = React.useCallback(async () => {
		setQEncuesta((d) => {
			return { estado: "cargando", error: null, encuesta: d.encuesta };
		});

		try {
			let datosEncuesta = await API(redux).empleados.encuestas.get(idEncuesta);
			setQEncuesta({
				estado: "completado",
				error: null,
				encuesta: datosEncuesta,
			});
		} catch (error) {
			setQEncuesta({ estado: "error", error, encuesta: null });
		}
	}, [idEncuesta, setQEncuesta, redux]);

	React.useEffect(() => {
		fnObtenerDatosEncuesta();
	}, [fnObtenerDatosEncuesta]);

	if (qEncuesta.estado === "cargando") {
		return <BoxCargando titulo="Recuperando información de la encuesta" />;
	}
	if (qEncuesta.error) {
		return <BoxErrorApi msError={qEncuesta.error} titulo="No se pudo cargar la información de la encuesta" />;
	}
	if (!qEncuesta.encuesta) {
		return <BoxErrorApi titulo="No se encuentra información de la encuesta" />;
	}

	const encuesta = qEncuesta.encuesta;

	return <FormularioEncuesta {...encuesta} />;
}

const useDebeMostrarseEncuesta = (encuesta) => {
	let usuarioAutorizado = useAutorizacion(encuesta.audiencia);

	if (!usuarioAutorizado) {
		return {
			debeMostrarse: false,
			textoError: "Esta encuesta no es para ti.",
		};
	}

	if (encuesta.estado !== "activa") {
		return {
			debeMostrarse: false,
			textoError: "La encuesta no está activa.",
		};
	}

	if (isBefore(new Date(encuesta.fechaExpiracion), new Date())) {
		return {
			debeMostrarse: false,
			textoError: "El plazo para cumplimentar la encuesta expiró.",
		};
	}

	if (isBefore(new Date(), new Date(encuesta.fechaPublicacion))) {
		return {
			debeMostrarse: false,
			textoError: "La encuesta aún no está disponible.",
		};
	}

	return {
		debeMostrarse: true,
	};
};

const FormularioEncuesta = ({ id, titulo, texto, campos, estado, fechaPublicacion, fechaExpiracion, audiencia, anonima, respuesta }) => {
	const redux = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const [qResponder, setQResponder] = React.useState({
		estado: "completado",
		error: null,
	});
	const [contestacion, setContestacion] = React.useState(respuesta);
	const dispatcher = React.useCallback(
		(nombreCampo, valor) => {
			setContestacion((c) => {
				return {
					...c,
					[nombreCampo]: valor,
				};
			});
		},
		[setContestacion]
	);
	const fnEnviarRespuesta = React.useCallback(async () => {
		delete contestacion._contestada;
		delete contestacion._codigoEmpleado;
		setQResponder({ estado: "cargando", error: null });
		try {
			await API(redux).empleados.encuestas.post(id, contestacion);
			setQResponder({ estado: "completado", error: null });
			enqueueSnackbar("Encuesta cumplimentada", { variant: "success" });
		} catch (error) {
			setQResponder({ estado: "error", error });
			enqueueSnackbar(<BoxErrorApi snackbar msError={error} titulo="Error al guardar su respuesta" />, { variant: "error" });
		}
	}, [setQResponder, enqueueSnackbar, redux, id, contestacion]);
	const cargando = qResponder.estado === "cargando";

	const { debeMostrarse, textoError } = useDebeMostrarseEncuesta({ estado, fechaPublicacion, fechaExpiracion, audiencia });

	if (!debeMostrarse) {
		return <BoxErrorApi titulo={textoError} />;
	}

	return (
		<Box>
			<Typography variant="h4" sx={{ m: "auto", mb: 2 }}>
				{titulo}
			</Typography>
			<div dangerouslySetInnerHTML={{ __html: texto || "CARGAME" }} />
			<Box sx={{ my: 2, display: "flex", flexDirection: "column" }}>
				{campos.map((campo, i) => (
					<FactoriaInputs key={i} {...campo} respuesta={contestacion} dispatcher={dispatcher} cargando={cargando} />
				))}
			</Box>

			{respuesta._contestada === true && (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Alert sx={{ width: { xs: "100%", md: "70%", lg: "50%" } }}>
						Ya has respondido, ¡pero puedes actualizar tu respuesta si quieres!
					</Alert>
				</Box>
			)}

			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: { xs: "column", sm: "row" },
				}}
			>
				<Button
					sx={{ mx: 2, mt: 1, minWidth: { xs: "100%", sm: "" } }}
					variant="contained"
					startIcon={<SendIcon />}
					onClick={() => fnEnviarRespuesta()}
					size="large"
					disabled={cargando}
				>
					{respuesta._contestada === true ? "Actualizar" : "Enviar"}
				</Button>
			</Box>
		</Box>
	);
};

const FactoriaInputs = ({ respuesta, dispatcher, cargando, ...campo }) => {
	switch (campo.tipo) {
		case "select":
			return <CampoSelect {...campo} respuesta={respuesta[campo.nombre]} dispatcher={dispatcher} cargando={cargando} />;
		case "texto":
			return <CampoTexto {...campo} respuesta={respuesta[campo.nombre]} dispatcher={dispatcher} cargando={cargando} />;
		default:
			return JSON.stringify(campo);
	}
};

const CampoSelect = ({ respuesta, dispatcher, cargando, ...campo }) => {
	return (
		<FormControl sx={{ mt: 2 }}>
			<InputLabel id={`${campo.nombre}-helper-label`} color="secondary">
				{campo.texto}
			</InputLabel>
			<Select
				labelId={`${campo.nombre}-helper-label`}
				value={respuesta || ""}
				label={campo.texto}
				color="secondary"
				sx={{ width: { xs: "100%", sm: "40ch" } }}
				onChange={(e) => dispatcher(campo.nombre, e.target.value)}
				disabled={cargando}
			>
				{campo.opciones.map(({ valor, texto }, i) => (
					<MenuItem key={i} value={valor}>
						{texto}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

const CampoTexto = ({ respuesta, dispatcher, cargando, ...campo }) => {
	return (
		<TextField
			label={campo.texto}
			variant="outlined"
			margin="normal"
			// autoFocus
			multiline={Boolean(campo.multilinea)}
			rows={parseInt(campo.multilinea) || 1}
			color="secondary"
			disabled={cargando}
			value={respuesta || ""}
			onChange={(e) => dispatcher(campo.nombre, e.target.value)}
			sx={{ mt: 2 }}
		/>
	);
};
