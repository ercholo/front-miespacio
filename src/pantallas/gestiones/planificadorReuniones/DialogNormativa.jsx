import React from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";

import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@emotion/react';




export default function DialogNormativa() {

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [abierto, setAbierto] = React.useState(false);

	return <>
		<Button variant="outlined" color="info" onClick={() => setAbierto(true)} startIcon={<HelpIcon />} >
			Normativa
		</Button>

		<Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={abierto} onClose={() => setAbierto(false)}		>
			<DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }} >
				Normativa de reserva de vehículos
				<IconButton onClick={() => setAbierto(false)} sx={{ position: 'absolute', right: 8, top: 4, color: (t) => t.palette.grey[800] }}			>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: 6, mt: { xs: 3, sm: 6 }, textAlign: { sm: 'justify' } }}>


				<Box>
					<Typography sx={{ mb: 2 }}>
						Normativa para la solicitud y uso de un vehículo de empresa.
					</Typography>
					<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
						Objeto
					</Typography>
					<Typography sx={{ mt: 2 }}>
						Para optimizar al máximo el uso de estos vehículos, los trayectos para los que se solicite deberán ser como <strong>mínimo de 200km/día</strong>.
					</Typography>
					<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
						Realizar la solicitud
					</Typography>
					<Typography sx={{ mt: 2 }}>
						Deberá realizar la solicitud del vehículo utilizando el formulario de esta misma página.
					</Typography>
					<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
						Recogida del vehículo
					</Typography>
					<Typography sx={{ mt: 2 }}>
						El día de recogida del vehículo se solicitará a Gestión de Flota (ubicación Dpto. Financiero) la llave y las tarjetas (Solred-USC), firmando la entrega en el cuadrante correspondiente.
					</Typography>
					<Typography sx={{ mt: 2 }}>
						Al recoger el vehículo, éste llevará lleno el depósito de combustible y estará limpio (exterior). De no ser así, deberá notificarlo al Gestor de Flota.
					</Typography>
					<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
						Devolución del vehículo
					</Typography>
					<Typography sx={{ mt: 2 }}>
						La entrega del vehículo deberá hacerse con el depósito de combustible lleno y limpio (exterior). Para ello debe utilizarse la tarjeta Solred.
					</Typography>
					<Typography sx={{ mt: 2 }}>
						El vehículo se recogerá y se dejará estacionado en la zona reservada para vehículos de empresa.
					</Typography>
					<Typography sx={{ mt: 2 }}>
						Se entregará la llave y las tarjetas en Gestión de Flota, indicando los kilómetros que marque el vehículo y se firmará la entrega del mismo.
					</Typography>
					<Typography sx={{ mt: 2 }}>
						El equipo de Gestión de Flotas se reserva la opción de cancelar ante irregularidades.
					</Typography>
				</Box>



			</DialogContent>
			<DialogActions sx={{ px: 4, mb: 2 }}>
				<Button onClick={() => setAbierto(false)} color="secondary" variant="outlined" startIcon={<CloseIcon />}>Cerrar</Button>
			</DialogActions>
		</Dialog>
	</>

}