import { Grid, Typography } from "@mui/material";

import BoxErrorApi from "../../../navegacion/BoxErrorApi";
import BoxCargando from "../../../navegacion/BoxCargando";
import LineaReserva from "./LineaReserva";


export default function HistoricoReservas({ qMisReservas, misReservas, onReservasModificadas }) {

	let contenido = null;
	if (qMisReservas.estado === 'cargando') {
		contenido = <BoxCargando titulo="Cargando sus próximas reservas" />
	} else if (qMisReservas.error) {
		contenido = <BoxErrorApi msError={qMisReservas.error} titulo="No se han podido obtener sus reservas" />
	} else if (!misReservas?.length) {
		contenido = null
	} else {
		contenido = <>
			<Typography variant="h5" sx={{ mb: 2, mt: 8 }}>Mis próximas reservas</Typography>
			<Grid container spacing={2}>
				{misReservas.map(reserva => (
					<Grid item key={reserva.id} xs={12} md={6}>
						<LineaReserva onReservaEliminada={onReservasModificadas} {...reserva} />
					</Grid>
				)
				)}

			</Grid>
		</>
	}

	return contenido;
}