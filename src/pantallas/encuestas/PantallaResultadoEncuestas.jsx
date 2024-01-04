import React from "react";
import { useStore } from "react-redux";
import { useParams } from "react-router";
import { API } from "../../api/api";
import { useAutorizacion } from "../../hooks/useAutorizacion";
import { BoxCargando, BoxErrorApi } from "../../navegacion/";
import { BoxErrorAutorizacion } from "../../pantallas/BoxErrorAutorizacion";
import { CsvBuilder } from "filefy";
import { Button } from "@mui/material";

export const PantallaResultadoEncuestas = () => {
	const autorizado = useAutorizacion({
		funcionAsignada: [70091000],
		codigoEmpleado: [92409705, 90101151],
	});

	const redux = useStore();
	const { idEncuesta } = useParams();

	const [qRespuestas, setQRespuestas] = React.useState({
		estado: "cargando",
		encuesta: null,
		error: null,
	});

	const fnObtenerRespuestasEncuesta = React.useCallback(async () => {
		setQRespuestas((d) => {
			return { estado: "cargando", error: null, encuesta: d.encuesta };
		});

		try {
			let respuestas = await API(redux).encuestas.idEncuesta.respuestas.get(idEncuesta);
			setQRespuestas({
				estado: "completado",
				error: null,
				encuesta: respuestas,
			});
		} catch (error) {
			setQRespuestas({ estado: "error", error, encuesta: null });
		}
	}, [idEncuesta, setQRespuestas, redux]);

	React.useEffect(() => {
		fnObtenerRespuestasEncuesta();
	}, [fnObtenerRespuestasEncuesta]);

	if (!autorizado) return <BoxErrorAutorizacion />;

	if (qRespuestas.estado === "cargando") {
		return <BoxCargando titulo="Recuperando resultados ...." />;
	}
	if (qRespuestas.error) {
		return <BoxErrorApi msError={qRespuestas.error} titulo="No se pudo cargar la información de la encuesta" />;
	}
	if (!qRespuestas.encuesta) {
		return <BoxErrorApi titulo="No hay resultados" />;
	}

	const respuestas = qRespuestas.encuesta.map((r) => {
		const respuestaSaneada = {
			codigoEmpleado: r._codigoEmpleado,
			nombreEmpleado: r._nombreEmpleado,
			emailEmpleado: r._emailEmpleado,
			...r._asignaciones,
		};

		delete r._codigoEmpleado;
		delete r._nombreEmpleado;
		delete r._emailEmpleado;
		delete r._asignaciones;
		delete r._contestada;

		return { ...respuestaSaneada, ...r };
	});

	const columnas = Object.keys(respuestas[0]).map((k) => {
		return {
			id: k,
			label: k,
		};
	});

	const exportar = () => {
		new CsvBuilder("encuesta.csv")
			.setColumns(columnas.map((c) => c.label))
			.addRows(respuestas.map((row) => Object.values(row).map((v) => `${String(v).replaceAll(/[\r\n"]+/gi, "")}`)))
			.exportFile();
	};

	return (
		<>
			<Button variant="contained" color="secondary" onClick={exportar}>
				EXPORTAR RESULTADOS
			</Button>
		</>
	);
}
