
import { Alert, AlertTitle, Box, Button, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AutoDeleteOutlinedIcon from '@mui/icons-material/AutoDeleteOutlined';

import { differenceInMinutes, format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SAP from "../../../api/sap";
import { consultarMisReservas, marcarParaBorrar, selectMisReservasSalas } from "../../../redux/api/salas/salasSlice.misReservas";



const LineaHistorioReservaSala = ({ id, sala, zona, inicio, fin }) => {

	const dispatch = useDispatch();
	const estadoCancelacion = useSelector(state => state.salas.cancelacionReserva);

	const cancelando = (estadoCancelacion.idReserva === id) && estadoCancelacion.estado === 'cargando';

	const fnCancelarReserva = () => {
		dispatch(marcarParaBorrar({ id }));
	}


	const duracion = differenceInMinutes(fin, inicio);
	const diaCompleto = (duracion === 1439); // 1440 minutos tiene un día !

	return <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}	>
		<TableCell align="center">
			<Typography variant="body2" component="div">{sala}</Typography>
			<Typography variant="caption" component="div" sx={{ fontSize: '80%' }}>{zona}</Typography>
		</TableCell>

		{diaCompleto ?
			<>
				<TableCell align="center">{format(inicio, 'dd/MM/yy', { locale: es })}</TableCell>
				<TableCell align="center">Todo el día</TableCell>
			</>
			:
			<>
				<TableCell align="center">{format(inicio, 'dd/MM/yy HH:mm', { locale: es })}</TableCell>
				<TableCell align="center">
					{parseInt(duracion / 60) && parseInt(duracion / 60) + 'h '}
					{parseInt(duracion % 60) > 0 && parseInt(duracion % 60) + 'min'}
				</TableCell>
			</>
		}

		<>
			<TableCell align="center" sx={{ display: { md: 'none' } }}>
				{cancelando ?
					<CircularProgress size={20} color="error" />
					:
					<IconButton color="error" onClick={fnCancelarReserva}><AutoDeleteOutlinedIcon /></IconButton>
				}
			</TableCell>
			<TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
				{cancelando ?
					<CircularProgress size={20} color="error" />
					:
					<Button size="small" color="error" onClick={fnCancelarReserva} >Cancelar</Button>
				}
			</TableCell>
		</>
	</TableRow>
}


export default function BoxHistoricoReservaSalas() {

	const dispatch = useDispatch();
	const misReservas = useSelector(selectMisReservasSalas);

	React.useEffect(() => {
		dispatch(consultarMisReservas())
	}, [dispatch])

	let contenido = null;
	if (misReservas.estado === 'cargando') {
		contenido = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
			<CircularProgress size={40} />
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando próximas reservas</Typography>
		</Box>
	} else if (misReservas.error) {
		contenido = <Alert severity="error" sx={{ mt: 4 }}>
			<AlertTitle>Error al obtener el histórico de reservas</AlertTitle>
			{SAP.err2text(misReservas.error)}
		</Alert>
	} else if (!misReservas.resultado?.length) {
		contenido = <Alert severity="info">
			No tienes ninguna sala reservada
		</Alert>
	} else {
		contenido = <TableContainer component={Paper} elevation={3} sx={{ p: { xs: 0, sm: 2, md: 2 } }}>
			<Table size="small" >
				<TableHead>
					<TableRow >
						<TableCell align="center">Sala</TableCell>
						<TableCell align="center">Fecha</TableCell>
						<TableCell align="center">Duración</TableCell>
						<TableCell align="center"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{misReservas.resultado.map((reserva, i) => <LineaHistorioReservaSala key={i} {...reserva} />)}
				</TableBody>
			</Table>
		</TableContainer>
	}


	return <>
		<Typography variant="h5" sx={{ mb: 2, mt: 8 }}>Mis próximas reservas</Typography>
		<Box>
			{contenido}
		</Box>
	</>
}