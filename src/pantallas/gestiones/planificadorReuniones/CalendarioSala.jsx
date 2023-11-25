import { Box, Paper, styled, TextField, Typography } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { useSelector } from "react-redux";
import React from "react";
import { blue, red } from "@mui/material/colors";
import { addYears, format, isSameDay } from "date-fns";
import { selectSalaSeleccionada } from "../../../redux/api/salas/salasSlice.salas";
import { selectReservas } from "../../../redux/api/salas/salasSlice.reservas";


const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: (prop) =>
		prop !== 'diaReservado' && prop !== 'diaCompleto',
})(({ theme, diaReservado, diaCompleto }) => ({
	...(diaReservado && {
		borderRadius: 0,
		backgroundColor: blue[100],
		color: theme.palette.text.primary + ' !important',
		'&:hover, &:focus': {
			backgroundColor: theme.palette.primary.dark + ' !important',
			color: theme.palette.primary.contrastText,
		},
	}),
	...(diaCompleto && {
		borderRadius: 0,
		backgroundColor: red[50] + ' !important',
		color: theme.palette.text.primary + ' !important',
		'&:hover, &:focus': { backgroundColor: red[200] + ' !important' },
	}),
	borderTopLeftRadius: '50%',
	borderBottomLeftRadius: '50%',
	borderTopRightRadius: '50%',
	borderBottomRightRadius: '50%',
}));

const obtenerReservasDia = (fecha, reservas) => {
	return reservas?.filter(r => {
		return isSameDay(fecha, new Date(r.inicio))
	}) || []
}


const BoxDatosReserva = ({ id, empleado, asunto, comentario, inicio, fin, diaCompleto }) => {

	let fechas = null;

	if (diaCompleto) {
		fechas = <Typography component="span" variant="caption" sx={{ fontWeight: 'bold' }}>TODO EL DIA</Typography>
	} else {
		fechas = <Typography component="span" variant="caption" sx={{ fontWeight: 'bold' }}>{format(inicio, 'HH:mm')} » {format(fin, 'HH:mm')}</ Typography>
	}

	return <Box sx={{ mb: 1 }}>
		{fechas}
		<Typography component="div" variant="caption" sx={{ fontWeight: 'bold'}}>{asunto.toUpperCase()}</Typography>
		<Typography component="div" variant="caption" sx={{fontSize: '70%'}}>{empleado}</Typography>
		
	</Box>
}

export default function CalendarioSala({ fecha, setFecha }) {

	const reservasRedux = useSelector(selectReservas);
	const salaSeleccionada = useSelector(selectSalaSeleccionada);

	const reservasDiaSeleccionado = React.useMemo(() => {
		return obtenerReservasDia(fecha, reservasRedux.resultado);
	}, [fecha, reservasRedux.resultado])

	const fnRenderizarDiaCalendario = React.useCallback((date, _, pickersDayProps) => {
		let reservas = obtenerReservasDia(date, reservasRedux.resultado);
		return (
			<CustomPickersDay
				{...pickersDayProps}
				disableMargin
				diaReservado={Boolean(reservas.length)}
				diaCompleto={reservas?.[0]?.diaCompleto}
			/>
		);
	}, [reservasRedux.resultado]);


	if (!salaSeleccionada) return null;
	if (reservasRedux.estado === "cargando") {
		return "Cargando reservas"
	} else if (reservasRedux.error) {
		console.error(reservasRedux.error)
		return "Error en la carga"
	}

	return <Paper square elevation={3} sx={{ display: 'flex', justifyContent: 'left', width: '100%', py: 2, flexDirection: 'column',  }}>
		<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
			<StaticDatePicker
				displayStaticWrapperAs="desktop"
				renderDay={fnRenderizarDiaCalendario}
				value={fecha}
				onChange={setFecha}
				minDate={new Date()}
				maxDate={addYears(new Date(), 3)}
				disableHighlightToday
				renderInput={(params) => <TextField {...params} />}
			/>
		</LocalizationProvider>

		{reservasDiaSeleccionado.length > 0 && <>

			<Box sx={{ mx: 4 }}>
				<Typography variant="overline" sx={{ fontWeight: 'bold' }}>Reservas del día {format(fecha, 'dd MMMM', { locale: es })}</Typography>
				{reservasDiaSeleccionado.map(reserva => <BoxDatosReserva key={reserva.id} {...reserva} />)}
			</Box>
		</>
		}
	</Paper>

}