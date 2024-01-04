import { API } from '../../../../api/api';
import { addMonths } from 'date-fns';
import React from 'react';
import { useStore } from 'react-redux';

const useMisReservas = () => {

	const redux = useStore();
	const [qMisReservas, setMisReservas] = React.useState({
		estado: 'inicial',
		error: null,
		reservas: []
	});

	const fnCargarMisReservas = React.useCallback(async () => {
		setMisReservas({ estado: 'cargando', error: null, reservas: [] })
		try {
			const respuestaApi = await API(redux).empleados.reservas.vehiculo.get({
				desde: new Date(),
				hasta: addMonths(new Date(), 1)
			});
			setMisReservas({ estado: 'completado', error: null, reservas: respuestaApi })
		} catch (error) {
			setMisReservas({ estado: 'error', error, reservas: [] })
		}
	}, [redux, setMisReservas])

	React.useEffect(() => {fnCargarMisReservas()}, [fnCargarMisReservas]);

	return { 
		qMisReservas, 
		misReservas: qMisReservas.reservas, 
		fnCargarMisReservas 
	}

}

export default useMisReservas;