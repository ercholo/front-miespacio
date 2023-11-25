import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { consultarZonas, seleccionarZona } from '../../../redux/api/salas/salasSlice.zonas';
import { seleccionarSala } from '../../../redux/api/salas/salasSlice.salas';
import ReservasSala from './ReservasSala';

const SelectorSala = () => {

	const dispatch = useDispatch();
	const salasRedux = useSelector(state => state.salas.salas);
	const salaSeleccionada = useSelector(state => state.salas.salaSeleccionada);
	const zonaSeleccionada = useSelector(state => state.salas.zonaSeleccionada);

	const fnSeleccionarSala = (e) => {
		dispatch(seleccionarSala({ codigoSala: e.target.value }));
	}

	if (!zonaSeleccionada) return null;

	if (salasRedux.estado === 'cargando') {
		return 'cargando salas';
	} else if (salasRedux.error) {
		return 'error salas: ' + salasRedux.error.message;
	} if (!salasRedux.resultado?.length) {
		return 'lista de salas vacia'
	}

	return <FormControl >
		<InputLabel id="sala-helper-label" color="secondary">Sala</InputLabel>
		<Select
			labelId="sala-helper-label"
			value={salaSeleccionada || ''}
			label="Sala"
			onChange={fnSeleccionarSala}
			color="secondary"
			sx={{ width: { xs: '100%', md: '40ch' } }}
		>
			{salasRedux.resultado.map(s => <MenuItem key={s.codigo} value={s.codigo}>{s.nombre}</MenuItem>)}
		</Select>
	</FormControl>
}

const SelectorZona = () => {

	const dispatch = useDispatch();
	const zonasRedux = useSelector(state => state.salas.zonas);
	const zonaSeleccionada = useSelector(state => state.salas.zonaSeleccionada);

	const fnSeleccionarZona = (e) => {
		dispatch(seleccionarZona({ codigoZona: e.target.value }));
	}

	React.useEffect(() => {
		dispatch(consultarZonas());
	}, [dispatch])

	if (zonasRedux.estado === 'cargando') {
		return 'cargando salas';
	} else if (zonasRedux.error) {
		return 'error salas: ' + zonasRedux.error.message;
	} if (!zonasRedux.resultado?.length) {
		return 'lista de salas vacia'
	}


	return <FormControl sx={{ mr: { md: 2 }, mb: { xs: 2, md: 0 } }} >
		<InputLabel id="centro-helper-label" color="secondary">Centro</InputLabel>
		<Select
			labelId="centro-helper-label"
			value={zonaSeleccionada || ''}
			label="Centro"
			onChange={fnSeleccionarZona}
			color="secondary"
			sx={{ width: { xs: '100%', md: '30ch' } }}
		>
			{zonasRedux.resultado.map(c => <MenuItem key={c.codigo} value={c.codigo}>{c.nombre}</MenuItem>)}
		</Select>
	</FormControl>
}

export default function SelectorSalas() {
	return <>
		<Typography variant="h5" sx={{ mb: 2, mt: 4 }}>Reservar una sala</Typography>

		<Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>
			<SelectorZona />
			<SelectorSala />
		</Box>

		<Box sx={{ mt: 2 }}>
			<ReservasSala />
		</Box>

	</>


}



