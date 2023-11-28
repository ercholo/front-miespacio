import { Masonry } from "@mui/lab";
import { Alert, AlertTitle, CircularProgress, Typography } from "@mui/material";

import { Box } from "@mui/system";
import SAP from "../../api/sap";
import {useAutorizacion} from "../../hooks/useAutorizacion";
import { BoxErrorAutorizacion } from "../BoxErrorAutorizacion";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { consultarAnticipos } from "../../redux/api/anticiposSlice";
import BoxPrestamo from "./BoxPrestamo";
import DialogInformacionAnticipos from "./DialogInformacionAnticipos";

import DialogSolicitarAnticipo from "./DialogSolicitarAnticipo";
import TableHistoricoAnticipos from "./TableHistoricoAnticipos";
import BoxAnticipo from "./BoxAnticipo";


export default function PantallaAnticipos() {

	const autorizado = useAutorizacion({ areaPersonal: "HF" });
	const dispatch = useDispatch();
	const resultado = useSelector(state => state.anticipos.resultado);
	const estado = useSelector(state => state.anticipos.estado);
	const error = useSelector(state => state.anticipos.error);

	React.useEffect(() => {
		if (autorizado)
			dispatch(consultarAnticipos());
	}, [dispatch, autorizado])

	if (!autorizado) {
		return <BoxErrorAutorizacion />
	}

	if (estado === "cargando" || estado === "inicial") {
		return <>
			<Box sx={{ m: 'auto' }}>
				<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Gestión de anticipos</Typography>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
				<CircularProgress size={40} />
				<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando datos de anticipos</Typography>
			</Box>
		</>
	} else if (error) {
		return <>
			<Box sx={{ m: 'auto' }}>
				<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Gestión de anticipos</Typography>
			</Box>
			<Alert severity="error" >
				<AlertTitle>Ocurrió un error al realizar la consulta</AlertTitle>
				{SAP.err2text(error)}
			</Alert>
		</>
	}

	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Gestión de anticipos</Typography>
		</Box>
		<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { xs: 'center', md: 'flex-end' }, my: 2 }}>
			<DialogSolicitarAnticipo />
			<DialogInformacionAnticipos />
		</Box>

		<Typography variant="h5" sx={{ my: 2 }} component="div">Anticipos sobre pagas</Typography>

		<Masonry columns={{ xs: 2, md: 3, lg: 4 }} spacing={2}>
			{resultado.anticipos.map(anticipo => <BoxAnticipo key={anticipo.nombre} {...anticipo} />)}
		</Masonry>

		<Typography variant="h5" sx={{ mt: 6, mb: 2 }} component="div">Préstamos de empresa</Typography>
		{resultado.prestamos.map(prestamo => <BoxPrestamo key={prestamo.nombre} {...prestamo} />)}

		<TableHistoricoAnticipos />


	</>

}