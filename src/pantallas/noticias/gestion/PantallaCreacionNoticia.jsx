import React from 'react';

import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Link } from 'react-router-dom';
import FormularioCreacionNoticia from './FormularioCreacionNoticia';




export default function PantallaCreacionNoticia() {

	return <>
		<Box sx={{ m: 'auto' }}>
			<Button variant="outlined" color="info" startIcon={<ArrowBackIcon />} sx={{ mb: 1 }} component={Link} to={'/noticias/gestion'}>
				Volver al listado de noticias
			</Button>

			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Crear nueva noticia</Typography>
		</Box>
		<FormularioCreacionNoticia />
	</>


}