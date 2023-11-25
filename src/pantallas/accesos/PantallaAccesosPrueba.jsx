import React, { useEffect } from 'react';

import { Alert, AlertTitle, Box, CircularProgress, TextField, Typography } from "@mui/material";

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';


import FastfoodIcon from '@mui/icons-material/Fastfood';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import HardwareIcon from '@mui/icons-material/Hardware';
import LogoutIcon from '@mui/icons-material/Logout';

import { es } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

import { useDispatch, useSelector } from 'react-redux';
import SAP from '../../api/sap';
import { consultarAccesos } from '../../redux/api/accesosSlice';
import { differenceInMinutes, format, formatDuration, parse } from 'date-fns';


/*
const Acceso = ({ direccion, hora, motivo, transcurrido }) => {
	return <Typography component="div">{direccion}, {format(hora, 'HH:mm')}, {motivo}, {transcurrido}</Typography>
}
*/


export default function PantallaAccesosPrueba() {

	const dispatch = useDispatch();
	const [fecha, setFecha] = React.useState(new Date());

	useEffect(() => {
		dispatch(consultarAccesos({ fecha }))
	}, [dispatch, fecha])

	const estadoConsultaAccesos = useSelector(state => state.accesos.estado);
	const accesos = useSelector(state => state.accesos.resultado);
	const error = useSelector(state => state.accesos.error);

	const fichajes = React.useMemo(() => {

		let f = [];

		let ultimaSalida = null;

		accesos?.forEach((fichaje, i) => {

			let entrada = parse(fichaje.entrada, 'HHmmSS', new Date())
			let salida = fichaje.salida === '000000' ? null : parse(fichaje.salida, 'HHmmSS', new Date())

			if (ultimaSalida) {
				ultimaSalida.transcurrido = differenceInMinutes(entrada, ultimaSalida.hora);
			}

			f.push({ direccion: 'entrada', hora: entrada, transcurrido: differenceInMinutes(salida || new Date(), entrada) })

			if (salida) {
				ultimaSalida = { direccion: 'salida', hora: salida, motivo: fichaje.motivo };
				f.push(ultimaSalida);
			}

		})
		return f.map((e, i) => {
			return <>
				<TimelineItem key={i}>
					<TimelineOppositeContent sx={{ py: 2 }}>
						{e.direccion === "entrada" && 'Entrada a trabajar'}
						{e.direccion === "salida" && e.motivo === 3 && 'Descanso'}
						{e.direccion === "salida" && e.motivo === 5 && 'Tranajo exterior'}
						{e.direccion === "salida" && e.motivo === null && 'Salida'}
						<Typography variant="body2">
							{formatDuration({ hours: Math.floor(e.transcurrido / 60), minutes: e.transcurrido % 60 }, { locale: es })}
						</Typography>
					</TimelineOppositeContent>
					<TimelineSeparator>
						{e.direccion === "entrada" && <TimelineDot color="primary"><WarehouseIcon /></TimelineDot>}
						{e.direccion === "salida" && e.motivo === 3 && <TimelineDot color="secondary"><FastfoodIcon /></TimelineDot>}
						{e.direccion === "salida" && e.motivo === 5 && <TimelineDot color="error"><HardwareIcon /></TimelineDot>}
						{e.direccion === "salida" && e.motivo === null && <TimelineDot color="info"><LogoutIcon /></TimelineDot>}
						{i < f.length - 1 && <TimelineConnector />}
					</TimelineSeparator>
					<TimelineContent color="text.secondary" sx={{ py: 2 }}>
						{format(e.hora, 'HH:mm')}
					</TimelineContent>
				</TimelineItem>

			</>
		});

	}, [accesos])

	let contenido = null;

	if (estadoConsultaAccesos === "cargando") {
		contenido = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
			<CircularProgress size={40} />
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando vales</Typography>
		</Box>
	} else if (error) {
		contenido = <Alert severity="error" >
			<AlertTitle>Ocurrió un error al realizar la consulta</AlertTitle>
			{SAP.err2text(error)}
		</Alert>
	} else if (fichajes?.length > 0) {
		contenido = <Timeline position="left">
			{fichajes}
		</Timeline>
	} else {
		contenido = <Box sx={{ m: 'auto', textAlign: 'center' }}>
			<div><SentimentNeutralIcon sx={{ width: '60px', height: '60px', color: 'secondary.light' }} /></div>
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Sin resultados</Typography>
		</Box>
	}

	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Mis accesos</Typography>
			<Typography>Para consultar tus datos de acceso selecciona la fecha que desees consultar.</Typography>
			<Box sx={{ mb: 4, mt: 3, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, flexDirection: 'row' }}>
				<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
					<DatePicker

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