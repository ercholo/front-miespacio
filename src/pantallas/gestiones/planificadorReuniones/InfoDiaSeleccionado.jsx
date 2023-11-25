import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import React from "react";
import { selectReservas } from "../../../redux/api/salas/salasSlice.reservas";
import { selectSalaSeleccionada } from "../../../redux/api/salas/salasSlice.salas";
import { reservarSala } from "../../../redux/api/salas/salasSlice.misReservas";
import useFormularioReservaSala from "./hookFormularioReservaSala";

import { format, setMinutes, setHours, isWithinInterval, subMinutes, isSameDay, isPast, addMinutes, startOfDay, endOfDay, formatDuration } from "date-fns";
import { es } from "date-fns/locale";
import { useSelector, useDispatch }from "react-redux";

const DURACION_MINIMA_TRAMO = 30;
const horaMinima = (dia) => setMinutes(setHours(dia, 7), 0);
const horaMaxima = (dia) => setMinutes(setHours(dia, 20), 0);

const formatearFecha = (fecha) => {
	return format(fecha, "dd MMMM yyyy", { locale: es })
}



const obtenerReservaEnHora = (fecha, reservas) => reservas?.find(r => isWithinInterval(fecha, { start: new Date(r.inicio), end: subMinutes(new Date(r.fin), 1) }))
const generarTramos = (fecha, reservas) => {

	// let fechaBase = startOfDay(fecha);
	let fechaBase = horaMinima(fecha);
	let tramos = [];
	let diaCompletoDisponible = true;
	while (isSameDay(fechaBase, fecha)) {
		let reserva = obtenerReservaEnHora(fechaBase, reservas);
		if (reserva) diaCompletoDisponible = false;
		tramos.push({
			fecha: fechaBase,
			texto: format(fechaBase, 'HH:mm'),
			valor: format(fechaBase, 'HHmm'),
			disponible: Boolean(!reserva) && !isPast(fechaBase)
		});
		fechaBase = addMinutes(fechaBase, DURACION_MINIMA_TRAMO)
	}

	let minutosAcumulados = DURACION_MINIMA_TRAMO;

	for (let i = tramos.length - 1; i >= 0; i--) {
		let e = tramos[i];
		if (e.disponible) {
			e.duracionMax = minutosAcumulados;
			minutosAcumulados += DURACION_MINIMA_TRAMO;
		} else {
			e.duracionMax = 0;
			minutosAcumulados = DURACION_MINIMA_TRAMO;
		}
	}

	return {
		tramos,
		diaCompletoDisponible
	};
}

export default function InfoDiaSeleccionado({ fecha }) {

	const dispatch = useDispatch();

	const reservasRedux = useSelector(selectReservas);
	const salaSeleccionada = useSelector(selectSalaSeleccionada);

	const { tramos, diaCompletoDisponible } = React.useMemo(() => generarTramos(fecha, reservasRedux.resultado), [fecha, reservasRedux.resultado]);

	const { asunto, setAsunto,
		comentario, setComentario,
		diaCompleto, setDiaCompleto,
		hora, setHora,
		duracion, setDuracion,
		duracionesDisponibles,
		primerTramoDecenteDisponible } = useFormularioReservaSala(fecha, tramos);

	const opcionesMenuTramos = React.useMemo(() => {
		const rt = [];
		const intervaloValido = {
			start: horaMinima(fecha),
			end: horaMaxima(fecha)
		}
		let modoNoDisponible = true;
		tramos.forEach(t => {
			if (t.disponible) {
				if (isWithinInterval(t.fecha, intervaloValido)) {
					rt.push(<MenuItem key={t.valor} value={t.valor}>{t.texto}</MenuItem>)
					modoNoDisponible = false;
				}
				return;
			}
			else {
				if (!modoNoDisponible) {
					rt.push(<MenuItem key={t.valor} disabled value={t.valor} sx={{ fontStyle: 'italic' }}>reservado</MenuItem>)
					modoNoDisponible = true;
				}
			}
		})

		return rt;
	}, [fecha, tramos]);

	const fnReservarSala = React.useCallback(() => {
		let fechaInicio = hora.setSeconds(0);
		let fechaFin = addMinutes(fechaInicio, duracion).setSeconds(0);

		if (diaCompleto) {
			fechaInicio = startOfDay(fechaInicio);
			fechaFin = endOfDay(fechaFin);
		}
		dispatch(reservarSala({
			codigoZona: salaSeleccionada.codigoZona,
			codigoSala: salaSeleccionada.codigo,
			inicio: fechaInicio,
			fin: fechaFin,
			motivo: asunto,
			comentario
		}));

	}, [dispatch, hora, duracion, asunto, comentario, diaCompleto, salaSeleccionada]);

	if (!salaSeleccionada) return null;

	if (!fecha) return <Paper square elevation={3} sx={{ py: 4, px: 4, flexBasis: '100%' }}>
		<Typography variant="h6" sx={{ mb: 1 }}>
			Seleccione una fecha disponible
		</Typography>
	</Paper>

	if (!primerTramoDecenteDisponible) return <Paper square elevation={3} sx={{ py: 4, px: 4, flexBasis: '100%' }}>
		<Typography variant="h6" sx={{ mb: 1 }}>
			{salaSeleccionada.nombre}
			<Typography variant="caption" sx={{ ml: 2 }}>
				{salaSeleccionada.nombreZona}
			</Typography>
		</Typography>

		<Typography variant="body1" sx={{ mb: 1 }}>
			Día: <strong>{formatearFecha(fecha)}</strong>
		</Typography>

		<Alert severity="error">
			Esta sala esta reservada para todo el día.
		</Alert>

	</Paper>

	return <Paper square elevation={3} sx={{ py: 4, px: { xs: 2, md: 4 }, flexBasis: '100%' }}>
		<Typography variant="h6" sx={{ mb: 1 }}>
			{salaSeleccionada.nombre}
			<Typography variant="caption" sx={{ ml: 2 }}>
				{salaSeleccionada.nombreZona}
			</Typography>
		</Typography>

		<Typography variant="body1" sx={{ mb: 3 }}>
			Día: <strong>{formatearFecha(fecha)}</strong>
		</Typography>

		<Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: { xs: 'column', lg: 'row' }, alignItems: { xs: 'flex-start', lg: 'center' } }}>
			<FormControl variant="outlined" sx={{ mr: 2, mb: { xs: 2, lg: 0 } }}>
				<InputLabel id="Hora-label" color="secondary">Hora de inicio</InputLabel>
				<Select
					disabled={diaCompletoDisponible && diaCompleto}
					labelId="Hora-label"
					value={format(hora, "HHmm")}
					onChange={e => setHora(e.target.value)}
					label="Hora de inicio"
					color="secondary"
					sx={{ width: '12ch' }}
				>
					{opcionesMenuTramos}
				</Select>
			</FormControl>

			<FormControl variant="outlined" sx={{ mr: 2, mb: { xs: 2, lg: 0 } }}>
				<InputLabel id="Duracion-label" color="secondary">Duración</InputLabel>
				<Select
					disabled={diaCompletoDisponible && diaCompleto}
					labelId="Duracion-label"
					value={duracion}
					onChange={e => setDuracion(e.target.value)}
					label="Duración"
					color="secondary"
					sx={{ width: '28ch' }}
				>
					{duracionesDisponibles.map(d => <MenuItem key={d} value={d}>
						{formatDuration({
							hours: parseInt(d / 60),
							minutes: d % 60
						}, { delimiter: ' y ', locale: es })}
					</MenuItem>)}
				</Select>
			</FormControl>

			<FormGroup sx={{ mb: { xs: 1, lg: 0 } }}>
				<FormControlLabel control={
					<Checkbox
						disabled={!diaCompletoDisponible}
						color="secondary"
						checked={diaCompletoDisponible && diaCompleto}
						onChange={e => setDiaCompleto(e.target.checked)}
					/>
				} label="Día completo" />
			</FormGroup>

		</Box>

		<TextField
			color="secondary"
			variant="outlined"
			required
			label="Motivo de la reunión"
			value={asunto}
			onChange={(e) => setAsunto(e.target.value)}
			error={!Boolean(asunto)}
			sx={{ my: 2, width: '100%' }}
		/>
		<TextField
			color="secondary"
			label="Comentarios"
			fullWidth
			value={comentario}
			onChange={(e) => setComentario(e.target.value)}
			multiline
			rows={3}
			sx={{ mb: 2, width: '100%' }}
		/>


		<Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
			<Button
				variant="contained"
				startIcon={<EventIcon />}
				onClick={fnReservarSala}
				disabled={!Boolean(asunto)}
				sx={{ mr: { lg: 2 }, mb: { xs: 1, lg: 0 } }}
			>
				Reservar sala
			</Button>
			{/*<DialogNormativa />*/}
		</Box>
	</Paper>


}