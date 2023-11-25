import React from 'react';
import { Box, Paper, styled, TextField, } from '@mui/material';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { addDays, addYears, differenceInCalendarDays, endOfDay, isBefore, isSameDay, isWithinInterval, startOfDay, subDays } from 'date-fns';
import { red } from '@mui/material/colors';

// import FormularioReservaVehiculo from './FormularioReservaVehiculo';
import { BoxErrorApi } from '../../../navegacion/BoxErrorApi';
import { BoxCargando } from '../../../navegacion/BoxCargando';
import LineaReserva from './LineaReserva';
import FormularioReservaVehiculo from './FormularioReservaVehiculo';




const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: (prop) =>
		prop !== 'diaReservado' && prop !== 'isFirstDay' && prop !== 'isLastDay' && prop !== 'diaSeleccionado',
})(({ theme, diaReservado, diaSeleccionado, isFirstDay, isLastDay }) => ({
	...(diaSeleccionado && {
		borderRadius: 0,
		backgroundColor: theme.palette.primary.light + ' !important',
		color: theme.palette.primary.contrastText + ' !important',
		// '&:hover, &:focus': { backgroundColor: theme.palette.primary.dark + ' !important' },
	}),
	...(diaReservado && {
		borderRadius: 0,
		backgroundColor: red[50] + ' !important',
		color: theme.palette.common.black + ' !important',
		// '&:hover, &:focus': { backgroundColor: red[200] + ' !important' },
	}),
	...(diaSeleccionado && diaReservado && {
		borderRadius: 0,
		backgroundColor: red[200] + ' !important',
		color: theme.palette.common.black + ' !important',
		// '&:hover, &:focus': { backgroundColor: red[200] + ' !important' },
	}),
	...(isFirstDay && {
		borderTopLeftRadius: '50%',
		borderBottomLeftRadius: '50%',
	}),
	...(isLastDay && {
		borderTopRightRadius: '50%',
		borderBottomRightRadius: '50%',
	}),
}));


/**
 * Determina si la fecha está dentro del rango de las fechas de la reserva
 */
const hayColision = (fecha, intervaloFechas) => {

	return isWithinInterval(
		fecha,
		{
			start: startOfDay(intervaloFechas.fechaInicio || intervaloFechas.inicio),
			end: endOfDay(intervaloFechas.fechaFin || intervaloFechas.fin)
		}
	);
}

export default function CalendarioVehiculo({ qVehiculo, vehiculo, onReservaModificada }) {

	const [seleccion, _setSeleccion] = React.useState({ inicio: null, fin: null, modo: 'inicio', reserva: null })

	React.useEffect(() => {
		_setSeleccion({ inicio: null, fin: null, modo: 'inicio', reserva: null });
	}, [vehiculo])


	const reservaSeleccionada = seleccion.reserva;

	const obtenerReserva = React.useCallback((fecha, opciones = { proxima: false }) => {
		if (!fecha) return null;
		let reservas = vehiculo.reservas || [];

		let { proxima, diaPrevioProxima } = opciones;
		if (proxima || diaPrevioProxima) {
			let proximaReserva = reservas.find(r => differenceInCalendarDays(r.fechaInicio, fecha) > 0)
			if (proximaReserva && diaPrevioProxima)
				return endOfDay(subDays(proximaReserva.fechaInicio, 1))
			return proximaReserva;
		}
		return reservas.find(r => hayColision(fecha, r));
	}, [vehiculo])

	const onFechaSeleccionada = React.useCallback((nuevaFecha) => {

		const establecerFechaInicio = (nuevaFecha) => {
			// Para la fecha inicial, salvo que pille un dia reservado, se establece siempre.
			let reserva = obtenerReserva(nuevaFecha);
			if (!reserva) {
				_setSeleccion({ inicio: nuevaFecha, fin: nuevaFecha, modo: 'fin', reserva: null })
			} else {
				_setSeleccion({ inicio: nuevaFecha, fin: nuevaFecha, modo: 'inicio', reserva })
			}
		}


		if (seleccion.modo === 'inicio') {
			establecerFechaInicio(nuevaFecha);
		} else {
			// La fecha seleccionada es ANTERIOR a la inicial. Se cambia la inicial.
			if (isBefore(nuevaFecha, seleccion.inicio)) {
				establecerFechaInicio(nuevaFecha);
				return;
			}

			// Buscamos la siguiente reserva
			let proximaReserva = obtenerReserva(seleccion.inicio, { proxima: true });
			console.log(proximaReserva);

			if (!proximaReserva || isBefore(nuevaFecha, startOfDay(proximaReserva.fechaInicio))) {
				_setSeleccion(f => {
					return { inicio: f.inicio, fin: nuevaFecha, modo: 'inicio', reserva: null }
				})
			} else {
				// La fecha seleccionada es POSTERIOR al inicio de la proxima reserva
				// Si la fecha elegida NO está reservada, la ponemos como fecha de FIN
				let reserva = obtenerReserva(nuevaFecha);
				if (!reserva) {
					_setSeleccion({ inicio: nuevaFecha, fin: nuevaFecha, modo: 'fin', reserva: null })
				} else {
					_setSeleccion({ inicio: nuevaFecha, fin: nuevaFecha, modo: 'inicio', reserva })
				}
			}
		}
	}, [seleccion, obtenerReserva])

	const fnRenderizarDiaCalendario = React.useCallback((fechaPintar, _, pickersDayProps) => {
		let reservas = vehiculo?.reservas || [];
		let reserva = reservas.find(r => isWithinInterval(fechaPintar, { start: startOfDay(r.fechaInicio), end: endOfDay(r.fechaFin) }));
		let seleccionado = (seleccion.inicio && seleccion.fin) ? hayColision(fechaPintar, seleccion) : false;

		return (
			<CustomPickersDay
				{...pickersDayProps}
				disableMargin
				diaReservado={Boolean(reserva)}
				diaSeleccionado={Boolean(seleccionado)}
				isFirstDay={(reserva && isSameDay(fechaPintar, reserva.fechaInicio)) || (!reserva && seleccion.inicio && isSameDay(fechaPintar, seleccion.inicio))}
				isLastDay={(reserva && isSameDay(fechaPintar, reserva.fechaFin)) || (!reserva && seleccion.fin && isSameDay(fechaPintar, seleccion.fin))}
			/>
		);
	}, [vehiculo, seleccion]);

	// ----

	if (qVehiculo.estado === "cargando") {
		return <BoxCargando titulo="Cargando calendario del vehículo" />
	}
	else if (qVehiculo.error) {
		return <BoxErrorApi msError={qVehiculo.error} titulo="Ocurrió un error al obtener los datos del vehículo" />
	}
	else if (!vehiculo) {
		return null;
	}

	return <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', mt: 2 }}>
		<Paper square elevation={1} sx={{ display: 'flex', justifyContent: 'center', width: { xs: '100%', md: 'auto' }, py: 1, mb: 2, mr: { md: 2 } }}>
			<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
				<StaticDatePicker
					displayStaticWrapperAs="desktop"
					renderDay={fnRenderizarDiaCalendario}
					value={seleccion.inicio}
					defaultCalendarMonth={addDays(new Date(), 1)}
					onChange={onFechaSeleccionada}
					minDate={addDays(new Date(), 1)}
					maxDate={addYears(new Date(), 3)}
					disableHighlightToday
					renderInput={(params) => <TextField {...params} />}
				/>
			</LocalizationProvider>
		</Paper>

		<Box sx={{ display: 'flex', flexGrow: 1, width: '100%', }}>
			{
				reservaSeleccionada ?
					<LineaReserva {...reservaSeleccionada} onReservaEliminada={onReservaModificada} mostrarSolicitante />
					:
					<FormularioReservaVehiculo rangoFechas={seleccion} vehiculo={vehiculo} onReservaCreada={onReservaModificada} />
			}
		</Box>

	</Box>


}

