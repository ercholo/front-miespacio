import React, { useEffect } from 'react';

import { Alert, AlertTitle, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

import { es } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

import { useDispatch, useSelector } from 'react-redux';
import SAP from '../../api/sap';
import { consultarAccesos } from '../../redux/api/accesosSlice';



const TableRowAcceso = ({ entrada, salida, motivo, dispositivo, lugar }) => {

	let horaEntrada = entrada.substring(0, 2) + ':' + entrada.substring(2, 4);
	let horaSalida = salida.substring(0, 2) + ':' + salida.substring(2, 4);

	return <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}	>
		<TableCell align="center">{horaEntrada}</TableCell>
		<TableCell align="center">{horaSalida}</TableCell>
		<TableCell align="center">{motivo}</TableCell>
		<TableCell>{lugar}</TableCell>
	</TableRow>
}



export default function PantallaAccesos() {

	const dispatch = useDispatch();
	const [fecha, setFecha] = React.useState(new Date());

	useEffect(() => {
		dispatch(consultarAccesos({ fecha }))
	}, [dispatch, fecha])

	const estadoConsultaAccesos = useSelector(state => state.accesos.estado);
	const accesos = useSelector(state => state.accesos.resultado);
	const error = useSelector(state => state.accesos.error);


	let contenido = null;

	if (estadoConsultaAccesos === "cargando") {
		contenido = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
			<CircularProgress size={40} />
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando accesos ...</Typography>
		</Box>
	} else if (error) {
		contenido = <Alert severity="error" >
			<AlertTitle>Ocurrió un error al realizar la consulta</AlertTitle>
			{SAP.err2text(error)}
		</Alert>
	} else if (accesos?.length > 0) {
		contenido = <TableContainer component={Paper} sx={{ p: { xs: 0, sm: 2, md: 4 } }}>
			<Table size="small" >
				<TableHead>
					<TableRow >
						<TableCell align="center">Entrada</TableCell>
						<TableCell align="center">Salida</TableCell>
						<TableCell align="center">Motivo</TableCell>
						<TableCell >Lugar</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{accesos.map((acceso, i) => <TableRowAcceso key={i} {...acceso} />)}
				</TableBody>
			</Table>
		</TableContainer>
	} else {
		contenido = <Box sx={{ m: 'auto', textAlign: 'center' }}>
			<div><SentimentNeutralIcon sx={{ width: '60px', height: '60px', color: 'secondary.light' }} /></div>
			<Typography sx={{ mt: 1 }} variant="h5" component="div">No hay accesos</Typography>
		</Box>
	}

	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Mis accesos</Typography>
			<Typography>Para consultar tus datos de acceso selecciona la fecha que desees consultar.</Typography>
			<Box sx={{ mb: 4, mt: 3, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, flexDirection: 'row' }}>
				<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
					<DatePicker
						disabled={estadoConsultaAccesos === "cargando"}
						disableFuture
						value={fecha}
						onChange={setFecha}
						disableMaskedInput
						inputFormat="dd 'de' MMMM 'de' yyyy"
						renderInput={(params) =>
							<TextField
								{...params}
								onKeyDown={e => { e.preventDefault(); return false }}
							/>
						}
					/>
				</LocalizationProvider>
			</Box>
		</Box>

		{contenido}

	</>


}