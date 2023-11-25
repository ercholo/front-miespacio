import React from "react";
import { useStore } from "react-redux";
import API from "../../../api/api";

import { Box, Paper, TextField, Typography } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LoadingButton } from "@mui/lab";

import EventIcon from "@mui/icons-material/Event";

import { addHours, addMinutes, differenceInCalendarDays, endOfDay, format } from "date-fns";
import { es } from "date-fns/locale";

import DialogNormativa from "./DialogNormativa";
import BoxErrorApi from "../../../navegacion/BoxErrorApi";



const formatearFecha = (fecha) => {
	return format(fecha, "dd MMMM yyyy", { locale: es })
}

export default function FormularioReservaVehiculo({ rangoFechas, vehiculo, onReservaCreada }) {

	const redux = useStore();
	const [qCrearReserva, setqCrearReserva] = React.useState({
		estado: 'inicial',
		error: null
	})

	// CAMPOS DEL FORMULARIO
	const [horaRecogida, _setHoraRecogida] = React.useState(new Date(2020, 1, 1, 9, 0, 0));
	const setHoraRecogida = (hora) => _setHoraRecogida(hora ? hora : new Date(2020, 1, 1, 9, 0, 0));
	const [asunto, setAsunto] = React.useState('');
	const [comentario, setComentario] = React.useState('');

	const fnReservarVehiculo = React.useCallback(async () => {

		const fechaInicio = addHours(addMinutes(rangoFechas.inicio, horaRecogida.getMinutes()), horaRecogida.getHours());
		const fechaFin = endOfDay(rangoFechas.fin);

		const datosReserva = {
			vehiculo: {
				matricula: vehiculo.matricula,
				descripcion: vehiculo.descripcion
			},
			fechaInicio,
			fechaFin,
			asunto,
			comentario
		}

		try {
			setqCrearReserva({ estado: 'cargando', error: null })
			await API(redux).empleados.reservas.vehiculo.post(datosReserva);
			setqCrearReserva({ estado: 'inicial', error: null });
			onReservaCreada();

		} catch (error) {
			setqCrearReserva({ estado: 'error', error });
		}

	}, [redux, vehiculo, rangoFechas, horaRecogida, asunto, comentario, onReservaCreada])

	const fnLimpiarError = React.useCallback(async () => {
		setqCrearReserva({ estado: 'inicial', error: null });
	}, [setqCrearReserva])

	const estiloPaper = {
		py: 4,
		px: 4,
		flexBasis: '100%',
		borderLeftColor: 'secondary.light',
		borderLeftStyle: 'solid',
		borderLeftWidth: 2
	}

	if (!vehiculo) return null;
	if (!rangoFechas || !rangoFechas.inicio || !rangoFechas.fin) return (
		<Paper square elevation={1} sx={estiloPaper}>
			<Typography variant="h6" sx={{ mb: 1 }}>
				Seleccione una fecha disponible
			</Typography>
		</Paper>
	);

	const cargando = qCrearReserva.estado === 'cargando';

	const diferenciaDias = differenceInCalendarDays(rangoFechas.fin, rangoFechas.inicio) + 1;

	return <Paper square elevation={1} sx={estiloPaper}>
		<Typography variant="h6" sx={{ mb: 1 }}>
			{vehiculo.descripcion}
			<Typography variant="caption" sx={{ ml: 2 }}> {vehiculo.matricula}</Typography>
		</Typography>

		<Typography variant="body1" sx={{ mb: 1 }}>
			Día de recogida: <strong>{formatearFecha(rangoFechas.inicio)}</strong>
		</Typography>
		<Typography variant="body1" sx={{ mb: 2 }}>
			Día de retorno: <strong>{formatearFecha(rangoFechas.fin)}</strong>
		</Typography>

		<Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row' }}>
			<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
				<TimePicker
					label="Hora recogida"
					value={horaRecogida}
					onChange={setHoraRecogida}
					disabled={cargando}
					renderInput={(params) =>
						<TextField
							{...params}
							color="secondary"
							label="Hora de salida"
							sx={{ width: '24ch' }}
						/>
					}
				/>
			</LocalizationProvider>
		</Box>

		<TextField
			color="secondary"
			variant="outlined"
			required
			fullWidth
			label="Asunto del viaje"
			value={asunto}
			onChange={e => setAsunto(e.target.value)}
			error={!Boolean(asunto)}
			disabled={cargando}
			sx={{ my: 2 }}
		/>
		<TextField
			color="secondary"
			label="Descipción y nombre de viajeros"
			fullWidth
			value={comentario}
			onChange={e => setComentario(e.target.value)}
			multiline
			rows={3}
			disabled={cargando}
			sx={{ mb: 2 }}
		/>

		{qCrearReserva.error &&

			<BoxErrorApi msError={qCrearReserva.error} titulo="Ocurrió un error al reservar el vehículo" onClose={fnLimpiarError} snackbar={{
				open: Boolean(qCrearReserva.error),
				autoHideDuration: 6000,
				onClose: fnLimpiarError
			}} />

		}

		<Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: { xs: 'column', lg: 'row' } }}>
			<DialogNormativa disabled={cargando} />

			<LoadingButton
				variant="contained"
				startIcon={<EventIcon />}
				onClick={fnReservarVehiculo}
				disabled={!Boolean(asunto)}
				loading={cargando}
				sx={{ ml: { lg: 2 }, mt: { xs: 1, lg: 0 } }}
			>
				Reservar vehículo ({diferenciaDias} día{diferenciaDias !== 1 && 's'})
			</LoadingButton>


		</Box>
	</Paper>


}

