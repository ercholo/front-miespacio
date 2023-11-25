import { Box, Typography } from "@mui/material";
import BoxHistoricoReservaSalas from "./BoxHistoricoReservaSalas";
import SelectorSalas from "./SelectorSalas";
//import CalendarioSalas from "./CalendarioSalas";





export default function PantallaPlanificadorReuniones() {


	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Reserva de Salas</Typography>
		</Box>

		<SelectorSalas />
		
		<BoxHistoricoReservaSalas />

	</>
}