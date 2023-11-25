import { Box, Typography } from "@mui/material";
import HistoricoReservas from "./HistoricoReservas";
import SelectorVehiculos from "./SelectorVehiculos";

import useMisReservas from "./hooks/useMisReservas";
import useVehiculos from "./hooks/useVehiculos";

//import CalendarioVehiculo from "./CalendarioVehiculo";


/**
 * PantallaReservaVehiculos
 *  |
 *  +--> SelectorVehiculos
 *  |      |
 * 	|      +--> CalendarioVehiculo
 *  |             |
 *  |             +--> LineaReserva
 *  |             +--> FormularioReserva
 *  |                    |
 *  |                    +--> DialogNormativa
 * 	|
 *  +--> HistoricoReservas
 *         |
 *         +--> LineaReserva
 */





export default function PantallaReservaVehiculos() {

	const { qMisReservas, misReservas, fnCargarMisReservas } = useMisReservas();
	const { qVehiculos, vehiculos, matriculaSeleccionada, qVehiculo, vehiculo, fnSeleccionarVehiculo, fnCargarReservasVehiculoSeleccionado, fnCargarVehiculos } = useVehiculos();

	const onReservasModificadas = () => {
		fnCargarMisReservas();
		fnCargarReservasVehiculoSeleccionado();
	}




	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Reserva de Vehículos</Typography>
		</Box>

		<SelectorVehiculos {...{ qVehiculos, vehiculos, matriculaSeleccionada, qVehiculo, vehiculo, fnSeleccionarVehiculo, fnCargarReservasVehiculoSeleccionado, fnCargarVehiculos, onReservasModificadas }} />

		<HistoricoReservas {...{ qMisReservas, misReservas, fnCargarMisReservas, onReservasModificadas }} />
	</>
}