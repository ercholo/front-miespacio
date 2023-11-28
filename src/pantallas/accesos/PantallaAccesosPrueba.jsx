import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SAP from '../../api/sap';
import { consultarAccesos } from '../../redux/api/accesosSlice';

import { Alert, AlertTitle, Box, CircularProgress, Typography } from "@mui/material";

import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab/';

import FastfoodIcon from '@mui/icons-material/Fastfood';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import HardwareIcon from '@mui/icons-material/Hardware';
import LogoutIcon from '@mui/icons-material/Logout';

import { es } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

import { differenceInMinutes, format, formatDuration, parse } from 'date-fns';

export const PantallaAccesosPrueba = () => {

	const dispatch = useDispatch();
	const [fecha, setFecha] = useState(new Date());

	useEffect(() => {
		dispatch(consultarAccesos({ fecha }))
	}, [dispatch, fecha])

	const estadoConsultaAccesos = useSelector(state => state.accesos.estado);
	const accesos = useSelector(state => state.accesos.resultado);
	const error = useSelector(state => state.accesos.error);

	const fichajes = useMemo(() => {

		let f = [];

		let ultimaSalida = null;

		accesos?.forEach((fichaje) => {

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
			return (
				<div key={i}>
					
					<TimelineItem >
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

				</div>
			)
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
						slotProps={{
							textField: {
								onBeforeInput: (e) => {
									e.preventDefault();
									return false;
								},
							}
						}}
					/>
				</LocalizationProvider>
			</Box>
		</Box>
		{contenido}
	</>
}