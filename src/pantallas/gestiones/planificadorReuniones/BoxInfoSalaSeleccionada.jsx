import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectSalaSeleccionada } from "../../../redux/api/salas/salasSlice.salas";



export default function BoxInfoSalaSeleccionada() {
	const salaSeleccionada = useSelector(selectSalaSeleccionada);

	if (!salaSeleccionada) return null;

	return <Box sx={{ my: 2 }}>

		<Typography variant="h5">
			{salaSeleccionada.nombreZona} » {salaSeleccionada.nombre}
		</Typography>
		<Typography variant="body2" color="disabled">{salaSeleccionada.medios}</Typography>
		<Typography variant="caption">Aforo: {salaSeleccionada.aforo} personas</Typography>

	</Box>
}