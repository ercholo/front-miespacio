import React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery } from "@mui/material";

import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@emotion/react';




export default function DialogNormativaViajes() {

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [abierto, setAbierto] = React.useState(false);

	return <>
		<Button variant="text" color="secondary" onClick={() => setAbierto(true)} sx={{ m: 0, p: 0 }}>
			normativa de uso de viajes
		</Button>

		<Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={abierto} onClose={() => setAbierto(false)}		>
			<DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }} >
				Normativa de uso de viajes
				<IconButton onClick={() => setAbierto(false)} sx={{ position: 'absolute', right: 8, top: 4, color: (t) => t.palette.grey[800] }}			>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: {xs: 3, sm: 6}, mt: { xs: 3, sm: 6 }, textAlign: { sm: 'justify' } }}>

				<Typography sx={{fontWeight: 'bold'}}>
					Normativa de uso:
				</Typography>

				<List sx={{ width: '100%' }}>


					<ListItem >
						<ListItemIcon sx={{minWidth: 20}}><CircleIcon sx={{ fontSize: '50%' }} /></ListItemIcon>
						<ListItemText 
							primary="Por motivos fiscales y de control, es obligatoria su cumplimentación por parte del empleado o persona autorizada."
						/>
					</ListItem>

					<ListItem>
						<ListItemIcon sx={{ minWidth: 20 }}><CircleIcon sx={{ fontSize: '50%' }} /></ListItemIcon>
						<ListItemText
							primary="Por favor, rellene el presente formulario para solicitar el transporte y/o alojamiento. Éste se enviará automáticamente a la agencia de viajes para su gestión, por lo que se ruega hacerlo con la mayor anticipación."
						/>
					</ListItem>

					<ListItem>
						<ListItemIcon sx={{ minWidth: 20 }}><CircleIcon sx={{ fontSize: '50%' }} /></ListItemIcon>
						<ListItemText
							primary="Rellene los campos obligatorios. Para cumplir con la fiscalidad en los viajes de empresa es importante especificar el motivo de viaje en el campo indicado."
						/>
					</ListItem>

					<ListItem>
						<ListItemIcon sx={{ minWidth: 20 }}><CircleIcon sx={{ fontSize: '50%' }} /></ListItemIcon>
						<ListItemText
							primary='Añada cualquier comentario adicional no contemplado en "Observaciones".'
						/>
					</ListItem>

					<ListItem>
						<ListItemIcon sx={{ minWidth: 20 }}><CircleIcon sx={{ fontSize: '50%' }} /></ListItemIcon>
						<ListItemText
							primary="La solicitud podrá ser confirmada con su responsable en caso de duda."
						/>
					</ListItem>
				</List>

			</DialogContent>
			<DialogActions sx={{ px: 4, mb: 2 }}>
				<Button onClick={() => setAbierto(false)} color="secondary" variant="outlined" startIcon={<CloseIcon />}>Cerrar</Button>
			</DialogActions>
		</Dialog>
	</>

}