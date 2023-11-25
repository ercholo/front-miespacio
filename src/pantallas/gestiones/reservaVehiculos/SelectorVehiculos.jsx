import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import BoxErrorApi from '../../../navegacion/BoxErrorApi';
import BoxCargando from '../../../navegacion/BoxCargando';
import MsRestError from '@hefame/microservice-rest-error';
import CalendarioVehiculo from './CalendarioVehiculo';





const SelectorVehiculos = ({ qVehiculos, vehiculos, matriculaSeleccionada, qVehiculo, vehiculo, fnSeleccionarVehiculo, onReservasModificadas}) => {


	if (qVehiculos.estado === 'cargando') {
		return <BoxCargando titulo="Obteniendo lista de vehículos" />;
	} else if (qVehiculos.error) {
		return <BoxErrorApi msError={qVehiculos.error} titulo="No se pudo obtener la lista de vehículos" />
	} if (!vehiculos?.length) {
		return <BoxErrorApi
			msError={new MsRestError('NO_VEHICLES_FOUND', 'No se han encontrado vehículos disponibles')}
			titulo="No se pudo obtener la lista de vehículos"
		/>
	}

	return <>
		<Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
			<FormControl >
				<InputLabel id="vehiculo-helper-label" color="secondary">Vehículo</InputLabel>
				<Select
					labelId="vehiculo-helper-label"
					value={matriculaSeleccionada}
					label="Vehiculo"
					onChange={(e) => fnSeleccionarVehiculo(e.target.value)}
					color="secondary"
					sx={{ width: { xs: '100%', lg: '50%' } }}
				>
					{vehiculos.map(v => <MenuItem key={v.matricula} value={v.matricula}>{v.descripcion} ({v.matricula})</MenuItem>)}
				</Select>
			</FormControl>
		</Box>

		<CalendarioVehiculo {...{ qVehiculo, vehiculo, onReservaModificada: onReservasModificadas }} />
	</>
}


export default SelectorVehiculos;



