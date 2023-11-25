import { Paper, Typography } from "@mui/material";

import { Box } from "@mui/system";
import { PieChart } from 'react-minimal-pie-chart';



export default function BoxAnticipo({ nombre, disponible, pendienteAprobar, concedido }) {
	const datosQuesito = [];

	let i = 0;
	if ((disponible - pendienteAprobar) >= 1) datosQuesito.push({ key: i++, title: 'Disponible', value: disponible - pendienteAprobar, color: '#baffab' })
	if (pendienteAprobar) datosQuesito.push({ key: i++, title: 'Pendiente', value: pendienteAprobar, color: '#facaa2' })
	if (concedido) datosQuesito.push({ key: i, title: 'Concedido', value: concedido, color: '#e6e6e6' })

	let hayDatos = true;
	if (datosQuesito.length === 0) {
		datosQuesito.push({ key: i, title: 'No disponible', value: 100, color: '#f2f2f2' })
		hayDatos = false;
	}

	return <Paper elevation={3} square sx={{ pb: 2 }} >

		<Typography variant="overline" sx={{ pt: 1, px: 2, fontWeight: 'bold' }} component="div">
			{nombre}
		</Typography>

		<Box sx={{ mx: { xs: 'auto', sm: 4 }, my: 2, maxWidth: { xs: 120, sm: 200 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
			<PieChart data={datosQuesito} lineWidth={hayDatos ? 50 : 25} animate
				label={({ x, y, dx, dy, dataEntry }) => (
					<text
						key={dataEntry.key}
						x={x} y={y} dx={dx} dy={dy}
						dominantBaseline="central"
						textAnchor="middle"
						style={dataEntry.title === 'Disponible' ?
							{ fontSize: '10px', fontWeight: 'bold' } :
							{ fontSize: '10px', color: '#e6e6e6' }}
					>
						{dataEntry.title === 'Disponible' && `${dataEntry.value.toFixed(2)}€`}
						{dataEntry.title === 'Pendiente' && `${dataEntry.value.toFixed(2)}€`}
					</text>
				)}
			/>
		</Box>

		{hayDatos ? <>
			{(disponible - pendienteAprobar) >= 1 && <>
				<Typography variant="body1" sx={{ pt: 1, px: 2 }} component="div">
					Disponible
				</Typography>
				<Typography variant="body1" sx={{ pb: 1, px: 2, fontWeight: 'bold' }} component="div">
					{(disponible - pendienteAprobar).toFixed(2)}€
				</Typography>
			</>
			}
			{pendienteAprobar > 0 && <>
				<Typography variant="body1" sx={{ pt: 1, px: 2 }} component="div">
					Pendiente de aprobación
				</Typography>
				<Typography variant="body1" sx={{ pb: 1, px: 2, fontWeight: 'bold' }} component="div">
					{pendienteAprobar.toFixed(2)}€
				</Typography>
			</>
			}

			{concedido > 0 && <>
				<Typography variant="body1" sx={{ pt: 1, px: 2 }} component="div">
					Concedido
				</Typography>
				<Typography variant="body1" sx={{ pb: 1, px: 2, fontWeight: 'bold' }} component="div">
					{concedido.toFixed(2)}€
				</Typography>
			</>
			}
		</>
			:
			<Typography variant="body1" sx={{ mt: 4, px: 2, textAlign: 'center' }} component="div">
				No tiene solicitado este anticipo y actualmente no es posible solicitarlo.
			</Typography>
		}

	</Paper>
}