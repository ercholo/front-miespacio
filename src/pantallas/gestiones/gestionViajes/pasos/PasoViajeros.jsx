import React from "react";
import { MenuItem, Select, InputLabel, FormControl, CircularProgress, Box, Typography, TextField, Paper } from "@mui/material";
import { consultaMaestroAsignaciones } from "../../../../redux/api/maestroAsignaciones/maestroAsignacionesSlice";
import { useDispatch, useSelector } from "react-redux";


export const PasoViajeros = ({ dispatcher, numeroViajeros, datosViajeros }) => {

	const dispatch = useDispatch();
	let estadoCargaAsignaciones = useSelector(state => state.maestroAsignaciones.estado);
	// let errorCargaAsignaciones = useSelector(state => state.maestroAsignaciones.error);
	let resultadoCargaAsignaciones = useSelector(state => state.maestroAsignaciones.resultado);

	let centrosDeCoste = React.useMemo(() => {
		if (resultadoCargaAsignaciones) {
			let a = resultadoCargaAsignaciones.find(asigancion => asigancion.clave === 'centroCoste');
			if (a.valores) return a.valores;
		}
		return null;
	}, [resultadoCargaAsignaciones])

	React.useEffect(() => {
		if (estadoCargaAsignaciones === 'inicial') {
			dispatch(consultaMaestroAsignaciones());
		}
	}, [dispatch, estadoCargaAsignaciones])

	return <Box>
		<Typography variant="h6" sx={{mb: 2}}>Datos de los viajeros</Typography>
		<FormControl variant="outlined" sx={{ mr: 2, my: 2 }}>

			<TextField
				//disabled={actualizando}
				color="secondary"
				variant="outlined"
				label="Número de viajeros"
				type="number"
				value={numeroViajeros}
				onChange={(e) => dispatcher('setNumeroViajeros', e.target.value)}
				sx={{ width: '100%' }}
				//inputProps={{ inputMode: 'numeric', pattern: '[1-9]' }}
				InputLabelProps={{ shrink: true }}
			/>

		</FormControl>

		{
			datosViajeros.filter((_, i) => i < numeroViajeros).map((viajero, i) => <Paper key={i} square elevation={2} sx={{ px: 4, py: 3, mb: 2 }}>
				<Typography variant="h6">Viajero #{i + 1}</Typography>
				<TextField
					//disabled={actualizando}
					color="secondary"
					variant="outlined"
					label="Nombre y apellidos"
					required
					defaultValue={viajero.nombre}
					onChange={(e) => dispatcher('setNombreViajero', { index: i, payload: e.target.value })}
					error={!Boolean(viajero.nombre.trim())}
					sx={{ width: '100%', mt: 1 }}
				/>
				{estadoCargaAsignaciones === 'cargando' &&
					<Box sx={{ mt: 2 }}><CircularProgress size={32} /> Cargando centros de coste</Box>
				}
				{estadoCargaAsignaciones === 'completado' &&
					<FormControl variant="outlined" sx={{ mr: 2, my: 2 }}>
						<InputLabel id="tipoViaje-label" color="secondary">Centro de coste</InputLabel>
						<Select
							//disabled={actualizando}
							required
							labelId="tipoViaje-label"
							value={viajero.centroCoste}
							onChange={(e) => dispatcher('setCentroCosteViajero', { index: i, payload: e.target.value })}
							label="Centro de coste"
							color="secondary"
						//sx={{ width: '100%' }}
						>
							{centrosDeCoste && centrosDeCoste.map(centroCoste =>
								<MenuItem key={centroCoste.codigo} value={centroCoste.codigo}>{centroCoste.codigo} - {centroCoste.descripcion}</MenuItem>)}
						</Select>
					</FormControl>
				}
			</Paper>)
		}

	</Box>
}
